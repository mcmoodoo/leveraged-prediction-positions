## Token ID

33064224357523449786613480102704635026181428303479305990935387590344871823925 in 0x4D97DCd97eC945f40cF65F87097ACe5EA0476045

## Deployment

1. I first need to deploy the collateral token (wrapped ERC1155 of the above token ID)
2. The loan token would be the mocked USDC mUSD
3. Liquidation Loan-to-Value (LLTV) would be set at 77% for now: 770000000000000000
4. The mocked oracle should already be deployed
5. I will re-use the Interest Rate Model contract at `address constant ADAPTIVE_CURVE_IRM = 0xe675A2161D4a6E2de2eeD70ac98EEBf257FBF0B0;`
