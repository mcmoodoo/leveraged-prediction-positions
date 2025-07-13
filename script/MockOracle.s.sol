// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MockOracle} from "../src/MockOracle.sol";

contract MockOracleScript is Script {
    MockOracle public mockOracle;

    function setUp() public {}

    function run() public {
        uint256 initialPrice = 0.7 * 10 ** 36; // How many loan tokens (mockUSDC) per one unit of collateral (RecessionNoWrappedShare)

        vm.startBroadcast();

        mockOracle = new MockOracle(
            initialPrice
        );

        console.log("Mock Oracle deployed at:", address(mockOracle));
        console.log("Initial Price:", uint256(initialPrice));

        vm.stopBroadcast();
    }
}
