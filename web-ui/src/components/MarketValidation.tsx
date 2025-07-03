import { useReadContract } from 'wagmi'
import { keccak256, encodeAbiParameters, parseAbiParameters } from 'viem'
import { CONTRACT_ADDRESSES, MARKET_CONFIG } from '../contracts/addresses'

const MARKET_PARAMS = {
  loanToken: CONTRACT_ADDRESSES.MOCK_USDC,
  collateralToken: CONTRACT_ADDRESSES.CTF_WRAPPER,
  oracle: CONTRACT_ADDRESSES.MOCK_ORACLE,
  irm: CONTRACT_ADDRESSES.ADAPTIVE_CURVE_IRM,
  lltv: BigInt(MARKET_CONFIG.LLTV),
}

export function MarketValidation() {
  // Calculate expected market ID
  const calculatedMarketId = keccak256(
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

  // Check if market exists with our calculated ID
  const { data: marketData } = useReadContract({
    address: CONTRACT_ADDRESSES.MORPHO_BLUE,
    abi: [{
      "type": "function", 
      "name": "market",
      "inputs": [{"name": "id", "type": "bytes32"}],
      "outputs": [
        {"name": "totalSupplyAssets", "type": "uint128"},
        {"name": "totalSupplyShares", "type": "uint128"},
        {"name": "totalBorrowAssets", "type": "uint128"},
        {"name": "totalBorrowShares", "type": "uint128"},
        {"name": "lastUpdate", "type": "uint128"},
        {"name": "fee", "type": "uint128"}
      ],
      "stateMutability": "view"
    }],
    functionName: 'market',
    args: [calculatedMarketId],
  })

  // Check oracle price
  const { data: oraclePrice } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_ORACLE,
    abi: [{
      "type": "function",
      "name": "latestRoundData", 
      "inputs": [],
      "outputs": [
        {"name": "roundId", "type": "uint80"},
        {"name": "answer", "type": "int256"},
        {"name": "startedAt", "type": "uint256"},
        {"name": "updatedAt", "type": "uint256"},
        {"name": "answeredInRound", "type": "uint80"}
      ],
      "stateMutability": "view"
    }],
    functionName: 'latestRoundData',
  })

  return (
    <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
      <h4 className="font-medium text-blue-800 mb-2">🔧 Market Validation</h4>
      <div className="text-sm text-blue-700 space-y-1">
        <p><strong>Market IDs:</strong></p>
        <p>• Expected: {MARKET_CONFIG.MARKET_ID}</p>
        <p>• Calculated: {calculatedMarketId}</p>
        <p>• Match: {calculatedMarketId === MARKET_CONFIG.MARKET_ID ? '✅ YES' : '❌ NO'}</p>
        
        <p><strong>Market Data:</strong></p>
        {marketData ? (
          <>
            <p>• Total Supply: {marketData[0].toString()} USDC (6 dec)</p>
            <p>• Total Borrow: {marketData[2].toString()} USDC (6 dec)</p>
            <p>• Last Update: {marketData[4].toString()}</p>
            <p>• Available to Borrow: {(marketData[0] - marketData[2]).toString()} USDC</p>
          </>
        ) : (
          <p>• ❌ Market not found or error loading</p>
        )}

        <p><strong>Oracle Price:</strong></p>
        {oraclePrice ? (
          <>
            <p>• Price: {oraclePrice[1].toString()} (8 decimals)</p>
            <p>• Formatted: {(Number(oraclePrice[1]) / 10**8).toFixed(8)} CTF/USDC</p>
            <p>• Round ID: {oraclePrice[0].toString()}</p>
          </>
        ) : (
          <p>• ❌ Oracle price not available</p>
        )}

        <p><strong>Market Parameters:</strong></p>
        <p>• Loan Token: {MARKET_PARAMS.loanToken}</p>
        <p>• Collateral Token: {MARKET_PARAMS.collateralToken}</p>
        <p>• Oracle: {MARKET_PARAMS.oracle}</p>
        <p>• IRM: {MARKET_PARAMS.irm}</p>
        <p>• LLTV: {MARKET_PARAMS.lltv.toString()}</p>
      </div>
    </div>
  )
}