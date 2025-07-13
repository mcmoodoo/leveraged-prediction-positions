// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {IMorpho, MarketParams} from "@morpho-blue/contracts/interfaces/IMorpho.sol";

contract CreateMorphoMarketScript is Script {
    function setUp() public {}

    function run() public {
        // Load configuration from JSON files
        string memory marketJson = vm.readFile("market-deployment.json");
        string memory protocolJson = vm.readFile("protocol-config.json");
        
        // Load addresses from configuration files
        address morphoBlue = vm.parseJsonAddress(protocolJson, ".morpho.morphoBlueAddress");
        address loanToken = vm.parseJsonAddress(marketJson, ".contracts.mockUsdc");
        address collateralToken = vm.parseJsonAddress(marketJson, ".contracts.recessionNoWrapper");
        address oracle = vm.parseJsonAddress(marketJson, ".contracts.mockOracle");
        address irm = vm.parseJsonAddress(protocolJson, ".morpho.adaptiveCurveIrmAddress");
        uint256 lltv = vm.parseJsonUint(protocolJson, ".market.lltv");

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

        vm.startBroadcast();

        IMorpho(morphoBlue).createMarket(marketParams);

        console.log("Market created successfully!");

        vm.stopBroadcast();
    }
}
