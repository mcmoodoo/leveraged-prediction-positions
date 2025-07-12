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
