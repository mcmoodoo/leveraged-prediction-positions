import vaultAbi from './vault-abi.json'
import wrapperAbi from './wrapper-abi.json'
import priceFeedAbi from './pricefeed-abi.json'
import conditionalTokensAbi from './conditional-tokens-abi.json'

// Contract addresses from deployment-diaries.md
export const CONTRACTS = {
  POLYGON: {
    PRICE_FEED: '0x0DED163B6B7b258211CA20ABE72c376991eb7827' as const,
    YES_TOKEN_WRAPPER: '0x71c3DD1D3899Eb64f8e27F039E1dc59c8E2EeeDc' as const,
    NO_TOKEN_WRAPPER: '0x50D4dB02a75cBb530940fF054ef879eabf7eE931' as const,
    YES_LENDING_VAULT: '0x2Ab2001c0e992b9A2ec47ece631db7Be9465Aa35' as const,
    NO_LENDING_VAULT: '0x5d753b41860Df2Ccb228b7f643157443B0F30377' as const,
    CONDITIONAL_TOKENS: '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045' as const,
  }
} as const

export const ABIS = {
  VAULT: vaultAbi,
  WRAPPER: wrapperAbi,
  PRICE_FEED: priceFeedAbi,
  CONDITIONAL_TOKENS: conditionalTokensAbi,
} as const

export type ContractAddresses = typeof CONTRACTS.POLYGON
export type ContractABIs = typeof ABIS

// Helper types for contract interactions
export interface TokenPosition {
  collateralAmount: bigint
  borrowAmount: bigint
  tokenId: bigint
  isYesToken: boolean
}

export interface PositionData {
  collateralValue: bigint
  borrowValue: bigint
  isLiquidatable: boolean
  maxBorrowAmount: bigint
}

export const SUPPORTED_CHAINS = [137] // Polygon mainnet