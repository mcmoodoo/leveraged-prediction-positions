// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CTFWrapper} from "../src/CTFWrapper.sol";

contract CTFWrapperScript is Script {
    CTFWrapper public ctfWrapper;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address ctfAddress = vm.envAddress("POLYGON_CTF_ADDRESS");
        uint256 tokenId = vm.envUint("CTF_TOKEN_ID");

        vm.startBroadcast(deployerPrivateKey);

        ctfWrapper = new CTFWrapper(
            ctfAddress,
            tokenId,
            "Wrapped CTF Token",
            "wCTFyes"
        );

        console.log("CTF Wrapper deployed at:", address(ctfWrapper));
        console.log("CTF Contract:", ctfAddress);
        console.log("Token ID:", tokenId);

        vm.stopBroadcast();
    }
}
