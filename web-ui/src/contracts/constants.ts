// Contract addresses from deployment
export const CONTRACT_ADDRESSES = {
  MORPHO_BLUE: "0x1bF0c2541F820E775182832f06c0B7Fc27A25f67",
  ADAPTIVE_CURVE_IRM: "0xe675A2161D4a6E2de2eeD70ac98EEBf257FBF0B0",
  MOCK_USDC: "0x33eef5d955da603208dec0d710c7285ff4a4f379",
  CTF_WRAPPER: "0x2ceb0cb6bbbbea6f3dead524bccbcc26bc99df9b",
  MOCK_ORACLE: "0x70e5880144b02388b55fa19074d752b5f00b6c6b",
  MOCK_POLYMARKET_CTF: "0xc7a225ea3c6ae9722c9a5958e1c72d1623c2a35e",
} as const

// Token and market IDs
export const TOKEN_IDS = {
  RECESSION_NO: "0x94d04b2fa7ab23a8dee4149d109127d3dac352b11c9d173bf38aa40464abbc4c",
} as const

export const MARKET_IDS = {
  MORPHO_MARKET: "0xc4353add365a3d9df5ee452a9d53f35498fe312ad52b03e4ec6c95e514e8d441",
} as const

// Configuration constants
export const CONFIG = {
  LLTV: "770000000000000000", // 77% in wei
  MY_ADDRESS: "0xe71DB3894A79BeBe377fbD7B601766660Aaea5f9",
} as const

// Token decimal configurations based on contract implementations
export const TOKEN_DECIMALS = {
  // MockUSDC has 6 decimals
  USDC: 6,
  
  CTF_WRAPPER: 18,
  
  RAW_CTF: 6,
  
  // MockOracle uses 8 decimals (Chainlink standard)
  ORACLE: 8,
} as const

// Helper type for type safety
export type TokenType = keyof typeof TOKEN_DECIMALS
