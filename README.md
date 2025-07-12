## Infrastructure

```solidity
    address constant POLYGON_CTF = 0x4D97DCd97eC945f40cF65F87097ACe5EA0476045;
    address constant POLYGON_CTF_EXCHANGE = 0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E;

    address constant MORPHO_BLUE_POLYGON = 0x1bF0c2541F820E775182832f06c0B7Fc27A25f67;

    address constant WRAPPED_YES_TOKEN = 0x_WRAP_THE_YES_TOKEN_IN_AN_ERC_20_CONTRACT_AN_GET_ITS_ADDRESS_HERE // collateral asset
    address constant USDC_MOCK = 0x_DEPLOY_FIRST // lending asset
    uint256 constant LLTV = 770000000000000000; // 77%
    address constant MOCK_ORACLE = 0x_this should return collateral_price / loan_price
    address constant ADAPTIVE_CURVE_IRM = 0xe675A2161D4a6E2de2eeD70ac98EEBf257FBF0B0;
```

## Deployment

1. I first need to deploy the collateral token (wrapped ERC1155 of the above token ID)
   ✅ [Success] Hash: 0x1c3f8969841563254acb71aec26d95cc8f7cef30ffe7bd0802dff5036e769705
   Contract Address: 0x88CD3FFC11ec1cEFbB46b58E67DE61Af29242765
   Redeployed the contract with 1:1000000 minting ratio: 0x067572C964b1500D2283547f162bcDdeBBDf091d

2. The loan token would be the mocked USDC mUSD
   Mock USDC deployed on Polygon with 1_000_000 total supply and 6 decimal points for fractions

   ✅ [Success] Hash: 0x71c3f91e4a9c40dd66f21694985ce5e5b6bc86bd270812cfc2f73659b7c413bf
   Contract Address: 0xb1b52134F9cD0F3E84E5861bCb444d4dF2A1aC80

3. Liquidation Loan-to-Value (LLTV) would be set at 77% for now: 770000000000000000

4. The mock oracle should already be deployed

   - Let's add a mock oracle smart contract that complies with chainlink's aggregator v3 interface. The token pair in this case collateral/loan
     ✅ [Success] Hash: 0x734ae5494159d7786b02bea84978d74b4b9831dbaafc83695037b6e7dc75c6d7
     Contract Address: 0x73AcB25b42EC034083e6dcc5468c21bE5D239598

5. I will re-use the Interest Rate Model contract at `address constant ADAPTIVE_CURVE_IRM = 0xe675A2161D4a6E2de2eeD70ac98EEBf257FBF0B0;`

== Logs ==
Created Morpho Blue Market with:
Morpho Blue: 0x1bF0c2541F820E775182832f06c0B7Fc27A25f67
Market ID: 0x1b7b5655f23ab9e447fcebc6c805e86e230b6f212c1100da3568b2a43bd6aabf

- redeployed new market for 1:1000000 ratio: 0x6bc3691176fe68f81e25bb2fccf542061e4aecfe7614eac08ea1381b3741125c

  Market created successfully!

✅ Updated .env with all deployed contract addresses including Mock Oracle
✅ Created IMorphoBlue.sol - Interface for Morpho Blue protocol
✅ Created CreateMorphoMarket.s.sol - Script to create market with all parameters from .env
✅ Created comprehensive test suite - 7 passing tests covering market creation

The Morpho Blue market creation setup includes:

- Loan Token: Mock USDC (0xb1b52134F9cD0F3E84E5861bCb444d4dF2A1aC80)
- Collateral Token: CTF Wrapper (0x88CD3FFC11ec1cEFbB46b58E67DE61Af29242765)
- Oracle: Mock Oracle (0x73AcB25b42EC034083e6dcc5468c21bE5D239598)
- IRM: Adaptive Curve IRM (0xe675A2161D4a6E2de2eeD70ac98EEBf257FBF0B0)
- LLTV: 77% (770000000000000000)

The script calculates the market ID and creates the market on Morpho Blue. All tests pass, confirming the market creation logic
works correctly.

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

### Possible Oracle issue - wrong price

Albist | Morpho suggested:

```
but does the oracle returns a price? it does seem so checking at the market page.

In the code here (https://github.com/morpho-org/morpho-blue/blob/0448402af51b8293ed36653de43cbee8d4d2bfda/src/interfaces/IMorpho.sol#L104-L128) there are some conditions on how market's dependencies must behave for a market acting as expected.

Some being oracle related. As the market will check oracle price to see if the position taken by the borrower can actually be taken.

So the fact that the oracle is compliant to an interface is not enough, it has to actually properly return a price, not revert, etc.

Did you use the MorphoChainlinkOracleV2Factory to deploy the oracle? See doc on Oracle deployment in the documentation here.
```
