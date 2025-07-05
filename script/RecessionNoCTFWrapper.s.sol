// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CTFWrapper} from "../src/CTFWrapper.sol";

contract MockRecessionNoTokenWrapperScript is Script {
    CTFWrapper public ctfWrapper;

    function setUp() public {}

    function run() public {
        address mockPolyMarketCTFAddress = vm.envAddress("MOCK_POLYMARKET_CTF_ADDRESS");
        // Use the actual token ID that exists in Mock CTF: keccak256("Recession NO token")
        uint256 mockRecessionNoTokenId = uint256(keccak256("Recession NO token"));

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
