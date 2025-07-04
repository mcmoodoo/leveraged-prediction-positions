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
