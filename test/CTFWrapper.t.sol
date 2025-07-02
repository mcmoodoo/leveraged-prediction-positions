// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {CTFWrapper} from "../src/CTFWrapper.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MockERC1155 is ERC1155 {
    constructor() ERC1155("") {}

    function mint(address to, uint256 id, uint256 amount, bytes memory data) public {
        _mint(to, id, amount, data);
    }
}

contract CTFWrapperTest is Test {
    CTFWrapper public ctfWrapper;
    MockERC1155 public mockCTF;
    uint256 public constant TOKEN_ID = 33064224357523449786613480102704635026181428303479305990935387590344871823925;
    
    address user1 = address(0x1);
    address user2 = address(0x2);

    function setUp() public {
        mockCTF = new MockERC1155();
        ctfWrapper = new CTFWrapper(
            address(mockCTF),
            TOKEN_ID,
            "Wrapped CTF Token",
            "wCTF"
        );

        // Mint some ERC1155 tokens to users for testing
        mockCTF.mint(user1, TOKEN_ID, 1000, "");
        mockCTF.mint(user2, TOKEN_ID, 500, "");
    }

    function test_Deployment() public view {
        assertEq(ctfWrapper.name(), "Wrapped CTF Token");
        assertEq(ctfWrapper.symbol(), "wCTF");
        assertEq(address(ctfWrapper.ctfContract()), address(mockCTF));
        assertEq(ctfWrapper.tokenId(), TOKEN_ID);
        assertEq(ctfWrapper.totalSupply(), 0);
    }

    function test_Wrap() public {
        uint256 wrapAmount = 100;
        
        vm.startPrank(user1);
        mockCTF.setApprovalForAll(address(ctfWrapper), true);
        
        uint256 initialCTFBalance = mockCTF.balanceOf(user1, TOKEN_ID);
        uint256 initialWrappedBalance = ctfWrapper.balanceOf(user1);
        
        ctfWrapper.wrap(wrapAmount);
        
        assertEq(mockCTF.balanceOf(user1, TOKEN_ID), initialCTFBalance - wrapAmount);
        assertEq(ctfWrapper.balanceOf(user1), initialWrappedBalance + wrapAmount);
        assertEq(ctfWrapper.totalSupply(), wrapAmount);
        assertEq(ctfWrapper.getWrappedBalance(), wrapAmount);
        
        vm.stopPrank();
    }

    function test_WrapRevertOnZeroAmount() public {
        vm.startPrank(user1);
        mockCTF.setApprovalForAll(address(ctfWrapper), true);
        
        vm.expectRevert("Amount must be greater than 0");
        ctfWrapper.wrap(0);
        
        vm.stopPrank();
    }

    function test_Unwrap() public {
        uint256 wrapAmount = 100;
        
        // First wrap tokens
        vm.startPrank(user1);
        mockCTF.setApprovalForAll(address(ctfWrapper), true);
        ctfWrapper.wrap(wrapAmount);
        
        uint256 initialCTFBalance = mockCTF.balanceOf(user1, TOKEN_ID);
        uint256 initialWrappedBalance = ctfWrapper.balanceOf(user1);
        uint256 unwrapAmount = 50;
        
        ctfWrapper.unwrap(unwrapAmount);
        
        assertEq(mockCTF.balanceOf(user1, TOKEN_ID), initialCTFBalance + unwrapAmount);
        assertEq(ctfWrapper.balanceOf(user1), initialWrappedBalance - unwrapAmount);
        assertEq(ctfWrapper.totalSupply(), wrapAmount - unwrapAmount);
        assertEq(ctfWrapper.getWrappedBalance(), wrapAmount - unwrapAmount);
        
        vm.stopPrank();
    }

    function test_UnwrapRevertOnZeroAmount() public {
        vm.startPrank(user1);
        vm.expectRevert("Amount must be greater than 0");
        ctfWrapper.unwrap(0);
        vm.stopPrank();
    }

    function test_UnwrapRevertOnInsufficientBalance() public {
        vm.startPrank(user1);
        vm.expectRevert("Insufficient wrapped tokens");
        ctfWrapper.unwrap(100);
        vm.stopPrank();
    }

    function test_GetUserCTFBalance() public view {
        assertEq(ctfWrapper.getUserCTFBalance(user1), 1000);
        assertEq(ctfWrapper.getUserCTFBalance(user2), 500);
    }

    function test_MultipleUsersWrapUnwrap() public {
        uint256 user1WrapAmount = 200;
        uint256 user2WrapAmount = 300;
        
        // User1 wraps
        vm.startPrank(user1);
        mockCTF.setApprovalForAll(address(ctfWrapper), true);
        ctfWrapper.wrap(user1WrapAmount);
        vm.stopPrank();
        
        // User2 wraps
        vm.startPrank(user2);
        mockCTF.setApprovalForAll(address(ctfWrapper), true);
        ctfWrapper.wrap(user2WrapAmount);
        vm.stopPrank();
        
        // Check balances
        assertEq(ctfWrapper.balanceOf(user1), user1WrapAmount);
        assertEq(ctfWrapper.balanceOf(user2), user2WrapAmount);
        assertEq(ctfWrapper.totalSupply(), user1WrapAmount + user2WrapAmount);
        
        // User1 unwraps partially
        vm.startPrank(user1);
        ctfWrapper.unwrap(100);
        vm.stopPrank();
        
        assertEq(ctfWrapper.balanceOf(user1), user1WrapAmount - 100);
        assertEq(ctfWrapper.totalSupply(), user1WrapAmount + user2WrapAmount - 100);
    }

    function test_WrapEvent() public {
        uint256 wrapAmount = 100;
        
        vm.startPrank(user1);
        mockCTF.setApprovalForAll(address(ctfWrapper), true);
        
        vm.expectEmit(true, false, false, true);
        emit CTFWrapper.Wrapped(user1, wrapAmount);
        
        ctfWrapper.wrap(wrapAmount);
        vm.stopPrank();
    }

    function test_UnwrapEvent() public {
        uint256 wrapAmount = 100;
        uint256 unwrapAmount = 50;
        
        // First wrap
        vm.startPrank(user1);
        mockCTF.setApprovalForAll(address(ctfWrapper), true);
        ctfWrapper.wrap(wrapAmount);
        
        vm.expectEmit(true, false, false, true);
        emit CTFWrapper.Unwrapped(user1, unwrapAmount);
        
        ctfWrapper.unwrap(unwrapAmount);
        vm.stopPrank();
    }
}