# Simple justfile for deploying contracts on Polygon

# Configuration variables
USER_ADDRESS := "0xe71DB3894A79BeBe377fbD7B601766660Aaea5f9"

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
    @just update-market-config
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
        "mockRecessionNoTokenId": "67310324695548387399493871825869748760760185456703713607142904506781711187020"
      }
    }
    JSONEOF
    fi
    
    # Ensure tokenIds section exists in existing config files
    if ! jq -e '.tokenIds' "$CONFIG_FILE" > /dev/null 2>&1; then
        jq '. + {"tokenIds": {"mockRecessionNoTokenId": "67310324695548387399493871825869748760760185456703713607142904506781711187020"}}' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
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

# Borrow USDC using config values
borrow-usdc amount:
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
    
    echo "Borrowing {{amount}} USDC - scaled by decimals(): $(({{amount}} * 1000000)) - with market parameters:"
    echo "  Morpho Blue: $MORPHO_BLUE"
    echo "  Loan Token: $LOAN_TOKEN"
    echo "  Collateral Token: $COLLATERAL_TOKEN"
    echo "  Oracle: $ORACLE"
    echo "  IRM: $IRM"
    echo "  LLTV: $LLTV"
    echo ""
    
    # Execute borrow transaction
    cast send "$MORPHO_BLUE" "borrow((address,address,address,address,uint256),uint256,uint256,address,address)" "($LOAN_TOKEN,$COLLATERAL_TOKEN,$ORACLE,$IRM,$LLTV)" $(({{amount}}*1000000)) 0 {{USER_ADDRESS}} {{USER_ADDRESS}} --rpc-url $POLYGON_RPC --account chromion

# Repay USDC using config values
repay-usdc amount:
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
    
    echo "Repaying {{amount}} USDC - scaled by decimals(): $(({{amount}} * 1000000)) - with market parameters:"
    echo "  Morpho Blue: $MORPHO_BLUE"
    echo "  Loan Token: $LOAN_TOKEN"
    echo "  Collateral Token: $COLLATERAL_TOKEN"
    echo "  Oracle: $ORACLE"
    echo "  IRM: $IRM"
    echo "  LLTV: $LLTV"
    echo ""
    
    # Execute repay transaction
    cast send "$MORPHO_BLUE" "repay((address,address,address,address,uint256),uint256,uint256,address,bytes)" "($LOAN_TOKEN,$COLLATERAL_TOKEN,$ORACLE,$IRM,$LLTV)" $(({{amount}}*1000000)) 0 {{USER_ADDRESS}} "0x" --rpc-url $POLYGON_RPC --account chromion

# Supply/Lend wrapped CTF tokens as collateral
supply-collateral amount:
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
    
    echo "Supplying {{amount}} wrapped CTF tokens as collateral - scaled by decimals(): $(({{amount}} * 1000000000000000000)) - with market parameters:"
    echo "  Morpho Blue: $MORPHO_BLUE"
    echo "  Loan Token: $LOAN_TOKEN"
    echo "  Collateral Token: $COLLATERAL_TOKEN"
    echo "  Oracle: $ORACLE"
    echo "  IRM: $IRM"
    echo "  LLTV: $LLTV"
    echo ""
    
    # Execute supply collateral transaction
    cast send "$MORPHO_BLUE" "supplyCollateral((address,address,address,address,uint256),uint256,address,bytes)" "($LOAN_TOKEN,$COLLATERAL_TOKEN,$ORACLE,$IRM,$LLTV)" $(({{amount}}*1000000000000000000)) {{USER_ADDRESS}} "0x" --rpc-url $POLYGON_RPC --account chromion

# Withdraw collateral
withdraw-collateral amount:
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
    
    echo "Withdrawing {{amount}} wrapped CTF tokens collateral - scaled by decimals(): $(({{amount}} * 1000000000000000000)) - with market parameters:"
    echo "  Morpho Blue: $MORPHO_BLUE"
    echo "  Loan Token: $LOAN_TOKEN"
    echo "  Collateral Token: $COLLATERAL_TOKEN"
    echo "  Oracle: $ORACLE"
    echo "  IRM: $IRM"
    echo "  LLTV: $LLTV"
    echo ""
    
    # Execute withdraw collateral transaction
    cast send "$MORPHO_BLUE" "withdrawCollateral((address,address,address,address,uint256),uint256,address,address)" "($LOAN_TOKEN,$COLLATERAL_TOKEN,$ORACLE,$IRM,$LLTV)" $(({{amount}}*1000000000000000000)) {{USER_ADDRESS}} {{USER_ADDRESS}} --rpc-url $POLYGON_RPC --account chromion

