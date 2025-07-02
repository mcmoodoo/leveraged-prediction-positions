// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MockOracle} from "../src/MockOracle.sol";

contract MockOracleTest is Test {
    MockOracle public mockOracle;
    
    uint8 constant DECIMALS = 8;
    string constant DESCRIPTION = "CTF / USDC";
    uint256 constant VERSION = 1;
    int256 constant INITIAL_PRICE = 100000000; // 1.00 USDC per CTF token
    
    address owner = address(this);
    address user = address(0x1);

    function setUp() public {
        mockOracle = new MockOracle(
            DECIMALS,
            DESCRIPTION,
            VERSION,
            INITIAL_PRICE
        );
    }

    function test_Deployment() public view {
        assertEq(mockOracle.decimals(), DECIMALS);
        assertEq(mockOracle.description(), DESCRIPTION);
        assertEq(mockOracle.version(), VERSION);
        assertEq(mockOracle.getCurrentRoundId(), 1);
        assertEq(mockOracle.getLatestAnswer(), INITIAL_PRICE);
    }

    function test_LatestRoundData() public view {
        (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = mockOracle.latestRoundData();
        
        assertEq(roundId, 1);
        assertEq(answer, INITIAL_PRICE);
        assertGt(startedAt, 0);
        assertEq(startedAt, updatedAt);
        assertEq(answeredInRound, 1);
    }

    function test_GetRoundData() public view {
        (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = mockOracle.getRoundData(1);
        
        assertEq(roundId, 1);
        assertEq(answer, INITIAL_PRICE);
        assertGt(startedAt, 0);
        assertEq(startedAt, updatedAt);
        assertEq(answeredInRound, 1);
    }

    function test_GetRoundDataRevertOnInvalidRound() public {
        vm.expectRevert("No data present");
        mockOracle.getRoundData(999);
    }

    function test_UpdateAnswer() public {
        int256 newPrice = 150000000; // 1.50 USDC per CTF token
        
        mockOracle.updateAnswer(newPrice);
        
        assertEq(mockOracle.getCurrentRoundId(), 2);
        assertEq(mockOracle.getLatestAnswer(), newPrice);
        
        (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = mockOracle.latestRoundData();
        
        assertEq(roundId, 2);
        assertEq(answer, newPrice);
        assertGt(startedAt, 0);
        assertEq(startedAt, updatedAt);
        assertEq(answeredInRound, 2);
    }

    function test_UpdateAnswerOnlyOwner() public {
        vm.prank(user);
        vm.expectRevert();
        mockOracle.updateAnswer(150000000);
    }

    function test_MultipleUpdates() public {
        int256 price2 = 120000000; // 1.20 USDC
        int256 price3 = 80000000;  // 0.80 USDC
        
        mockOracle.updateAnswer(price2);
        mockOracle.updateAnswer(price3);
        
        assertEq(mockOracle.getCurrentRoundId(), 3);
        assertEq(mockOracle.getLatestAnswer(), price3);
        
        // Check that old round data is still accessible
        (,int256 answer1,,,) = mockOracle.getRoundData(1);
        (,int256 answer2,,,) = mockOracle.getRoundData(2);
        (,int256 answer3,,,) = mockOracle.getRoundData(3);
        
        assertEq(answer1, INITIAL_PRICE);
        assertEq(answer2, price2);
        assertEq(answer3, price3);
    }

    function test_UpdateAnswerEvent() public {
        int256 newPrice = 150000000;
        
        vm.expectEmit(true, true, false, true);
        emit MockOracle.AnswerUpdated(newPrice, 2, block.timestamp);
        
        mockOracle.updateAnswer(newPrice);
    }

    function test_NewRoundEvent() public {
        int256 newPrice = 150000000;
        
        vm.expectEmit(true, true, false, true);
        emit MockOracle.NewRound(2, address(this), block.timestamp);
        
        mockOracle.updateAnswer(newPrice);
    }

    function test_NegativePrice() public {
        int256 negativePrice = -50000000; // -0.50 USDC (for testing purposes)
        
        mockOracle.updateAnswer(negativePrice);
        
        assertEq(mockOracle.getLatestAnswer(), negativePrice);
    }

    function test_ZeroPrice() public {
        int256 zeroPrice = 0;
        
        mockOracle.updateAnswer(zeroPrice);
        
        assertEq(mockOracle.getLatestAnswer(), zeroPrice);
    }

    function test_LargePrice() public {
        int256 largePrice = type(int256).max;
        
        mockOracle.updateAnswer(largePrice);
        
        assertEq(mockOracle.getLatestAnswer(), largePrice);
    }

    function test_HistoricalData() public {
        // Create multiple rounds
        mockOracle.updateAnswer(120000000); // Round 2
        mockOracle.updateAnswer(130000000); // Round 3
        mockOracle.updateAnswer(110000000); // Round 4
        
        // Verify we can access historical data
        (,int256 answer1,,,) = mockOracle.getRoundData(1);
        (,int256 answer2,,,) = mockOracle.getRoundData(2);
        (,int256 answer3,,,) = mockOracle.getRoundData(3);
        (,int256 answer4,,,) = mockOracle.getRoundData(4);
        
        assertEq(answer1, INITIAL_PRICE);
        assertEq(answer2, 120000000);
        assertEq(answer3, 130000000);
        assertEq(answer4, 110000000);
        
        // Latest should be round 4
        assertEq(mockOracle.getCurrentRoundId(), 4);
        assertEq(mockOracle.getLatestAnswer(), 110000000);
    }

    function test_TimestampUpdates() public {
        uint256 initialTimestamp = block.timestamp;
        
        vm.warp(initialTimestamp + 3600); // 1 hour later
        
        mockOracle.updateAnswer(150000000);
        
        (,, uint256 startedAt, uint256 updatedAt,) = mockOracle.latestRoundData();
        
        assertEq(startedAt, initialTimestamp + 3600);
        assertEq(updatedAt, initialTimestamp + 3600);
    }
}