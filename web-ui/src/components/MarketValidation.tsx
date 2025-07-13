import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, MARKET_PARAMS, CALCULATED_MARKET_ID, EXPECTED_MARKET_ID } from '../contracts/constants'

export function MarketValidation() {
  // Check if all addresses are defined
  const hasValidAddresses = MARKET_PARAMS.loanToken && 
    MARKET_PARAMS.collateralToken && 
    MARKET_PARAMS.oracle && 
    MARKET_PARAMS.irm

  // Use the calculated market ID from constants
  const calculatedMarketId = hasValidAddresses ? CALCULATED_MARKET_ID : null

  // Check if market exists with our calculated ID
  const { data: marketData } = useReadContract({
    address: CONTRACT_ADDRESSES.morphoBlueAddress,
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
    args: calculatedMarketId ? [calculatedMarketId] : undefined,
    query: { enabled: !!calculatedMarketId },
  })

  // Check oracle price
  const { data: oraclePrice } = useReadContract({
    address: CONTRACT_ADDRESSES.mockOracle,
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
    query: { enabled: !!CONTRACT_ADDRESSES.mockOracle },
  })

  return (
    <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
      <h4 className="font-medium text-blue-800 mb-2">🔧 Market Validation</h4>
      <div className="text-sm text-blue-700 space-y-1">
        {!hasValidAddresses && (
          <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded">
            <p className="text-red-700"><strong>⚠️ Missing Contract Addresses:</strong></p>
            {!MARKET_PARAMS.loanToken && <p className="text-red-600">• MOCK_USDC address missing</p>}
            {!MARKET_PARAMS.collateralToken && <p className="text-red-600">• CTF_WRAPPER address missing</p>}
            {!MARKET_PARAMS.oracle && <p className="text-red-600">• MOCK_ORACLE address missing</p>}
            {!MARKET_PARAMS.irm && <p className="text-red-600">• ADAPTIVE_CURVE_IRM address missing</p>}
          </div>
        )}
        
        <p><strong>Market IDs:</strong></p>
        <p>• Expected: {EXPECTED_MARKET_ID}</p>
        <p>• Calculated: {calculatedMarketId || 'Error calculating market ID'}</p>
        <p>• Match: {calculatedMarketId && calculatedMarketId === EXPECTED_MARKET_ID ? '✅ YES' : '❌ NO'}</p>
        <p>• Using calculated ID in transactions: ✅ YES</p>
        
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