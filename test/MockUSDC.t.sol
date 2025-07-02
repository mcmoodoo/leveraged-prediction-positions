// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract MockUSDCTest is Test {
    MockUSDC public mockUSDC;
    address user = address(0x1);

    function setUp() public {
        mockUSDC = new MockUSDC();
    }

    function test_Deployment() public view {
        assertEq(mockUSDC.name(), "Mock USD Coin");
        assertEq(mockUSDC.symbol(), "mockUSDC");
        assertEq(mockUSDC.decimals(), 6);
        assertEq(mockUSDC.totalSupply(), 1000000 * 10**6);
        assertEq(mockUSDC.balanceOf(address(this)), 1000000 * 10**6);
    }

    function test_Mint() public {
        uint256 mintAmount = 1000 * 10**6;
        uint256 initialBalance = mockUSDC.balanceOf(user);
        
        mockUSDC.mint(user, mintAmount);
        
        assertEq(mockUSDC.balanceOf(user), initialBalance + mintAmount);
        assertEq(mockUSDC.totalSupply(), 1000000 * 10**6 + mintAmount);
    }

    function test_MintOnlyOwner() public {
        vm.prank(user);
        vm.expectRevert();
        mockUSDC.mint(user, 1000 * 10**6);
    }

    function test_Burn() public {
        uint256 burnAmount = 1000 * 10**6;
        uint256 initialBalance = mockUSDC.balanceOf(address(this));
        
        mockUSDC.burn(burnAmount);
        
        assertEq(mockUSDC.balanceOf(address(this)), initialBalance - burnAmount);
        assertEq(mockUSDC.totalSupply(), 1000000 * 10**6 - burnAmount);
    }

    function test_BurnFrom() public {
        uint256 burnAmount = 1000 * 10**6;
        mockUSDC.mint(user, burnAmount);
        
        vm.prank(user);
        mockUSDC.approve(address(this), burnAmount);
        
        mockUSDC.burnFrom(user, burnAmount);
        
        assertEq(mockUSDC.balanceOf(user), 0);
    }

    function test_Transfer() public {
        uint256 transferAmount = 1000 * 10**6;
        uint256 initialBalance = mockUSDC.balanceOf(address(this));
        
        mockUSDC.transfer(user, transferAmount);
        
        assertEq(mockUSDC.balanceOf(address(this)), initialBalance - transferAmount);
        assertEq(mockUSDC.balanceOf(user), transferAmount);
    }
}