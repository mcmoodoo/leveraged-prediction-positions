// TypeScript interfaces for configuration files

export interface ProtocolConfig {
  metadata: {
    description: string
    network: string
    chainId: string
  }
  morpho: {
    morphoBlueAddress: string
    adaptiveCurveIrmAddress: string
  }
  market: {
    lltv: string
  }
}

export interface MarketDeployment {
  metadata: {
    marketName: string
    network: string
    chainId: string
    lastUpdated: string
  }
  contracts: {
    mockUsdc: string
    mockOracle: string
    mockPolyMarketCTF: string
    recessionNoWrapper: string
  }
  tokenIds: {
    mockRecessionNoTokenId: string
  }
}