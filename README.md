## Deployment Order

### 1. Deploy Mock Contracts (Independent)

These contracts have no dependencies and can be deployed in any order:

```bash
# Deploy Mock USDC (lending asset)
forge script script/MockUSDC.s.sol:MockUSDCScript --rpc-url $POLYGON_RPC --account chromion --broadcast

# Deploy Mock Oracle (price feed for CTF/USDC)
forge script script/MockOracle.s.sol:MockOracleScript --rpc-url $POLYGON_RPC --account chromion --broadcast

# Deploy Mock PolyMarket CTF (ERC1155 tokens)
forge script script/MockPolyMarketCTF.s.sol:MockPolyMarketCTFScript --rpc-url $POLYGON_RPC --account chromion --broadcast
```

### 2. Deploy CTF Wrapper (Depends on Mock PolyMarket CTF)

```bash
# Deploy CTF Wrapper for MockRecessionNoToken
# Requires: MOCK_POLYMARKET_CTF_ADDRESS to be set in .env
forge script script/RecessionNoCTFWrapper.s.sol:MockRecessionNoTokenWrapperScript --rpc-url $POLYGON_RPC --account chromion --broadcast
```

### 3. Create Morpho Market (Depends on All Above)

```bash
# Create Morpho Blue Market
# Requires: MOCK_USDC_ADDRESS, CTF_WRAPPER_ADDRESS, MOCK_ORACLE_ADDRESS to be set in .env
forge script script/CreateMorphoMarket.s.sol:CreateMorphoMarketScript --rpc-url $POLYGON_RPC --account chromion --broadcast
```
