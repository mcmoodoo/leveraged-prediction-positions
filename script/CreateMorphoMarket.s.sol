// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {IMorphoBlue, MarketParams} from "../src/IMorphoBlue.sol";

contract CreateMorphoMarketScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Load addresses from environment
        address morphoBlue = vm.envAddress("MORPHO_BLUE_ADDRESS");
        address loanToken = vm.envAddress("MOCK_USDC_ADDRESS");
        address collateralToken = vm.envAddress("CTF_WRAPPER_ADDRESS");
        address oracle = vm.envAddress("MOCK_ORACLE_ADDRESS");
        address irm = vm.envAddress("ADAPTIVE_CURVE_IRM_ADDRESS");
        uint256 lltv = vm.envUint("LLTV");

        console.log("Creating Morpho Blue Market with:");
        console.log("Morpho Blue:", morphoBlue);
        console.log("Loan Token (Mock USDC):", loanToken);
        console.log("Collateral Token (CTF Wrapper):", collateralToken);
        console.log("Oracle:", oracle);
        console.log("IRM:", irm);
        console.log("LLTV:", lltv);

        MarketParams memory marketParams = MarketParams({
            loanToken: loanToken,
            collateralToken: collateralToken,
            oracle: oracle,
            irm: irm,
            lltv: lltv
        });

        // Calculate market ID (hash of market parameters)
        bytes32 marketId = keccak256(abi.encode(marketParams));
        console.log("Market ID:");
        console.logBytes32(marketId);

        vm.startBroadcast(deployerPrivateKey);

        IMorphoBlue(morphoBlue).createMarket(marketParams);

        console.log("Market created successfully!");

        vm.stopBroadcast();
    }
}