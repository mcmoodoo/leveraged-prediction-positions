# Simple justfile for deploying contracts on Polygon

# Extract all variables from JSON config files as environment variables
extract-env:
    #!/usr/bin/env bash
    
    # Check if required files exist
    if [ ! -f "protocol-config.json" ]; then
        echo "Error: protocol-config.json not found" >&2
        exit 1
    fi
    
    if [ ! -f "market-deployment.json" ]; then
        echo "Error: market-deployment.json not found" >&2
        exit 1
    fi
    
    # Extract and output export statements
    echo "export MORPHO_BLUE=\"$(jq -r '.morpho.morphoBlueAddress' protocol-config.json)\""
    echo "export ADAPTIVE_CURVE_IRM=\"$(jq -r '.morpho.adaptiveCurveIrmAddress' protocol-config.json)\""
    echo "export LLTV=\"$(jq -r '.market.lltv' protocol-config.json)\""
    echo "export LOAN_TOKEN=\"$(jq -r '.contracts.mockUsdc' market-deployment.json)\""
    echo "export MOCK_ORACLE=\"$(jq -r '.contracts.mockOracle' market-deployment.json)\""
    echo "export MOCK_POLYMARKET_CTF=\"$(jq -r '.contracts.mockPolyMarketCTF' market-deployment.json)\""
    echo "export COLLATERAL_TOKEN=\"$(jq -r '.contracts.recessionNoWrapper' market-deployment.json)\""

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
    @just update-market-config
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

# Internal function to update market deployment config
_update-market-config script_name contract_key:
    #!/usr/bin/env bash
    BROADCAST_FILE="broadcast/{{script_name}}/137/run-latest.json"
    CONFIG_FILE="market-deployment.json"
    
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
    
    # Initialize config file if it doesn't exist
    if [ ! -f "$CONFIG_FILE" ]; then
        cat > "$CONFIG_FILE" << 'JSONEOF'
    {
      "metadata": {
        "marketName": "leveraged-prediction-positions",
        "network": "polygon",
        "chainId": "137",
        "lastUpdated": null
      },
      "contracts": {},
      "tokenIds": {
        "mockRecessionNoTokenId": "105452622481843462309689659320513353976826103710406847075024399449421535866880"
      }
    }
    JSONEOF
    fi
    
    # Ensure tokenIds section exists in existing config files
    if ! jq -e '.tokenIds' "$CONFIG_FILE" > /dev/null 2>&1; then
        jq '. + {"tokenIds": {"mockRecessionNoTokenId": "105452622481843462309689659320513353976826103710406847075024399449421535866880"}}' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
    fi
    
    # Update the contract address and timestamp
    jq --arg key "{{contract_key}}" --arg address "$CONTRACT_ADDRESS" --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '
      .contracts[$key] = $address |
      .metadata.lastUpdated = $timestamp
    ' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
    
    echo "Updated {{contract_key}} in $CONFIG_FILE"

# Update market deployment config with deployed contract addresses
update-market-config:
    @echo "Updating market deployment config with deployed contract addresses..."
    @just _update-market-config MockUSDC.s.sol mockUsdc
    @just _update-market-config MockOracle.s.sol mockOracle
    @just _update-market-config MockPolyMarketCTF.s.sol mockPolyMarketCTF
    @just _update-market-config RecessionNoCTFWrapper.s.sol recessionNoWrapper
    @echo "✓ All addresses updated in market-deployment.json"

# Show current market deployment config
show-market:
    @echo "Current market deployment config:"
    @if [ -f "protocol-config.json" ]; then \
        echo "Market: $(jq -r '.metadata.description' protocol-config.json)"; \
        echo "Network: $(jq -r '.metadata.network' protocol-config.json) (Chain ID: $(jq -r '.metadata.chainId' protocol-config.json))"; \
        echo ""; \
        echo "Protocol Configuration:"; \
        echo "  Morpho Blue: $(jq -r '.morpho.morphoBlueAddress' protocol-config.json)"; \
        echo "  Adaptive Curve IRM: $(jq -r '.morpho.adaptiveCurveIrmAddress' protocol-config.json)"; \
        echo "  LLTV: $(jq -r '.market.lltv' protocol-config.json)"; \
        echo "  TokenId: $(cast keccak 'Recession NO token')"; \
        echo ""; \
    else \
        echo "Warning: protocol-config.json not found"; \
        echo ""; \
    fi
    @if [ -f "market-deployment.json" ]; then \
        echo "Last Deployment: $(jq -r '.metadata.lastUpdated' market-deployment.json)"; \
        echo "Deployed Contracts:"; \
        jq -r '.contracts | to_entries[] | "  \(.key): \(.value)"' market-deployment.json; \
    else \
        echo "No deployment config found. Run 'just update-market-config' after deploying contracts."; \
    fi

