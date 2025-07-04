// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {MockPolyMarketCTF} from "../src/MockPolyMarketCTF.sol";

contract MintTestTokensScript is Script {
    function setUp() public {}

    function run() public {
        // Load addresses from environment
        address mockUSDC = vm.envAddress("MOCK_USDC_ADDRESS");
        address mockCTF = vm.envAddress("MOCK_POLYMARKET_CTF_ADDRESS");
        
        // Get the target address (deployer or specified address)
        address target = msg.sender;
        
        console.log("Minting test tokens to:", target);
        console.log("Mock USDC Address:", mockUSDC);
        console.log("Mock CTF Address:", mockCTF);

        vm.startBroadcast();

        // Mint 10,000 USDC (with 6 decimals)
        MockUSDC(mockUSDC).mint(target, 10000 * 10**6);
        
        console.log("Successfully minted:");
        console.log("- 10,000 mockUSDC");
        console.log("- CTF tokens are pre-minted in the contract constructor");

        vm.stopBroadcast();
    }
    
}