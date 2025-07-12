// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {IMorphoBlue, MarketParams, Market} from "../src/IMorphoBlue.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {CTFWrapper} from "../src/CTFWrapper.sol";
import {MockOracle} from "../src/MockOracle.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MockMorphoBlue is IMorphoBlue {
    mapping(bytes32 => Market) public markets;
    mapping(bytes32 => MarketParams) public marketParams;
    
    function createMarket(MarketParams calldata _marketParams) external override {
        bytes32 id = keccak256(abi.encode(_marketParams));
        
        // Check if market already exists
        require(marketParams[id].loanToken == address(0), "Market already exists");
        
        // Store market parameters
        marketParams[id] = _marketParams;
        
        // Initialize empty market
        markets[id] = Market({
            totalSupplyAssets: 0,
            totalSupplyShares: 0,
            totalBorrowAssets: 0,
            totalBorrowShares: 0,
            lastUpdate: uint128(block.timestamp),
            fee: 0
        });
        
        emit CreateMarket(id, _marketParams);
    }
    
    function market(bytes32 id) external view override returns (Market memory) {
        return markets[id];
    }
    
    function idToMarketParams(bytes32 id) external view override returns (MarketParams memory) {
        return marketParams[id];
    }
}

contract MockERC1155 is ERC1155 {
    constructor() ERC1155("") {}
    
    function mint(address to, uint256 id, uint256 amount, bytes memory data) public {
        _mint(to, id, amount, data);
    }
}

contract CreateMorphoMarketTest is Test {
    MockMorphoBlue public morphoBlue;
    MockUSDC public mockUSDC;
    CTFWrapper public ctfWrapper;
    MockOracle public mockOracle;
    MockERC1155 public mockCTF;
    
    uint256 constant TOKEN_ID = 33064224357523449786613480102704635026181428303479305990935387590344871823925;
    uint256 constant LLTV = 770000000000000000; // 77%
    address constant IRM_ADDRESS = 0xe675A2161D4a6E2de2eeD70ac98EEBf257FBF0B0;
    
    MarketParams public marketParams;
    bytes32 public marketId;

    function setUp() public {
        // Deploy mock contracts
        morphoBlue = new MockMorphoBlue();
        mockUSDC = new MockUSDC();
        mockCTF = new MockERC1155();
        ctfWrapper = new CTFWrapper(
            address(mockCTF),
            TOKEN_ID,
            "Wrapped CTF Token",
            "wCTF"
        );
        mockOracle = new MockOracle(100000000);
        
        // Set up market parameters
        marketParams = MarketParams({
            loanToken: address(mockUSDC),
            collateralToken: address(ctfWrapper),
            oracle: address(mockOracle),
            irm: IRM_ADDRESS,
            lltv: LLTV
        });
        
        marketId = keccak256(abi.encode(marketParams));
    }

    function test_CreateMarket() public {
        // Create market
        morphoBlue.createMarket(marketParams);
        
        // Verify market was created
        MarketParams memory storedParams = morphoBlue.idToMarketParams(marketId);
        assertEq(storedParams.loanToken, address(mockUSDC));
        assertEq(storedParams.collateralToken, address(ctfWrapper));
        assertEq(storedParams.oracle, address(mockOracle));
        assertEq(storedParams.irm, IRM_ADDRESS);
        assertEq(storedParams.lltv, LLTV);
        
        // Verify market state
        Market memory marketState = morphoBlue.market(marketId);
        assertEq(marketState.totalSupplyAssets, 0);
        assertEq(marketState.totalSupplyShares, 0);
        assertEq(marketState.totalBorrowAssets, 0);
        assertEq(marketState.totalBorrowShares, 0);
        assertGt(marketState.lastUpdate, 0);
        assertEq(marketState.fee, 0);
    }

    function test_CreateMarketEvent() public {
        // Expect CreateMarket event
        vm.expectEmit(true, false, false, true);
        emit IMorphoBlue.CreateMarket(marketId, marketParams);
        
        morphoBlue.createMarket(marketParams);
    }

    function test_CreateMarketRevertOnDuplicate() public {
        // Create market first time
        morphoBlue.createMarket(marketParams);
        
        // Try to create same market again
        vm.expectRevert("Market already exists");
        morphoBlue.createMarket(marketParams);
    }

    function test_MarketIdCalculation() public view {
        // Test that market ID is calculated correctly
        bytes32 expectedId = keccak256(abi.encode(marketParams));
        assertEq(marketId, expectedId);
    }

    function test_DifferentMarketsHaveDifferentIds() public {
        // Create different market parameters
        MarketParams memory differentParams = MarketParams({
            loanToken: address(mockUSDC),
            collateralToken: address(ctfWrapper),
            oracle: address(mockOracle),
            irm: IRM_ADDRESS,
            lltv: 800000000000000000 // Different LLTV
        });
        
        bytes32 differentId = keccak256(abi.encode(differentParams));
        
        // Should be different from original market ID
        assertNotEq(marketId, differentId);
        
        // Should be able to create both markets
        morphoBlue.createMarket(marketParams);
        morphoBlue.createMarket(differentParams);
        
        // Both should exist
        MarketParams memory storedParams1 = morphoBlue.idToMarketParams(marketId);
        MarketParams memory storedParams2 = morphoBlue.idToMarketParams(differentId);
        
        assertEq(storedParams1.lltv, LLTV);
        assertEq(storedParams2.lltv, 800000000000000000);
    }

    function test_MarketParametersValidation() public view {
        // Test that all parameters are correctly set
        assertEq(marketParams.loanToken, address(mockUSDC));
        assertEq(marketParams.collateralToken, address(ctfWrapper));
        assertEq(marketParams.oracle, address(mockOracle));
        assertEq(marketParams.irm, IRM_ADDRESS);
        assertEq(marketParams.lltv, LLTV);
        
        // Test LLTV is 77%
        assertEq(marketParams.lltv, 770000000000000000);
    }

    function test_EmptyMarketStateAfterCreation() public {
        morphoBlue.createMarket(marketParams);
        
        Market memory marketState = morphoBlue.market(marketId);
        
        // All supply/borrow values should be zero for new market
        assertEq(marketState.totalSupplyAssets, 0);
        assertEq(marketState.totalSupplyShares, 0);
        assertEq(marketState.totalBorrowAssets, 0);
        assertEq(marketState.totalBorrowShares, 0);
        assertEq(marketState.fee, 0);
        
        // Last update should be current block timestamp
        assertEq(marketState.lastUpdate, block.timestamp);
    }
}