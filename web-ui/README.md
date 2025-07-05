# Morpho Blue - Leveraged Prediction Positions UI

A React-based web interface for interacting with Morpho Blue markets using prediction market tokens as collateral.

## Features

- **Dashboard**: View balances, positions, and market statistics
- **Lend**: Supply USDC to earn interest from borrowers
- **Borrow**: Use CTF tokens as collateral to borrow USDC
- **Wrap/Unwrap**: Convert between ERC1155 and ERC20 CTF tokens

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your WalletConnect Project ID to `.env`:**
   ```
   VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Contract Addresses (Polygon)

- **Morpho Blue**: `0x1bF0c2541F820E775182832f06c0B7Fc27A25f67`
- **CTF Wrapper**: `0x88CD3FFC11ec1cEFbB46b58E67DE61Af29242765`
- **Mock USDC**: `0xb1b52134F9cD0F3E84E5861bCb444d4dF2A1aC80`
- **Mock Oracle**: `0x73AcB25b42EC034083e6dcc5468c21bE5D239598`
- **Market ID**: `0x1b7b5655f23ab9e447fcebc6c805e86e230b6f212c1100da3568b2a43bd6aabf`

## How to Use

1. **Connect Wallet**: Click "Connect Wallet" and connect your Polygon wallet
2. **Get Tokens**: Ensure you have CTF tokens and/or USDC
3. **Wrap CTF**: Convert ERC1155 CTF tokens to ERC20 for use in DeFi
4. **Supply/Borrow**: Use the lending and borrowing interfaces
5. **Monitor**: Check your position health and manage risk

## Key Concepts

- **LTV (Loan-to-Value)**: Maximum 77% - the ratio of borrowed value to collateral value
- **Health Factor**: Monitor your position to avoid liquidation
- **Interest**: Variable rates based on utilization
- **Wrapping**: Required to use CTF tokens in DeFi protocols

## Build

```bash
npm run build
```

## Technologies

- React 19 + TypeScript
- Vite for bundling
- Tailwind CSS for styling
- Wagmi + RainbowKit for Web3 integration
- React Router for navigation