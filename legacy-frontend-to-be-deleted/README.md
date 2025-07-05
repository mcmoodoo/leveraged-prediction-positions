# Polymarket Leveraged Positions - Frontend

A beautiful, professional web application for creating leveraged positions on Polymarket prediction tokens using DeFi lending protocols.

## Features

- **Wallet Integration**: Connect with MetaMask, WalletConnect, and other popular wallets
- **Token Wrapping**: Convert ERC1155 Polymarket tokens to ERC20 format
- **Leveraged Positions**: Create leveraged positions with customizable LTV ratios
- **Real-time Monitoring**: Track position health and liquidation risk
- **Professional UI**: Clean, responsive design with beautiful animations

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom color palette
- **Web3**: wagmi + RainbowKit for wallet connections
- **UI Components**: Headless UI + Lucide React icons
- **Animations**: Framer Motion

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the environment example file:

```bash
cp .env.example .env
```

Edit `.env` and add your WalletConnect Project ID:

```
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/).

### 3. Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## Architecture

### Components

- **Header**: Wallet connection and navigation
- **Dashboard**: Position monitoring and portfolio overview
- **WrapTokens**: ERC1155 → ERC20 token conversion
- **CreatePosition**: Leveraged position creation with 3-step flow

### Contract Integration

The app integrates with deployed contracts on Polygon:

- **Price Feed**: `0x0DED163B6B7b258211CA20ABE72c376991eb7827`
- **YES Token Wrapper**: `0x71c3DD1D3899Eb64f8e27F039E1dc59c8E2EeeDc`
- **NO Token Wrapper**: `0x50D4dB02a75cBb530940fF054ef879eabf7eE931`
- **YES Lending Vault**: `0x2Ab2001c0e992b9A2ec47ece631db7Be9465Aa35`
- **NO Lending Vault**: `0x5d753b41860Df2Ccb228b7f643157443B0F30377`

### User Flow

1. **Connect Wallet**: Users connect their Web3 wallet
2. **Wrap Tokens**: Convert Polymarket ERC1155 tokens to ERC20
3. **Approve Spending**: Approve the vault to spend wrapped tokens
4. **Create Position**: Deposit collateral and borrow USDC for leverage
5. **Monitor**: Track position health and liquidation risk in real-time

## Design System

### Color Palette

- **Base**: Soft neutrals (white, light gray, beige)
- **Navy**: Primary brand color for buttons and highlights
- **Emerald**: Success states and positive indicators
- **Burnt Orange**: Warning states and NO token indicators

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components

- **Cards**: Rounded corners with soft shadows
- **Buttons**: Two styles (primary navy, secondary white)
- **Inputs**: Clean borders with focus states
- **Status Indicators**: Color-coded health and risk indicators

## Development

### Adding New Features

1. Create components in `src/components/`
2. Add contract calls using wagmi hooks
3. Follow the existing design patterns
4. Test with MetaMask on Polygon network

### Styling Guidelines

- Use Tailwind utility classes
- Follow the established color palette
- Ensure responsive design (mobile-first)
- Add loading states and error handling

## Deployment

The app can be deployed to any static hosting service:

- **Netlify**: Drag-and-drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **IPFS**: For decentralized hosting

## Security Considerations

- Never commit private keys or sensitive data
- Always validate user inputs
- Use proper error boundaries
- Implement proper loading states to prevent race conditions

## Support

For issues or questions:

1. Check the browser console for errors
2. Ensure you're connected to Polygon network
3. Verify contract addresses are correct
4. Make sure you have test tokens for development