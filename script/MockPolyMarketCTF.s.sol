// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MockPolyMarketCTF} from "../src/MockPolyMarketCTF.sol";

contract MockPolyMarketCTFScript is Script {
    MockPolyMarketCTF public mockPolyMarketCTF;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        mockPolyMarketCTF = new MockPolyMarketCTF();

        vm.stopBroadcast();
    }
}