// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";

contract DeployMockUSDCScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying Mock USDC Token...");
        
        MockUSDC mockUSDC = new MockUSDC();
        console.log("MockUSDC deployed at:", address(mockUSDC));
        console.log("Initial supply:", mockUSDC.totalSupply());
        console.log("Deployer balance:", mockUSDC.balanceOf(msg.sender));
        
        vm.stopBroadcast();
    }
}