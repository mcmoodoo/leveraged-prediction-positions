## Token ID

33064224357523449786613480102704635026181428303479305990935387590344871823925 in 0x4D97DCd97eC945f40cF65F87097ACe5EA0476045

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

# TODOs

- in the wrap/unwrap section, when I first want to wrap for the first time, I gotta have a separate button to approve, not mixed up with "Wrap CTF tokens". At the first visit the user should be warned that he has not approvedForAll and needs to approve the operator (i.e. the wrapping contract) to act of his behalf.