approve-wrap bool:
    #!/usr/bin/env bash
    CTF_CONTRACT=$(jq -r '.contracts.mockPolyMarketCTF' market-deployment.json)
    CTF_WRAPPER=$(jq -r '.contracts.recessionNoWrapper' market-deployment.json)
    cast send $CTF_CONTRACT "setApprovalForAll(address,bool)" $CTF_WRAPPER {{bool}} --rpc-url $POLYGON_RPC --account chromion

# Wrap ERC1155 CTF tokens to ERC20
wrap-ctf amount:
    #!/usr/bin/env bash
    if [ ! -f "market-deployment.json" ]; then
        echo "Error: market-deployment.json is required"
        exit 1
    fi
    
    # Extract required values
    CTF_WRAPPER=$(jq -r '.contracts.recessionNoWrapper' market-deployment.json)
    TOKEN_ID=$(jq -r '.tokenIds.mockRecessionNoTokenId' market-deployment.json)
    
    # Validate addresses
    if [ "$CTF_WRAPPER" = "null" ] || [ "$TOKEN_ID" = "null" ]; then
        echo "Error: Missing deployed contract addresses. Run 'just update-market-config' first."
        exit 1
    fi
    
    echo "Wrapping {{amount}} ERC1155 CTF tokens (Token ID: $TOKEN_ID) to ERC20:"
    echo "  CTF Wrapper: $CTF_WRAPPER"
    echo "  Amount: $(({{amount}} * 1000000000000000000))"
    echo ""
    
    # Execute wrap transaction
    cast send "$CTF_WRAPPER" "wrap(uint256)" $(({{amount}}*1000000000000000000)) --rpc-url $POLYGON_RPC --account chromion

# Unwrap ERC20 back to ERC1155 CTF tokens
unwrap-ctf amount:
    #!/usr/bin/env bash
    if [ ! -f "market-deployment.json" ]; then
        echo "Error: market-deployment.json is required"
        exit 1
    fi
    
    # Extract required values
    CTF_WRAPPER=$(jq -r '.contracts.recessionNoWrapper' market-deployment.json)
    TOKEN_ID=$(jq -r '.tokenIds.mockRecessionNoTokenId' market-deployment.json)
    
    # Validate addresses
    if [ "$CTF_WRAPPER" = "null" ] || [ "$TOKEN_ID" = "null" ]; then
        echo "Error: Missing deployed contract addresses. Run 'just update-market-config' first."
        exit 1
    fi
    
    echo "Unwrapping {{amount}} ERC20 tokens back to ERC1155 CTF tokens (Token ID: $TOKEN_ID):"
    echo "  CTF Wrapper: $CTF_WRAPPER"
    echo "  Amount: $(({{amount}} * 1000000000000000000))"
    echo ""
    
    # Execute unwrap transaction
    cast send "$CTF_WRAPPER" "unwrap(uint256)" $(({{amount}}*1000000000000000000)) --rpc-url $POLYGON_RPC --account chromion

# Check USDC balance
balance-usdc:
    #!/usr/bin/env bash
    if [ ! -f "market-deployment.json" ]; then
        echo "Error: market-deployment.json is required"
        exit 1
    fi
    
    USDC_TOKEN=$(jq -r '.contracts.mockUsdc' market-deployment.json)
    
    if [ "$USDC_TOKEN" = "null" ]; then
        echo "Error: Missing USDC contract address. Run 'just update-market-config' first."
        exit 1
    fi
    
    echo "Checking USDC balance for account: {{USER_ADDRESS}}"
    echo "USDC Token: $USDC_TOKEN"
    echo ""
    
    # Get balance (6 decimals for USDC)
    BALANCE=$(cast call "$USDC_TOKEN" "balanceOf(address)" {{USER_ADDRESS}} --rpc-url $POLYGON_RPC)
    BALANCE_DECIMAL=$(cast to-dec $BALANCE)
    BALANCE_FORMATTED=$(echo "scale=6; $BALANCE_DECIMAL / 1000000" | bc -l)
    
    echo "Raw balance: $BALANCE_DECIMAL"
    echo "Formatted balance: $BALANCE_FORMATTED USDC"

