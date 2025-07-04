// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {IMorphoBlue, MarketParams} from "../src/IMorphoBlue.sol";

contract CreateMorphoMarketScript is Script {
    function setUp() public {}

    function run() public {
        // Load addresses from environment
        address morphoBlue = vm.envAddress("MORPHO_BLUE_ADDRESS");
        address loanToken = vm.envAddress("MOCK_USDC_ADDRESS");
        address collateralToken = vm.envAddress("RECESSION_NO_WRAPPER_ADDRESS");
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
        
        // Update MARKET_ID in .env file
        string[] memory sedCmd = new string[](4);
        sedCmd[0] = "sed";
        sedCmd[1] = "-i";
        sedCmd[2] = "/^MARKET_ID=/d";
        sedCmd[3] = ".env";
        vm.ffi(sedCmd);
        
        string[] memory echoCmd = new string[](3);
        echoCmd[0] = "sh";
        echoCmd[1] = "-c";
        echoCmd[2] = string(abi.encodePacked("echo 'MARKET_ID=0x", vm.toString(marketId), "' >> .env"));
        vm.ffi(echoCmd);

        vm.startBroadcast();

        IMorphoBlue(morphoBlue).createMarket(marketParams);

        console.log("Market created successfully!");

        vm.stopBroadcast();
    }
}
