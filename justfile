# DeFi Contract Operations

# Deploy contracts
deploy-usdc:
    forge script script/MockUSDC.s.sol:MockUSDCScript --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY --broadcast

deploy-oracle:
    forge script script/MockOracle.s.sol:MockOracleScript --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY --broadcast

deploy-ctf:
    forge script script/MockPolyMarketCTF.s.sol:MockPolyMarketCTFScript --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY --broadcast

deploy-wrapper:
    @just update-market-config
    forge script script/RecessionNoCTFWrapper.s.sol:MockRecessionNoTokenWrapperScript --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY --broadcast

deploy-market:
    @just update-market-config
    forge script script/CreateMorphoMarket.s.sol:CreateMorphoMarketScript --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY --broadcast

deploy-all:
    @just deploy-usdc && just deploy-oracle && just deploy-ctf && just deploy-wrapper && just deploy-market

mint-tokens:
    forge script script/MintTestTokens.s.sol:MintTestTokensScript --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY --broadcast

# Config management
update-market-config:
    @echo "Updating market deployment config..."
    @just _update-market-config MockUSDC.s.sol mockUsdc
    @just _update-market-config MockOracle.s.sol mockOracle
    @just _update-market-config MockPolyMarketCTF.s.sol mockPolyMarketCTF
    @just _update-market-config RecessionNoCTFWrapper.s.sol recessionNoWrapper
    @echo "✓ All addresses updated"

_update-market-config script_name contract_key:
    #!/usr/bin/env bash
    BROADCAST_FILE="broadcast/{{script_name}}/137/run-latest.json"
    CONFIG_FILE="market-deployment.json"
    
    CONTRACT_ADDRESS=$(jq -r '.transactions[0].contractAddress' "$BROADCAST_FILE")
    [ "$CONTRACT_ADDRESS" = "null" ] && exit 1
    
    [ ! -f "$CONFIG_FILE" ] && echo '{"metadata":{"marketName":"leveraged-prediction-positions","network":"polygon","chainId":"137","lastUpdated":null},"contracts":{},"tokenIds":{"mockRecessionNoTokenId":"67310324695548387399493871825869748760760185456703713607142904506781711187020"}}' > "$CONFIG_FILE"
    
    jq --arg key "{{contract_key}}" --arg address "$CONTRACT_ADDRESS" --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '.contracts[$key] = $address | .metadata.lastUpdated = $timestamp' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"

show-market:
    @jq -r '.contracts | to_entries[] | "\(.key): \(.value)"' market-deployment.json

# Market operations
calculate-market-id:
    @cast keccak "$(cast abi-encode "f(address,address,address,address,uint256)" $LOAN_TOKEN $COLLATERAL_TOKEN $MOCK_ORACLE $ADAPTIVE_CURVE_IRM $LLTV)"

borrow-usdc amount:
    cast send "$MORPHO_BLUE" "borrow((address,address,address,address,uint256),uint256,uint256,address,address)" "($LOAN_TOKEN,$COLLATERAL_TOKEN,$MOCK_ORACLE,$ADAPTIVE_CURVE_IRM,$LLTV)" $(({{amount}}*10**$(cast call $LOAN_TOKEN "decimals()" --rpc-url $POLYGON_RPC | cast to-dec))) 0 $USER_ADDRESS $USER_ADDRESS --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY 
repay-usdc amount:
    cast send "$MORPHO_BLUE" "repay((address,address,address,address,uint256),uint256,uint256,address,bytes)" "($LOAN_TOKEN,$COLLATERAL_TOKEN,$MOCK_ORACLE,$ADAPTIVE_CURVE_IRM,$LLTV)" $(({{amount}}*10**$(cast call $LOAN_TOKEN "decimals()" --rpc-url $POLYGON_RPC | cast to-dec))) 0 $USER_ADDRESS "0x" --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY 
approve-morpho-collateral:
    cast send "$COLLATERAL_TOKEN" "approve(address,uint256)" "$MORPHO_BLUE" 115792089237316195423570985008687907853269984665640564039457584007913129639935 --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY

