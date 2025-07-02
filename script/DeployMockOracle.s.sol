// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/MockOracle.sol";

contract DeployMockOracleScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying MockOracle...");
        
        MockOracle mockOracle = new MockOracle(
            8, // 8 decimals (standard for USD price feeds)
            "Mock ETH/USD Price Feed", // description
            1, // version
            2000_00000000 // initial price: $2000 with 8 decimals
        );
        
        console.log("MockOracle deployed at:", address(mockOracle));
        console.log("Initial price:", mockOracle.getLatestPrice());
        console.log("Decimals:", mockOracle.decimals());
        console.log("Description:", mockOracle.description());
        
        vm.stopBroadcast();
    }
}