# Check wrapped CTF token balance (ERC20)
balance-wrapped-ctf:
    #!/usr/bin/env bash
    if [ ! -f "market-deployment.json" ]; then
        echo "Error: market-deployment.json is required"
        exit 1
    fi
    
    CTF_WRAPPER=$(jq -r '.contracts.recessionNoWrapper' market-deployment.json)
    
    if [ "$CTF_WRAPPER" = "null" ]; then
        echo "Error: Missing CTF Wrapper contract address. Run 'just update-market-config' first."
        exit 1
    fi
    
    echo "Checking wrapped CTF token balance for account: {{USER_ADDRESS}}"
    echo "Wrapped CTF Token: $CTF_WRAPPER"
    echo ""
    
    # Get balance (18 decimals for wrapped token)
    BALANCE=$(cast call "$CTF_WRAPPER" "balanceOf(address)" {{USER_ADDRESS}} --rpc-url $POLYGON_RPC)
    BALANCE_DECIMAL=$(cast to-dec $BALANCE)
    BALANCE_FORMATTED=$(echo "scale=18; $BALANCE_DECIMAL / 1000000000000000000" | bc -l)
    
    echo "Raw balance: $BALANCE_DECIMAL"
    echo "Formatted balance: $BALANCE_FORMATTED wCTF"

# Check original ERC1155 CTF token balance
balance-ctf:
    #!/usr/bin/env bash
    if [ ! -f "market-deployment.json" ]; then
        echo "Error: market-deployment.json is required"
        exit 1
    fi
    
    CTF_CONTRACT=$(jq -r '.contracts.mockPolyMarketCTF' market-deployment.json)
    TOKEN_ID=$(jq -r '.tokenIds.mockRecessionNoTokenId' market-deployment.json)
    
    if [ "$CTF_CONTRACT" = "null" ] || [ "$TOKEN_ID" = "null" ]; then
        echo "Error: Missing CTF contract address or token ID. Run 'just update-market-config' first."
        exit 1
    fi
    
    echo "Checking ERC1155 CTF token balance for account: {{USER_ADDRESS}}"
    echo "CTF Contract: $CTF_CONTRACT"
    echo "Token ID: $TOKEN_ID"
    echo ""
    
    # Get balance (ERC1155 balanceOf)
    BALANCE=$(cast call "$CTF_CONTRACT" "balanceOf(address,uint256)" {{USER_ADDRESS}} "$TOKEN_ID" --rpc-url $POLYGON_RPC)
    BALANCE_DECIMAL=$(cast to-dec $BALANCE)
    BALANCE_FORMATTED=$(echo "scale=18; $BALANCE_DECIMAL / 1000000000000000000" | bc -l)
    
    echo "Raw balance: $BALANCE_DECIMAL"
    echo "Formatted balance: $BALANCE_FORMATTED CTF"

# Check ETH Above 100k YES token balance
balance-eth-above-100k:
    #!/usr/bin/env bash
    if [ ! -f "market-deployment.json" ]; then
        echo "Error: market-deployment.json is required"
        exit 1
    fi
    
    CTF_CONTRACT=$(jq -r '.contracts.mockPolyMarketCTF' market-deployment.json)
    TOKEN_ID="87281599019034697689531413320289746248038848690942428021222400256634856611553"
    
    if [ "$CTF_CONTRACT" = "null" ]; then
        echo "Error: Missing CTF contract address. Run 'just update-market-config' first."
        exit 1
    fi
    
    echo "Checking ETH Above 100k YES token balance for account: {{USER_ADDRESS}}"
    echo "CTF Contract: $CTF_CONTRACT"
    echo "Token ID: $TOKEN_ID (keccak256('Eth Above 100k YES token'))"
    echo ""
    
    # Get balance (ERC1155 balanceOf)
    BALANCE=$(cast call "$CTF_CONTRACT" "balanceOf(address,uint256)" {{USER_ADDRESS}} "$TOKEN_ID" --rpc-url $POLYGON_RPC)
    BALANCE_DECIMAL=$(cast to-dec $BALANCE)
    BALANCE_FORMATTED=$(echo "scale=18; $BALANCE_DECIMAL / 1000000000000000000" | bc -l)
    
    echo "Raw balance: $BALANCE_DECIMAL"
    echo "Formatted balance: $BALANCE_FORMATTED ETH100k"


# Check all token balances at once
balance-all:
    @echo "=== Checking all token balances ==="
    @echo ""
    @echo "1. USDC Balance:"
    @just balance-usdc
    @echo ""
    @echo "2. Wrapped CTF Balance:"
    @just balance-wrapped-ctf
    @echo ""
    @echo "3. Original ERC1155 CTF Balance (Recession NO):"
    @just balance-ctf
    @echo ""
    @echo "4. ETH Above 100k YES Token Balance:"
    @just balance-eth-above-100k

