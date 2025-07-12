## Deployment Order

```
┌─────────────────────────────────┐
│         Independent             │
│       (deploy in any order)     │
├─────────────────────────────────┤
│  • Mock USDC (lending asset)    │
│  • Mock Oracle (price feed)     │
│  • Mock PolyMarket CTF (ERC1155) │
└─────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│         CTF Wrapper             │
│  (wraps MockRecessionNoToken)   │
│                                 │
│  Requires:                      │
│  └─ Mock PolyMarket CTF         │
└─────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│        Morpho Market            │
│     (Blue Market creation)      │
│                                 │
│  Requires:                      │
│  ├─ Mock USDC                   │
│  ├─ CTF Wrapper                 │
│  └─ Mock Oracle                 │
└─────────────────────────────────┘
```

## Summary

This project creates a **leveraged prediction positions system** that enables users to borrow USDC against prediction market tokens as collateral through Morpho Blue. 

**Core mechanism:**
1. Wraps ERC1155 prediction tokens (e.g., "Recession NO") into ERC20 format for DeFi compatibility
2. Uses wrapped tokens as collateral in a Morpho Blue lending market (77% LTV)
3. Allows borrowing USDC to purchase more prediction tokens, creating leveraged exposure
4. Integrates Polymarket-style conditional token framework with advanced lending infrastructure

**Key innovation:** Bridges prediction markets with DeFi lending, allowing traders to amplify their bets while maintaining liquidity and accessing yield opportunities on prediction assets.
