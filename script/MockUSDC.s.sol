// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract MockUSDCScript is Script {
    MockUSDC public mockUSDC;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        mockUSDC = new MockUSDC();

        vm.stopBroadcast();
    }
}