# Calculate market ID from configuration files
calculate-market-id:
    #!/usr/bin/env bash
    if [ ! -f "protocol-config.json" ] || [ ! -f "market-deployment.json" ]; then
        echo "Error: Both protocol-config.json and market-deployment.json are required"
        exit 1
    fi
    
    # Extract required values
    LOAN_TOKEN=$(jq -r '.contracts.mockUsdc' market-deployment.json)
    COLLATERAL_TOKEN=$(jq -r '.contracts.recessionNoWrapper' market-deployment.json)
    ORACLE=$(jq -r '.contracts.mockOracle' market-deployment.json)
    IRM=$(jq -r '.morpho.adaptiveCurveIrmAddress' protocol-config.json)
    LLTV=$(jq -r '.market.lltv' protocol-config.json)
    
    # Validate addresses
    if [ "$LOAN_TOKEN" = "null" ] || [ "$COLLATERAL_TOKEN" = "null" ] || [ "$ORACLE" = "null" ]; then
        echo "Error: Missing deployed contract addresses. Run 'just update-market-config' first."
        exit 1
    fi
    
    echo "Calculating Market ID with:"
    echo "  Loan Token: $LOAN_TOKEN"
    echo "  Collateral Token: $COLLATERAL_TOKEN"
    echo "  Oracle: $ORACLE"
    echo "  IRM: $IRM"
    echo "  LLTV: $LLTV"
    echo ""
    
    # Calculate market ID using cast
    MARKET_ID=$(cast keccak "$(cast abi-encode "f(address,address,address,address,uint256)" $LOAN_TOKEN $COLLATERAL_TOKEN $ORACLE $IRM $LLTV)")
    echo "Market ID: $MARKET_ID"

# Borrow 1 USDC using config values
borrow-1-usdc:
    #!/usr/bin/env bash
    if [ ! -f "protocol-config.json" ] || [ ! -f "market-deployment.json" ]; then
        echo "Error: Both protocol-config.json and market-deployment.json are required"
        exit 1
    fi
    
    # Extract required values
    MORPHO_BLUE=$(jq -r '.morpho.morphoBlueAddress' protocol-config.json)
    LOAN_TOKEN=$(jq -r '.contracts.mockUsdc' market-deployment.json)
    COLLATERAL_TOKEN=$(jq -r '.contracts.recessionNoWrapper' market-deployment.json)
    ORACLE=$(jq -r '.contracts.mockOracle' market-deployment.json)
    IRM=$(jq -r '.morpho.adaptiveCurveIrmAddress' protocol-config.json)
    LLTV=$(jq -r '.market.lltv' protocol-config.json)
    
    # Validate addresses
    if [ "$LOAN_TOKEN" = "null" ] || [ "$COLLATERAL_TOKEN" = "null" ] || [ "$ORACLE" = "null" ]; then
        echo "Error: Missing deployed contract addresses. Run 'just update-market-config' first."
        exit 1
    fi
    
    echo "Borrowing 1 USDC with market parameters:"
    echo "  Morpho Blue: $MORPHO_BLUE"
    echo "  Loan Token: $LOAN_TOKEN"
    echo "  Collateral Token: $COLLATERAL_TOKEN"
    echo "  Oracle: $ORACLE"
    echo "  IRM: $IRM"
    echo "  LLTV: $LLTV"
    echo ""
    
    # Execute borrow transaction
    cast send "$MORPHO_BLUE" "borrow((address,address,address,address,uint256),uint256,uint256,address,address)" "($LOAN_TOKEN,$COLLATERAL_TOKEN,$ORACLE,$IRM,$LLTV)" 1000000 0 0xe71DB3894A79BeBe377fbD7B601766660Aaea5f9 0xe71DB3894A79BeBe377fbD7B601766660Aaea5f9 --rpc-url $POLYGON_RPC --account chromion

