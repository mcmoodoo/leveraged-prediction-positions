import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygon } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Polymarket Leveraged Positions',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'DEFAULT_PROJECT_ID',
  chains: [polygon],
  ssr: false,
})

export const CHAIN_CONFIG = {
  [polygon.id]: {
    name: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorer: 'https://polygonscan.com',
  },
}

export const SUPPORTED_CHAIN_IDS = [polygon.id]