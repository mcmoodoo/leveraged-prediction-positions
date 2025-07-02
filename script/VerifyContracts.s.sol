// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console.sol";

contract VerifyContractsScript is Script {
    function run() external {
        // Read the deployment addresses from the broadcast file
        string memory root = vm.projectRoot();
        string memory path = string.concat(root, "/broadcast/Deploy.s.sol/137/run-latest.json");
        string memory json = vm.readFile(path);
        
        // Extract contract addresses (deployment order: PriceFeed, YesWrapper, NoWrapper, YesVault, NoVault)
        address priceFeedAddress = vm.parseJsonAddress(json, ".transactions[0].contractAddress");
        address yesWrapperAddress = vm.parseJsonAddress(json, ".transactions[1].contractAddress");
        address noWrapperAddress = vm.parseJsonAddress(json, ".transactions[2].contractAddress");
        address lendingVaultAddress1 = vm.parseJsonAddress(json, ".transactions[3].contractAddress");
        address lendingVaultAddress2 = vm.parseJsonAddress(json, ".transactions[4].contractAddress");
        
        console.log("=== Contract Verification Commands ===");
        console.log("");
        
        // PolymarketPriceFeed verification
        console.log("1. PolymarketPriceFeed:");
        console.log("Address:", priceFeedAddress);
        console.log("Verification command:");
        console.log("forge verify-contract", priceFeedAddress, "src/PolymarketPriceFeed.sol:PolymarketPriceFeed --chain-id 137 --constructor-args $(cast abi-encode \"constructor(address)\" 0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E)");
        console.log("");
        
        // PolymarketTokenWrapper verification (YES)
        console.log("2. PolymarketTokenWrapper (YES):");
        console.log("Address:", yesWrapperAddress);
        console.log("Verification command:");
        console.log("forge verify-contract", yesWrapperAddress, "src/PolymarketTokenWrapper.sol:PolymarketTokenWrapper --chain-id 137 --constructor-args $(cast abi-encode \"constructor(string,string,address,address,uint256,bool)\" \"Wrapped YES Token\" \"wYES\" 0x4D97DCd97eC945f40cF65F87097ACe5EA0476045 0x2B188B402c07051982FA1b6aA942d6fc361e45B4 0x0000000000000000000000000000000000000000000000000000000123456789 true)");
        console.log("");
        
        // PolymarketTokenWrapper verification (NO)
        console.log("2b. PolymarketTokenWrapper (NO):");
        console.log("Address:", noWrapperAddress);
        console.log("Verification command:");
        console.log("forge verify-contract", noWrapperAddress, "src/PolymarketTokenWrapper.sol:PolymarketTokenWrapper --chain-id 137 --constructor-args $(cast abi-encode \"constructor(string,string,address,address,uint256,bool)\" \"Wrapped NO Token\" \"wNO\" 0x4D97DCd97eC945f40cF65F87097ACe5EA0476045 0x2B188B402c07051982FA1b6aA942d6fc361e45B4 0x0000000000000000000000000000000000000000000000000000000123456789 false)");
        console.log("");
        
        // PolymarketLendingVault verification (first instance - YES Vault)
        console.log("3. PolymarketLendingVault (YES Vault):");
        console.log("Address:", lendingVaultAddress1);
        console.log("Verification command:");
        console.log("forge verify-contract %s src/PolymarketLendingVault.sol:PolymarketLendingVault --chain-id 137 --constructor-args $(cast abi-encode \"constructor(address,address,address,address,address)\" 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb %s 0x2B188B402c07051982FA1b6aA942d6fc361e45B4 %s 0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC)", lendingVaultAddress1, priceFeedAddress, yesWrapperAddress);
        console.log("");
        
        // PolymarketLendingVault verification (second instance - NO Vault)  
        console.log("4. PolymarketLendingVault (NO Vault):");
        console.log("Address:", lendingVaultAddress2);
        console.log("Verification command:");
        console.log("forge verify-contract %s src/PolymarketLendingVault.sol:PolymarketLendingVault --chain-id 137 --constructor-args $(cast abi-encode \"constructor(address,address,address,address,address)\" 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb %s 0x2B188B402c07051982FA1b6aA942d6fc361e45B4 %s 0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC)", lendingVaultAddress2, priceFeedAddress, noWrapperAddress);
        console.log("");
        
        console.log("=== Verification Script ===");
        console.log("You can also run the verification commands automatically using:");
        console.log("forge script script/VerifyContracts.s.sol --rpc-url polygon --broadcast");
        console.log("");
        console.log("Make sure to set your POLYGONSCAN_API_KEY environment variable first!");
    }
    
    function verifyContracts() external {
        // This function can be called to actually run the verification commands
        // Uncomment and modify as needed
        
        /*
        vm.startBroadcast();
        
        // Verify PolymarketPriceFeed
        string[] memory inputs = new string[](8);
        inputs[0] = "forge";
        inputs[1] = "verify-contract";
        inputs[2] = "0x0ded163b6b7b258211ca20abe72c376991eb7827";
        inputs[3] = "src/PolymarketPriceFeed.sol:PolymarketPriceFeed";
        inputs[4] = "--chain-id";
        inputs[5] = "137";
        inputs[6] = "--constructor-args";
        inputs[7] = "0x0000000000000000000000004bfb41d5b3570defd03c39a9a4d8de6bd8b8982e";
        
        vm.ffi(inputs);
        
        vm.stopBroadcast();
        */
    }
}