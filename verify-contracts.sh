#!/bin/bash

# Contract Verification Script for Polygon
# Automatically loads POLYGONSCAN_API_KEY from .env file

set -e

echo "=== Polygonscan Contract Verification ==="
echo ""

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | xargs)
    echo "Loaded environment variables from .env file"
else
    echo "Warning: .env file not found"
fi

# Check if API key is set
if [ -z "$POLYGONSCAN_API_KEY" ]; then
    echo "Error: POLYGONSCAN_API_KEY not found in .env file"
    echo "Please add it to your .env file: POLYGONSCAN_API_KEY=your_api_key"
    exit 1
fi

echo "Using API key: ${POLYGONSCAN_API_KEY:0:8}..."

# Contract addresses from deployment
PRICE_FEED_ADDRESS="0x0ded163b6b7b258211ca20abe72c376991eb7827"
TOKEN_WRAPPER_ADDRESS="0x71c3dd1d3899eb64f8e27f039e1dc59c8e2eeedc"
LENDING_VAULT_ADDRESS_1="0x2ab2001c0e992b9a2ec47ece631db7be9465aa35"
LENDING_VAULT_ADDRESS_2="0x5d753b41860df2ccb228b7f643157443b0f30377"

echo "1. Verifying PolymarketPriceFeed..."
echo "Address: $PRICE_FEED_ADDRESS"
forge verify-contract $PRICE_FEED_ADDRESS \
    src/PolymarketPriceFeed.sol:PolymarketPriceFeed \
    --chain-id 137 \
    --constructor-args $(cast abi-encode "constructor(address)" 0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E) \
    --verifier-url https://api.polygonscan.com/api \
    --etherscan-api-key $POLYGONSCAN_API_KEY \

echo ""
echo "Waiting 30 seconds to avoid rate limiting..."
sleep 30

echo ""
echo "2. Verifying PolymarketTokenWrapper..."
echo "Address: $TOKEN_WRAPPER_ADDRESS"
forge verify-contract $TOKEN_WRAPPER_ADDRESS \
    src/PolymarketTokenWrapper.sol:PolymarketTokenWrapper \
    --chain-id 137 \
    --constructor-args $(cast abi-encode "constructor(string,string,address,address,uint256,bool)" "Wrapped YES Token" "wYES" 0x4D97DCd97eC945f40cF65F87097ACe5EA0476045 0x2B188B402c07051982FA1b6aA942d6fc361e45B4 0x0000000000000000000000000000000000000000000000000000000123456789 true) \
    --verifier-url https://api.polygonscan.com/api \
    --etherscan-api-key $POLYGONSCAN_API_KEY \

echo ""
echo "Waiting 30 seconds to avoid rate limiting..."
sleep 30

echo ""
echo "3. Verifying PolymarketLendingVault (First instance)..."
echo "Address: $LENDING_VAULT_ADDRESS_1"
forge verify-contract $LENDING_VAULT_ADDRESS_1 \
    src/PolymarketLendingVault.sol:PolymarketLendingVault \
    --chain-id 137 \
    --constructor-args $(cast abi-encode "constructor(address,address)" 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb 0x0DED163B6B7b258211CA20ABE72c376991eb7827) \
    --verifier-url https://api.polygonscan.com/api \
    --etherscan-api-key $POLYGONSCAN_API_KEY \

echo ""
echo "Waiting 30 seconds to avoid rate limiting..."
sleep 30

echo ""
echo "4. Verifying PolymarketLendingVault (Second instance)..."
echo "Address: $LENDING_VAULT_ADDRESS_2"
forge verify-contract $LENDING_VAULT_ADDRESS_2 \
    src/PolymarketLendingVault.sol:PolymarketLendingVault \
    --chain-id 137 \
    --constructor-args $(cast abi-encode "constructor(address,address)" 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb 0x0DED163B6B7b258211CA20ABE72c376991eb7827) \
    --verifier-url https://api.polygonscan.com/api \
    --etherscan-api-key $POLYGONSCAN_API_KEY \

echo ""
echo "=== Verification Complete ==="
echo ""
echo "You can view the verified contracts on Polygonscan:"
echo "1. PolymarketPriceFeed: https://polygonscan.com/address/$PRICE_FEED_ADDRESS"
echo "2. PolymarketTokenWrapper: https://polygonscan.com/address/$TOKEN_WRAPPER_ADDRESS"
echo "3. PolymarketLendingVault (1): https://polygonscan.com/address/$LENDING_VAULT_ADDRESS_1"
echo "4. PolymarketLendingVault (2): https://polygonscan.com/address/$LENDING_VAULT_ADDRESS_2"