approve-morpho-loan:
    cast send "$LOAN_TOKEN" "approve(address,uint256)" "$MORPHO_BLUE" 115792089237316195423570985008687907853269984665640564039457584007913129639935 --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY 
supply-collateral amount:
    cast send "$MORPHO_BLUE" "supplyCollateral((address,address,address,address,uint256),uint256,address,bytes)" "($LOAN_TOKEN,$COLLATERAL_TOKEN,$MOCK_ORACLE,$ADAPTIVE_CURVE_IRM,$LLTV)" $(({{amount}}*10**18)) $USER_ADDRESS "0x" --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY 
withdraw-collateral amount:
    cast send "$MORPHO_BLUE" "withdrawCollateral((address,address,address,address,uint256),uint256,address,address)" "($LOAN_TOKEN,$COLLATERAL_TOKEN,$MOCK_ORACLE,$ADAPTIVE_CURVE_IRM,$LLTV)" $(({{amount}}*10**18)) $USER_ADDRESS $USER_ADDRESS --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY

# Lender operations
supply-loan amount:
    cast send "$MORPHO_BLUE" "supply((address,address,address,address,uint256),uint256,uint256,address,bytes)" "($LOAN_TOKEN,$COLLATERAL_TOKEN,$MOCK_ORACLE,$ADAPTIVE_CURVE_IRM,$LLTV)" $(({{amount}}*10**$(cast call $LOAN_TOKEN "decimals()" --rpc-url $POLYGON_RPC | cast to-dec))) 0 $USER_ADDRESS "0x" --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY

withdraw-loan amount:
    cast send "$MORPHO_BLUE" "withdraw((address,address,address,address,uint256),uint256,uint256,address,address)" "($LOAN_TOKEN,$COLLATERAL_TOKEN,$MOCK_ORACLE,$ADAPTIVE_CURVE_IRM,$LLTV)" $(({{amount}}*10**$(cast call $LOAN_TOKEN "decimals()" --rpc-url $POLYGON_RPC | cast to-dec))) 0 $USER_ADDRESS $USER_ADDRESS --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY 
# Token operations
approve-wrap bool:
    cast send $MOCK_POLYMARKET_CTF "setApprovalForAll(address,bool)" $COLLATERAL_TOKEN {{bool}} --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY 
wrap-ctf amount:
    cast send "$COLLATERAL_TOKEN" "wrap(uint256)" $(({{amount}}*1000000000000000000)) --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY 
unwrap-ctf amount:
    cast send "$COLLATERAL_TOKEN" "unwrap(uint256)" $(({{amount}}*10**$(cast call $COLLATERAL_TOKEN "decimals()" --rpc-url $POLYGON_RPC | cast to-dec))) --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY 
# Balance checks
balance-usdc:
    @echo "USDC: $(cast call "$LOAN_TOKEN" "balanceOf(address)" $USER_ADDRESS --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY | cast to-dec)"

balance-wrapped-ctf:
    @echo "Wrapped CTF: $(cast call "$COLLATERAL_TOKEN" "balanceOf(address)" $USER_ADDRESS --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY | cast to-dec )"

balance-ctf:
    @echo "CTF: $(cast call "$MOCK_POLYMARKET_CTF" "balanceOf(address,uint256)" $USER_ADDRESS "$MOCK_RECESSION_NO_TOKEN_ID" --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY | cast to-dec)"

balance-eth-above-100k:
    @echo "ETH100k: $(cast call "$MOCK_POLYMARKET_CTF" "balanceOf(address,uint256)" $USER_ADDRESS "$ETH_ABOVE_100K_TOKEN_ID" --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY | cast to-dec)"

balance-morpho:
    @echo "Morpho Position: $(cast call "$MORPHO_BLUE" "position(bytes32,address)(uint256,uint128,uint128)" $(just calculate-market-id) $USER_ADDRESS --rpc-url $POLYGON_RPC --private-key $PRIVATE_KEY)"

balance-all:
    @just balance-usdc && just balance-wrapped-ctf && just balance-ctf && just balance-morpho
