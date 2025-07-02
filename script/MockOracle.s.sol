// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MockOracle} from "../src/MockOracle.sol";

contract MockOracleScript is Script {
    MockOracle public mockOracle;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Oracle configuration for CTF/USDC pair
        uint8 decimals = 8; // Standard for Chainlink price feeds
        string memory description = "CTF / USDC";
        uint256 version = 1;
        int256 initialPrice = 100000000; // 1.00 USDC per CTF token (8 decimals)

        vm.startBroadcast(deployerPrivateKey);

        mockOracle = new MockOracle(
            decimals,
            description,
            version,
            initialPrice
        );

        console.log("Mock Oracle deployed at:", address(mockOracle));
        console.log("Description:", description);
        console.log("Decimals:", decimals);
        console.log("Initial Price:", uint256(initialPrice));

        vm.stopBroadcast();
    }
}