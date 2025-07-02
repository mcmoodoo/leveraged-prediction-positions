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
2. The loan token would be the mocked USDC mUSD
   Mock USDC deployed on Polygon with 1_000_000 total supply and 6 decimal points for fractions

   ✅ [Success] Hash: 0x71c3f91e4a9c40dd66f21694985ce5e5b6bc86bd270812cfc2f73659b7c413bf
   Contract Address: 0xb1b52134F9cD0F3E84E5861bCb444d4dF2A1aC80

3. Liquidation Loan-to-Value (LLTV) would be set at 77% for now: 770000000000000000
4. The mock oracle should already be deployed
   - Let's add a mock oracle smart contract that complies with chainlink's aggregator v3 interface. The token pair in this case collateral/loan
5. I will re-use the Interest Rate Model contract at `address constant ADAPTIVE_CURVE_IRM = 0xe675A2161D4a6E2de2eeD70ac98EEBf257FBF0B0;`

## Prompt
