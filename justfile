# Simple justfile for deploying contracts on Polygon

# Deploy Mock USDC
deploy-usdc:
    forge script script/MockUSDC.s.sol:MockUSDCScript --rpc-url $POLYGON_RPC --account chromion --broadcast

# Deploy Mock Oracle
deploy-oracle:
    forge script script/MockOracle.s.sol:MockOracleScript --rpc-url $POLYGON_RPC --account chromion --broadcast

# Deploy Mock PolyMarket CTF
deploy-ctf:
    forge script script/MockPolyMarketCTF.s.sol:MockPolyMarketCTFScript --rpc-url $POLYGON_RPC --account chromion --broadcast

# Deploy CTF Wrapper (requires MOCK_POLYMARKET_CTF_ADDRESS)
deploy-wrapper:
    forge script script/RecessionNoCTFWrapper.s.sol:MockRecessionNoTokenWrapperScript --rpc-url $POLYGON_RPC --account chromion --broadcast

# Create Morpho Market (requires all addresses above)
deploy-market:
    forge script script/CreateMorphoMarket.s.sol:CreateMorphoMarketScript --rpc-url $POLYGON_RPC --account chromion --broadcast

# Deploy all contracts in dependency order
deploy-all:
    @just deploy-usdc
    @just deploy-oracle
    @just deploy-ctf
    @just deploy-wrapper
    @just deploy-market

# Mint test tokens for testing
mint-tokens:
    forge script script/MintTestTokens.s.sol:MintTestTokensScript --rpc-url $POLYGON_RPC --account chromion --broadcast

# Internal function to update .env with deployed contract addresses
_update-env script_name env_var_name:
    #!/usr/bin/env bash
    BROADCAST_FILE="broadcast/{{script_name}}/137/run-latest.json"
    if [ ! -f "$BROADCAST_FILE" ]; then
        echo "Error: Broadcast file not found: $BROADCAST_FILE"
        exit 1
    fi
    CONTRACT_ADDRESS=$(jq -r '.transactions[0].contractAddress' "$BROADCAST_FILE")
    if [ "$CONTRACT_ADDRESS" = "null" ] || [ -z "$CONTRACT_ADDRESS" ]; then
        echo "Error: Could not extract contract address"
        exit 1
    fi
    echo "Extracted address: $CONTRACT_ADDRESS"
    if grep -q "^{{env_var_name}}=" .env 2>/dev/null; then
        sed -i "s/^{{env_var_name}}=.*$/{{env_var_name}}=$CONTRACT_ADDRESS/" .env
        echo "Updated {{env_var_name}} in .env"
    else
        echo "{{env_var_name}}=$CONTRACT_ADDRESS" >> .env
        echo "Added {{env_var_name}} to .env"
    fi

# Update all environment variables from broadcast files
update-env:
    @echo "Updating .env with deployed contract addresses..."
    @just _update-env MockUSDC.s.sol MOCK_USDC_ADDRESS
    @just _update-env MockOracle.s.sol MOCK_ORACLE_ADDRESS
    @just _update-env MockPolyMarketCTF.s.sol MOCK_POLYMARKET_CTF_ADDRESS
    @just _update-env RecessionNoCTFWrapper.s.sol RECESSION_NO_WRAPPER_ADDRESS
    @echo "✓ All addresses updated in .env"

# Show current addresses
show:
    @echo "Current deployed addresses:"
    @grep -E "^(MOCK_USDC_ADDRESS|MOCK_ORACLE_ADDRESS|MOCK_POLYMARKET_CTF_ADDRESS|RECESSION_NO_WRAPPER_ADDRESS)=" .env 2>/dev/null || echo "No addresses found"

# Clean artifacts
clean:
    rm -rf broadcast/ cache/ out/

borrow-1-usdc:
    cast send 0x1bF0c2541F820E775182832f06c0B7Fc27A25f67 "borrow((address,address,address,address,uint256),uint256,uint256,address,address)" "(0x33eef5d955da603208dec0d710c7285ff4a4f379,0x2ceb0cb6bbbbea6f3dead524bccbcc26bc99df9b,0x70e5880144b02388b55fa19074d752b5f00b6c6b,0xe675A2161D4a6E2de2eeD70ac98EEBf257FBF0B0,770000000000000000)" 1000000 0 0xe71DB3894A79BeBe377fbD7B601766660Aaea5f9 0xe71DB3894A79BeBe377fbD7B601766660Aaea5f9 --rpc-url $POLYGON_RPC --account chromion

