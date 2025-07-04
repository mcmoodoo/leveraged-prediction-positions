export const CONTRACT_ADDRESSES = {
  // Morpho Blue from .env
  MORPHO_BLUE: '0x1bF0c2541F820E775182832f06c0B7Fc27A25f67' as const,
  
  // Mock USDC from .env
  MOCK_USDC: '0x33eef5d955da603208dec0d710c7285ff4a4f379' as const,
  
  // CTF Wrapper from .env  
  CTF_WRAPPER: '0x779e2165674607c5c60037977fbfd2685df9ea3b' as const,
  
  // Mock Oracle from .env
  MOCK_ORACLE: '0x70e5880144b02388b55fa19074d752b5f00b6c6b' as const,
  
  // Adaptive Curve IRM from .env
  ADAPTIVE_CURVE_IRM: '0xe675A2161D4a6E2de2eeD70ac98EEBf257FBF0B0' as const,
  
  // Mock PolyMarket CTF from .env
  MOCK_POLYMARKET_CTF: '0xc7a225ea3c6ae9722c9a5958e1c72d1623c2a35e' as const,
} as const

export const MARKET_CONFIG = {
  // Market ID from .env
  MARKET_ID: '0xb21376196a2c72db1948f39e2d122b99146699a6b7ea0e9e3a51a11026ba527d' as const,
  
  // CTF Token ID: keccak256("Recession NO token")
  CTF_TOKEN_ID: '67310324695548387399493871825869748760760185456703713607142904506781711187020',
  
  // 77% LTV ratio from .env
  LLTV: '770000000000000000',
} as const

// Additional token IDs for reference
export const TOKEN_IDS = {
  RECESSION_YES_TOKEN: '87281599019034697689531413320289746248038848690942428021222400256634856611553', // keccak256("Recession YES token")  
  RECESSION_NO_TOKEN: '67310324695548387399493871825869748760760185456703713607142904506781711187020',  // keccak256("Recession NO token")
} as const