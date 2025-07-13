// Import configuration from JSON files
import protocolConfig from '../../../protocol-config.json'
import marketDeployment from '../../../market-deployment.json'
import type { ProtocolConfig, MarketDeployment } from '../types/config'

// Type-safe config imports
const protocol = protocolConfig as ProtocolConfig
const deployment = marketDeployment as MarketDeployment

// Contract addresses from JSON configuration files
export const CONTRACT_ADDRESSES = {
  // From protocol-config.json
  morphoBlueAddress: protocol.morpho.morphoBlueAddress,
  adaptiveCurveIrmAddress: protocol.morpho.adaptiveCurveIrmAddress,
  
  // From market-deployment.json
  mockUsdc: deployment.contracts.mockUsdc,
  mockOracle: deployment.contracts.mockOracle,
  mockPolyMarketCTF: deployment.contracts.mockPolyMarketCTF,
  recessionNoWrapper: deployment.contracts.recessionNoWrapper,
} as const

// Token IDs from market deployment
export const TOKEN_IDS = {
  mockRecessionNoTokenId: deployment.tokenIds.mockRecessionNoTokenId,
} as const

// Configuration constants from protocol config
export const CONFIG = {
  lltv: protocol.market.lltv,
  network: protocol.metadata.network,
  chainId: protocol.metadata.chainId,
  MY_ADDRESS: "0xe71DB3894A79BeBe377fbD7B601766660Aaea5f9", // Keep this as is for now
} as const

// Market ID calculation utilities
import { keccak256, encodeAbiParameters, parseAbiParameters } from 'viem'

export const MARKET_PARAMS = {
  loanToken: CONTRACT_ADDRESSES.mockUsdc,
  collateralToken: CONTRACT_ADDRESSES.recessionNoWrapper,
  oracle: CONTRACT_ADDRESSES.mockOracle,
  irm: CONTRACT_ADDRESSES.adaptiveCurveIrmAddress,
  lltv: BigInt(CONFIG.lltv),
} as const

// Calculated market ID (this should match what Morpho generates)
export const CALCULATED_MARKET_ID = keccak256(
  encodeAbiParameters(
    parseAbiParameters('address,address,address,address,uint256'),
    [
      MARKET_PARAMS.loanToken,
      MARKET_PARAMS.collateralToken,
      MARKET_PARAMS.oracle,
      MARKET_PARAMS.irm,
      MARKET_PARAMS.lltv
    ]
  )
)

// For backward compatibility and reference
export const EXPECTED_MARKET_ID = "0xc4353add365a3d9df5ee452a9d53f35498fe312ad52b03e4ec6c95e514e8d441" as const

// Token decimal configurations based on contract implementations
export const TOKEN_DECIMALS = {
  // MockUSDC has 6 decimals
  USDC: 6,
  
  CTF_WRAPPER: 18,
  
  RAW_CTF: 18,
  
  // MockOracle uses 8 decimals (Chainlink standard)
  ORACLE: 36,
} as const

// Helper type for type safety
export type TokenType = keyof typeof TOKEN_DECIMALS
