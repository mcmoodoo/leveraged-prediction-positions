// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CTFWrapper} from "../src/CTFWrapper.sol";

contract MockRecessionNoTokenWrapperScript is Script {
    CTFWrapper public ctfWrapper;

    function setUp() public {}

    function run() public {
        string memory json = vm.readFile("market-deployment.json");
        address mockPolyMarketCTFAddress = vm.parseJsonAddress(json, ".contracts.mockPolyMarketCTF");
        uint256 mockRecessionNoTokenId = vm.parseJsonUint(json, ".tokenIds.mockRecessionNoTokenId");

        vm.startBroadcast();

        ctfWrapper = new CTFWrapper(
            mockPolyMarketCTFAddress,
            mockRecessionNoTokenId,
            "Wrapped Recession NO Token",
            "wRNT"
        );

        console.log("MockRecessionNo Token Wrapper deployed at:", address(ctfWrapper));
        console.log("Mock PolyMarket CTF Contract:", mockPolyMarketCTFAddress);
        console.log("MockRecessionNo Token ID:", mockRecessionNoTokenId);

        vm.stopBroadcast();
    }
}
