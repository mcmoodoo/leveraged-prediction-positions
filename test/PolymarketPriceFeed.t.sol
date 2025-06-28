// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PolymarketPriceFeed.sol";

contract PolymarketPriceFeedTest is Test {
    PolymarketPriceFeed public priceFeed;
    address public ctfExchange = address(0x123);
    address public owner = address(this);
    
    uint256 public constant TOKEN_ID = 1;
    uint256 public constant MIN_VOLUME = 1000e6;
    
    function setUp() public {
        priceFeed = new PolymarketPriceFeed(ctfExchange);
        priceFeed.addSupportedToken(TOKEN_ID);
    }
    
    function testAddSupportedToken() public {
        uint256 newTokenId = 2;
        priceFeed.addSupportedToken(newTokenId);
        
        assertTrue(priceFeed.supportedTokens(newTokenId));
    }
    
    function testRemoveSupportedToken() public {
        priceFeed.removeSupportedToken(TOKEN_ID);
        
        assertFalse(priceFeed.supportedTokens(TOKEN_ID));
    }
    
    function testUpdatePriceBuyOrder() public {
        vm.prank(ctfExchange);
        priceFeed.updatePrice(
            TOKEN_ID,
            0,
            TOKEN_ID,
            700e6,
            1000e6
        );
        
        (uint256 price, uint256 timestamp) = priceFeed.getLatestPrice(TOKEN_ID);
        
        assertEq(price, 0.7e18);
        assertEq(timestamp, block.timestamp);
    }
    
    function testUpdatePriceSellOrder() public {
        vm.prank(ctfExchange);
        priceFeed.updatePrice(
            TOKEN_ID,
            TOKEN_ID,
            0,
            1000e6,
            600e6
        );
        
        (uint256 price,) = priceFeed.getLatestPrice(TOKEN_ID);
        
        assertEq(price, 0.6e18);
    }
    
    function test_RevertWhen_UpdatePriceUnauthorized() public {
        vm.prank(address(0x456));
        vm.expectRevert("Only CTF Exchange can update prices");
        priceFeed.updatePrice(
            TOKEN_ID,
            0,
            TOKEN_ID,
            700e6,
            1000e6
        );
    }
    
    function test_RevertWhen_UpdatePriceUnsupportedToken() public {
        vm.prank(ctfExchange);
        vm.expectRevert("Token not supported");
        priceFeed.updatePrice(
            999,
            0,
            999,
            700e6,
            1000e6
        );
    }
    
    function test_RevertWhen_UpdatePriceInvalidTrade() public {
        vm.prank(ctfExchange);
        vm.expectRevert("Invalid trade: no USDC involved");
        priceFeed.updatePrice(
            TOKEN_ID,
            TOKEN_ID,
            2,
            700e6,
            1000e6
        );
    }
    
    function test_RevertWhen_UpdatePriceExceedsMaxPrice() public {
        vm.prank(ctfExchange);
        vm.expectRevert("Price cannot exceed 1.0");
        priceFeed.updatePrice(
            TOKEN_ID,
            0,
            TOKEN_ID,
            1100e6,
            1000e6
        );
    }
    
    function test_RevertWhen_UpdatePriceLowVolume() public {
        vm.prank(ctfExchange);
        vm.expectRevert("Volume too low");
        priceFeed.updatePrice(
            TOKEN_ID,
            0,
            TOKEN_ID,
            700e6,
            100e6
        );
    }
    
    function testGetTWAP() public {
        vm.startPrank(ctfExchange);
        
        priceFeed.updatePrice(TOKEN_ID, 0, TOKEN_ID, 600e6, 1000e6);
        priceFeed.updatePrice(TOKEN_ID, 0, TOKEN_ID, 800e6, 1000e6);
        
        vm.stopPrank();
        
        uint256 twap = priceFeed.getTWAP(TOKEN_ID, 120);
        
        uint256 expectedTwap = (0.6e18 * 1000e6 + 0.8e18 * 1000e6) / (2000e6);
        assertEq(twap, expectedTwap);
    }
    
    function testPriceStale() public {
        vm.prank(ctfExchange);
        priceFeed.updatePrice(TOKEN_ID, 0, TOKEN_ID, 700e6, 1000e6);
        
        assertFalse(priceFeed.isPriceStale(TOKEN_ID));
        
        vm.warp(block.timestamp + 3601);
        
        assertTrue(priceFeed.isPriceStale(TOKEN_ID));
    }
    
    function test_RevertWhen_GetLatestPriceStale() public {
        vm.prank(ctfExchange);
        priceFeed.updatePrice(TOKEN_ID, 0, TOKEN_ID, 700e6, 1000e6);
        
        vm.warp(block.timestamp + 3601);
        
        vm.expectRevert("Price data too old");
        priceFeed.getLatestPrice(TOKEN_ID);
    }
    
    function testResetTWAP() public {
        vm.prank(ctfExchange);
        priceFeed.updatePrice(TOKEN_ID, 0, TOKEN_ID, 700e6, 1000e6);
        
        priceFeed.resetTWAP(TOKEN_ID);
        
        vm.expectRevert("No TWAP data available");
        priceFeed.getTWAP(TOKEN_ID, 60);
    }
}