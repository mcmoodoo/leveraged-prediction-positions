# Vault Architecture Diagrams

## Current System vs. Vault-Enhanced System

### Current System (Direct)
```
┌─────────────────┐
│   Lenders       │
│   (USDC)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Morpho Blue    │
│  Market         │
│  (wCTF/USDC)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Borrowers     │
│   (wCTF Collat) │
└─────────────────┘
```

### Enhanced System with Vaults

#### Option A: Lender Yield Vault
```
┌─────────────────┐
│   Lenders       │
│   (USDC)        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Lender Yield Vault (ERC4626)  │
│   - Instant liquidity           │
│   - Yield optimization          │
└─────┬───────────────────┬───────┘
      │                   │
      ▼                   ▼
┌─────────────┐   ┌──────────────────┐
│ Morpho Blue │   │ Morpho V2 Markets│
│ (Variable)  │   │ (Fixed-rate)     │
└─────────────┘   └──────────────────┘
```

#### Option B: Leveraged Position Vault
```
┌─────────────────┐
│   Users         │
│   (USDC)        │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Leveraged Prediction Vault (ERC4626)│
│  - Auto-leverage                     │
│  - Position management               │
└─────┬────────────────────────┬───────┘
      │                        │
      ▼                        ▼
┌─────────────┐        ┌──────────────┐
│ CTF Wrapper │        │ Morpho Blue  │
│ (Wrap CTF)  │        │ (Borrow USDC)│
└──────┬──────┘        └──────┬───────┘
       │                      │
       └──────────┬───────────┘
                  ▼
         ┌─────────────────┐
         │  Buy More CTF   │
         │  (Leverage)     │
         └─────────────────┘
```

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Layer                                │
├─────────────────────────────────────────────────────────────┤
│  Lenders          │  Borrowers        │  Traders            │
│  (Want Yield)     │  (Want Leverage)  │  (Want Exposure)    │
└────────┬──────────┴──────────┬────────┴──────────┬──────────┘
         │                     │                   │
         ▼                     ▼                   ▼
┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│ Lender Vault    │  │ Leveraged Vault  │  │ Multi-Asset     │
│ (ERC4626)       │  │ (ERC4626)        │  │ Vault (ERC4626) │
└────────┬────────┘  └────────┬─────────┘  └────────┬────────┘
         │                    │                     │
         └────────────────────┼─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Allocation & Strategy Layer                     │
├─────────────────────────────────────────────────────────────┤
│  • Yield optimization                                        │
│  • Risk management                                           │
│  • Rebalancing logic                                         │
│  • Liquidity management                                      │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              Protocol Layer                                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Morpho Blue  │  │ Morpho V2    │  │ CTF Wrapper  │     │
│  │ (Variable)   │  │ Markets      │  │ (ERC20)      │     │
│  └──────────────┘  │ (Fixed-rate) │  └──────────────┘     │
│                    └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              Asset Layer                                     │
├─────────────────────────────────────────────────────────────┤
│  USDC          │  CTF Tokens (ERC1155)  │  Wrapped CTF      │
└────────────────┴────────────────────────┴───────────────────┘
```

## Data Flow: Lender Yield Vault

```
1. User deposits 1000 USDC
   └─→ Receives 1000 vault shares (1:1 initially)

2. Vault allocates:
   ├─→ 600 USDC → Morpho Blue (60%)
   ├─→ 300 USDC → Morpho V2 Markets (30%)
   └─→ 100 USDC → Reserve Pool (10%)

3. Yields accumulate:
   ├─→ Morpho Blue: 5% APY → 30 USDC/year
   ├─→ Morpho V2: 8% APY → 24 USDC/year
   └─→ Total: 54 USDC/year (5.4% APY)

4. User wants to withdraw 200 USDC:
   ├─→ Uses reserve pool (100 USDC)
   ├─→ Withdraws from Morpho Blue (100 USDC)
   └─→ Receives 200 USDC instantly

5. Vault rebalances:
   └─→ Adjusts allocations to maintain target ratios
```

## Data Flow: Leveraged Position Vault

```
1. User deposits 1000 USDC
   └─→ Receives vault shares

2. Vault executes leverage strategy:
   ├─→ Step 1: Buy 1000 USDC worth of CTF tokens
   ├─→ Step 2: Wrap CTF → 1000 wCTF
   ├─→ Step 3: Supply 1000 wCTF as collateral to Morpho Blue
   ├─→ Step 4: Borrow 770 USDC (77% LTV)
   ├─→ Step 5: Buy 770 USDC worth of CTF tokens
   ├─→ Step 6: Wrap → 770 wCTF
   └─→ Result: 1770 wCTF exposure with 1000 USDC (1.77x leverage)

3. Position management:
   ├─→ Monitor liquidation risk
   ├─→ Rebalance if needed
   └─→ Collect yield on collateral (if applicable)

4. User redeems shares:
   ├─→ Vault unwraps wCTF
   ├─→ Repays Morpho Blue loan
   ├─→ Sells remaining CTF for USDC
   └─→ Returns USDC to user
```

## Risk Management Flow

```
┌─────────────────┐
│  Vault Monitor  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Risk Checks                    │
├─────────────────────────────────┤
│  • Liquidation risk             │
│  • Allocation drift              │
│  • Reserve pool levels          │
│  • Oracle price feeds           │
└────────┬────────────────────────┘
         │
         ▼
    ┌────────┐
    │  Risk  │
    │  OK?   │
    └───┬────┘
        │
    ┌───┴───┐
    │       │
   Yes     No
    │       │
    │       ▼
    │   ┌─────────────────┐
    │   │  Take Action    │
    │   │  • Rebalance    │
    │   │  • Reduce risk  │
    │   │  • Pause ops    │
    │   └─────────────────┘
    │
    ▼
┌──────────────┐
│  Continue    │
│  Operations  │
└──────────────┘
```

## Composability Examples

### Vault of Vaults
```
┌─────────────────┐
│  Meta Vault     │
│  (ERC4626)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Vault  │ │ Vault  │
│   A    │ │   B    │
└────────┘ └────────┘
```

### Vault as Collateral
```
┌─────────────────┐
│  User           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Deposit USDC   │
│  to Vault       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Receive Vault  │
│  Shares         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Use Shares as  │
│  Collateral in  │
│  Morpho Blue    │
└─────────────────┘
```
