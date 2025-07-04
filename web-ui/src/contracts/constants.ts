// Token decimal configurations based on contract implementations
export const TOKEN_DECIMALS = {
  // MockUSDC has 6 decimals
  USDC: 6,
  
  // CTFWrapper uses ERC20 default of 18 decimals
  CTF_WRAPPER: 18,
  
  // ERC1155 tokens don't have decimals - they use whole numbers
  RAW_CTF: 0,
  
  // MockOracle uses 8 decimals (Chainlink standard)
  ORACLE: 8,
} as const

// Helper type for type safety
export type TokenType = keyof typeof TOKEN_DECIMALS