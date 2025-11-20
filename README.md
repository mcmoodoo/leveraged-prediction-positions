# Leveraged Prediction Positions

A system that enables borrowing against ERC1155 prediction market tokens (Polymarket-style CTF tokens) as collateral through Morpho Blue. Wraps ERC1155 tokens into ERC20 format for DeFi compatibility.

## Overview

This project bridges ERC1155 conditional token framework (CTF) tokens with Morpho Blue lending markets by:

1. Wrapping ERC1155 prediction tokens into ERC20 tokens
2. Using wrapped tokens as collateral in Morpho Blue markets
3. Enabling borrowing of USDC against prediction token collateral

## Architecture

### Core Contracts

- **`CTFWrapper`**: ERC20 wrapper for ERC1155 tokens. Maintains 1:1 backing with underlying CTF tokens. Implements `ERC1155Holder` to receive tokens.
- **`MockPolyMarketCTF`**: ERC1155 implementation of Polymarket-style conditional tokens. Supports condition preparation, position splitting/merging, and payout redemption.
- **`MockOracle`**: Price oracle implementing Morpho's `IOracle` interface. Provides price feeds for wrapped CTF tokens.
- **`MockUSDC`**: ERC20 token (6 decimals) used as loan token in Morpho Blue markets.

### Market Configuration

Morpho Blue market parameters:
- **Loan Token**: MockUSDC
- **Collateral Token**: Wrapped CTF (ERC20)
- **Oracle**: MockOracle (prices wrapped CTF in USDC)
- **LLTV**: 77% (770000000000000000)
- **IRM**: Adaptive Curve IRM

## Contract Details

### CTFWrapper

```solidity
function wrap(uint256 amount) external
function unwrap(uint256 amount) external
```

- Wraps ERC1155 tokens by transferring them to the wrapper and minting ERC20 tokens
- Unwraps by burning ERC20 tokens and transferring underlying ERC1155 tokens back
- Each wrapper instance is bound to a specific CTF contract and token ID

### MockPolyMarketCTF

Implements the conditional token framework:
- `prepareCondition()`: Creates a new condition with oracle, question ID, and outcome count
- `splitPosition()`: Splits collateral into position tokens for each outcome
- `mergePositions()`: Merges position tokens back into collateral
- `redeemPositions()`: Redeems resolved positions for payout

## Deployment

### Prerequisites

- Foundry
- Polygon RPC endpoint
- Private key with MATIC for gas

### Deployment Order

1. **MockUSDC**: ERC20 loan token
2. **MockOracle**: Price oracle for wrapped CTF
3. **MockPolyMarketCTF**: ERC1155 CTF contract
4. **CTFWrapper**: Wrapper for specific CTF token ID
5. **Morpho Market**: Create market via Morpho Blue

### Commands

```bash
# Deploy all contracts
just deploy-all

# Deploy individually
just deploy-usdc
just deploy-oracle
just deploy-ctf
just deploy-wrapper
just deploy-market

# Mint test tokens
just mint-tokens
```

Deployment addresses are stored in `market-deployment.json`. The `update-market-config` command extracts addresses from Foundry broadcast files.

## Usage Flow

1. **Wrap CTF tokens**:
   ```solidity
   ctfWrapper.wrap(amount);
   ```

2. **Supply collateral to Morpho Blue**:
   ```solidity
   morpho.supplyCollateral(marketParams, amount, onBehalf, data);
   ```

3. **Borrow USDC**:
   ```solidity
   morpho.borrow(marketParams, assets, shares, onBehalf, receiver);
   ```

4. **Unwrap (after repaying)**:
   ```solidity
   ctfWrapper.unwrap(amount);
   ```

## Development

### Dependencies

- OpenZeppelin Contracts
- Morpho Blue Contracts
- Forge Std

### Testing

```bash
forge test
```

### Configuration

- `protocol-config.json`: Morpho Blue addresses and market parameters
- `market-deployment.json`: Deployed contract addresses

## Project Structure

```
src/
  ├── CTFWrapper.sol          # ERC20 wrapper for ERC1155
  ├── MockOracle.sol          # Price oracle
  ├── MockPolyMarketCTF.sol   # ERC1155 CTF implementation
  ├── MockUSDC.sol            # ERC20 loan token
  └── vaults/
      └── LenderYieldVault.sol # ERC4626 vault (conceptual)

script/
  ├── CreateMorphoMarket.s.sol
  ├── RecessionNoCTFWrapper.s.sol
  └── ...

test/
  ├── CTFWrapper.t.sol
  ├── MockOracle.t.sol
  └── MockUSDC.t.sol
```

## Network

Deployed on Polygon (Chain ID: 137)

- Morpho Blue: `0x1bF0c2541F820E775182832f06c0B7Fc27A25f67`
- Adaptive Curve IRM: `0xe675A2161D4a6E2de2eeD70ac98EEBf257FBF0B0`