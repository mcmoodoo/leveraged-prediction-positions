// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/PolymarketTokenWrapper.sol";
import "../src/PolymarketPriceFeed.sol";
import "../src/PolymarketLendingVault.sol";

contract DeployScript is Script {
    address constant POLYGON_CTF = 0x4D97DCd97eC945f40cF65F87097ACe5EA0476045;
    address constant POLYGON_CTF_EXCHANGE = 0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E;
    address constant USDC_POLYGON = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address constant MORPHO_BLUE_POLYGON = 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb;
    address constant ADAPTIVE_CURVE_IRM = 0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying Polymarket Lending Infrastructure...");
        
        PolymarketPriceFeed priceFeed = new PolymarketPriceFeed(
            POLYGON_CTF_EXCHANGE
        );
        console.log("PolymarketPriceFeed deployed at:", address(priceFeed));
        
        bytes32 exampleConditionId = bytes32(uint256(0x123456789));
        
        PolymarketTokenWrapper yesWrapper = new PolymarketTokenWrapper(
            "Wrapped YES Token",
            "wYES",
            POLYGON_CTF,
            USDC_POLYGON,
            exampleConditionId,
            true
        );
        console.log("YES Token Wrapper deployed at:", address(yesWrapper));
        
        PolymarketTokenWrapper noWrapper = new PolymarketTokenWrapper(
            "Wrapped NO Token", 
            "wNO",
            POLYGON_CTF,
            USDC_POLYGON,
            exampleConditionId,
            false
        );
        console.log("NO Token Wrapper deployed at:", address(noWrapper));
        
        PolymarketLendingVault yesVault = new PolymarketLendingVault(
            MORPHO_BLUE_POLYGON,
            address(priceFeed),
            USDC_POLYGON,
            address(yesWrapper),
            ADAPTIVE_CURVE_IRM
        );
        console.log("YES Lending Vault deployed at:", address(yesVault));
        
        PolymarketLendingVault noVault = new PolymarketLendingVault(
            MORPHO_BLUE_POLYGON,
            address(priceFeed),
            USDC_POLYGON,
            address(noWrapper),
            ADAPTIVE_CURVE_IRM
        );
        console.log("NO Lending Vault deployed at:", address(noVault));
        
        uint256 yesTokenId = yesWrapper.getUnderlyingTokenId();
        uint256 noTokenId = noWrapper.getUnderlyingTokenId();
        
        priceFeed.addSupportedToken(yesTokenId);
        priceFeed.addSupportedToken(noTokenId);
        
        console.log("Setup completed successfully!");
        console.log("YES Token ID:", yesTokenId);
        console.log("NO Token ID:", noTokenId);
        
        vm.stopBroadcast();
    }
}