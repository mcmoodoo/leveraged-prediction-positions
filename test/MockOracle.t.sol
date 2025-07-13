// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MockOracle} from "../src/MockOracle.sol";

contract MockOracleTest is Test {
    MockOracle public mockOracle;
    
    uint256 constant INITIAL_PRICE = 100000000; // 1.00 USDC per CTF token
    
    address owner = address(this);
    address user = address(0x1);

    function setUp() public {
        mockOracle = new MockOracle(INITIAL_PRICE);
    }

    function test_Deployment() public view {
        assertEq(mockOracle.price(), INITIAL_PRICE);
        assertEq(mockOracle.decimals(), 18);
        assertTrue(mockOracle.isAuthorized(owner));
    }

    function test_UpdatePrice() public {
        uint256 newPrice = 150000000; // 1.50 USDC per CTF token
        
        mockOracle.updatePrice(newPrice);
        
        assertEq(mockOracle.price(), newPrice);
    }

    function test_UpdatePriceOnlyAuthorized() public {
        vm.prank(user);
        vm.expectRevert("Not authorized");
        mockOracle.updatePrice(150000000);
    }

    function test_AddAuthorized() public {
        mockOracle.addAuthorized(user);
        assertTrue(mockOracle.isAuthorized(user));
        
        // User should now be able to update price
        vm.prank(user);
        mockOracle.updatePrice(200000000);
        assertEq(mockOracle.price(), 200000000);
    }

    function test_RemoveAuthorized() public {
        mockOracle.addAuthorized(user);
        assertTrue(mockOracle.isAuthorized(user));
        
        mockOracle.removeAuthorized(user);
        assertFalse(mockOracle.isAuthorized(user));
        
        // User should no longer be able to update price
        vm.prank(user);
        vm.expectRevert("Not authorized");
        mockOracle.updatePrice(200000000);
    }

    function test_OnlyAuthorizedCanAddAuthorized() public {
        vm.prank(user);
        vm.expectRevert("Not authorized");
        mockOracle.addAuthorized(address(0x2));
    }

    function test_OnlyAuthorizedCanRemoveAuthorized() public {
        address user2 = address(0x2);
        mockOracle.addAuthorized(user);
        
        vm.prank(user2);
        vm.expectRevert("Not authorized");
        mockOracle.removeAuthorized(owner);
    }

    function test_MultipleAuthorized() public {
        address user2 = address(0x2);
        
        mockOracle.addAuthorized(user);
        mockOracle.addAuthorized(user2);
        
        assertTrue(mockOracle.isAuthorized(user));
        assertTrue(mockOracle.isAuthorized(user2));
        
        // Both should be able to update price
        vm.prank(user);
        mockOracle.updatePrice(300000000);
        assertEq(mockOracle.price(), 300000000);
        
        vm.prank(user2);
        mockOracle.updatePrice(400000000);
        assertEq(mockOracle.price(), 400000000);
    }

    function test_ZeroPrice() public {
        mockOracle.updatePrice(0);
        assertEq(mockOracle.price(), 0);
    }

    function test_LargePrice() public {
        uint256 largePrice = type(uint256).max;
        mockOracle.updatePrice(largePrice);
        assertEq(mockOracle.price(), largePrice);
    }
}
