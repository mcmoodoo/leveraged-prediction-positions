#!/usr/bin/env bash

export USER_ADDRESS="0xe71DB3894A79BeBe377fbD7B601766660Aaea5f9"
export ETH_ABOVE_100K_TOKEN_ID="87281599019034697689531413320289746248038848690942428021222400256634856611553"

if [ ! -f "protocol-config.json" ]; then
    echo "Error: protocol-config.json not found" >&2
    return 1
fi

if [ ! -f "market-deployment.json" ]; then
    echo "Error: market-deployment.json not found" >&2
    return 1
fi

# Protocol configuration
export MORPHO_BLUE=$(jq -r '.morpho.morphoBlueAddress' protocol-config.json)
export ADAPTIVE_CURVE_IRM=$(jq -r '.morpho.adaptiveCurveIrmAddress' protocol-config.json)
export LLTV=$(jq -r '.market.lltv' protocol-config.json)

# Deployed contracts
export LOAN_TOKEN=$(jq -r '.contracts.mockUsdc' market-deployment.json)
export MOCK_ORACLE=$(jq -r '.contracts.mockOracle' market-deployment.json)
export MOCK_POLYMARKET_CTF=$(jq -r '.contracts.mockPolyMarketCTF' market-deployment.json)
export COLLATERAL_TOKEN=$(jq -r '.contracts.recessionNoWrapper' market-deployment.json)
export MOCK_RECESSION_NO_TOKEN_ID=$(jq -r '.tokenIds.mockRecessionNoTokenId' market-deployment.json)

# Validate addresses
if [ "$LOAN_TOKEN" = "null" ] || [ "$COLLATERAL_TOKEN" = "null" ] || [ "$MOCK_ORACLE" = "null" ]; then
    echo "Error: Missing deployed contract addresses. Run 'just update-market-config' first." >&2
    return 1
fi
