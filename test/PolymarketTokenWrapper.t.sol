// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PolymarketTokenWrapper.sol";

contract MockConditionalTokens {
    mapping(uint256 => mapping(address => uint256)) public balances;
    
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata
    ) external {
        require(balances[id][from] >= amount, "Insufficient balance");
        balances[id][from] -= amount;
        balances[id][to] += amount;
    }
    
    function mint(address to, uint256 id, uint256 amount) external {
        balances[id][to] += amount;
    }
    
    function balanceOf(address account, uint256 id) external view returns (uint256) {
        return balances[id][account];
    }
    
    function getCollectionId(
        bytes32,
        bytes32,
        uint256 indexSet
    ) external pure returns (bytes32) {
        return bytes32(indexSet);
    }
    
    function getPositionId(
        address,
        bytes32 collectionId
    ) external pure returns (uint256) {
        return uint256(collectionId);
    }
    
    function supportsInterface(bytes4) external pure returns (bool) {
        return true;
    }
}

contract MockERC20 {
    mapping(address => uint256) public balanceOf;
    
    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }
}

contract PolymarketTokenWrapperTest is Test {
    PolymarketTokenWrapper public yesWrapper;
    PolymarketTokenWrapper public noWrapper;
    MockConditionalTokens public conditionalTokens;
    MockERC20 public usdc;
    
    address public user = address(0x123);
    bytes32 public conditionId = bytes32(uint256(0x456));
    
    function setUp() public {
        conditionalTokens = new MockConditionalTokens();
        usdc = new MockERC20();
        
        yesWrapper = new PolymarketTokenWrapper(
            "Wrapped YES Token",
            "wYES",
            address(conditionalTokens),
            address(usdc),
            conditionId,
            true
        );
        
        noWrapper = new PolymarketTokenWrapper(
            "Wrapped NO Token",
            "wNO",
            address(conditionalTokens),
            address(usdc),
            conditionId,
            false
        );
    }
    
    function testWrapYesToken() public {
        uint256 amount = 1000e6;
        uint256 yesTokenId = yesWrapper.getUnderlyingTokenId();
        
        conditionalTokens.mint(user, yesTokenId, amount);
        
        vm.startPrank(user);
        conditionalTokens.safeTransferFrom(user, user, yesTokenId, 0, "");
        yesWrapper.wrap(amount);
        vm.stopPrank();
        
        assertEq(yesWrapper.balanceOf(user), amount);
        assertEq(conditionalTokens.balanceOf(address(yesWrapper), yesTokenId), amount);
    }
    
    function testUnwrapYesToken() public {
        uint256 amount = 1000e6;
        uint256 yesTokenId = yesWrapper.getUnderlyingTokenId();
        
        conditionalTokens.mint(user, yesTokenId, amount);
        
        vm.startPrank(user);
        yesWrapper.wrap(amount);
        yesWrapper.unwrap(amount);
        vm.stopPrank();
        
        assertEq(yesWrapper.balanceOf(user), 0);
        assertEq(conditionalTokens.balanceOf(user, yesTokenId), amount);
    }
    
    function testWrapNoToken() public {
        uint256 amount = 1000e6;
        uint256 noTokenId = noWrapper.getUnderlyingTokenId();
        
        conditionalTokens.mint(user, noTokenId, amount);
        
        vm.startPrank(user);
        noWrapper.wrap(amount);
        vm.stopPrank();
        
        assertEq(noWrapper.balanceOf(user), amount);
        assertEq(conditionalTokens.balanceOf(address(noWrapper), noTokenId), amount);
    }
    
    function test_RevertWhen_WrapZeroAmount() public {
        vm.prank(user);
        vm.expectRevert("Amount must be greater than 0");
        yesWrapper.wrap(0);
    }
    
    function test_RevertWhen_UnwrapInsufficientBalance() public {
        vm.prank(user);
        vm.expectRevert("Insufficient wrapped token balance");
        yesWrapper.unwrap(1000e6);
    }
    
    function testTokenMetadata() public {
        assertEq(yesWrapper.name(), "Wrapped YES Token");
        assertEq(yesWrapper.symbol(), "wYES");
        assertEq(yesWrapper.decimals(), 6);
        
        assertEq(noWrapper.name(), "Wrapped NO Token");
        assertEq(noWrapper.symbol(), "wNO");
        assertEq(noWrapper.decimals(), 6);
    }
    
    function testTokenIdCalculation() public {
        uint256 yesTokenId = yesWrapper.getUnderlyingTokenId();
        uint256 noTokenId = noWrapper.getUnderlyingTokenId();
        
        assertEq(yesTokenId, 1);
        assertEq(noTokenId, 2);
    }
}