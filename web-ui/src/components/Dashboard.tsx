import { useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import { useUserPosition, useMarketData, useUSDCBalance, useCTFBalance, useRawCTFBalance } from '../hooks/useMorpho'

export function Dashboard() {
  const { address } = useAccount()
  
  const { data: position } = useUserPosition(address)
  const { data: market } = useMarketData()
  const { data: usdcBalance } = useUSDCBalance(address)
  const { data: ctfBalance } = useCTFBalance(address)
  const { data: rawCtfBalance } = useRawCTFBalance(address)

  if (!address) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
        <p className="text-neutral-600 text-center">Connect your wallet to view dashboard</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-600 mb-2">USDC Balance</h3>
          <p className="text-2xl font-bold text-neutral-900">
            {usdcBalance ? formatUnits(usdcBalance, 6) : '0'}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Mock USDC</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-600 mb-2">Wrapped CTF</h3>
          <p className="text-2xl font-bold text-neutral-900">
            {ctfBalance ? formatUnits(ctfBalance, 18) : '0'}
          </p>
          <p className="text-xs text-neutral-500 mt-1">ERC20 CTF Tokens</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-600 mb-2">Raw CTF</h3>
          <p className="text-2xl font-bold text-neutral-900">
            {rawCtfBalance ? formatUnits(rawCtfBalance, 18) : '0'}
          </p>
          <p className="text-xs text-neutral-500 mt-1">ERC1155 CTF Tokens</p>
        </div>
      </div>

      {/* Position */}
      <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Position</h3>
        
        {position ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-neutral-600 mb-2">Supplied</h4>
              <p className="text-xl font-bold text-emerald-600">
                {formatUnits(position[0], 6)} USDC
              </p>
              <p className="text-xs text-neutral-500 mt-1">Supply Shares: {formatUnits(position[0], 6)}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-600 mb-2">Borrowed</h4>
              <p className="text-xl font-bold text-burnt-orange-600">
                {formatUnits(position[1], 6)} USDC
              </p>
              <p className="text-xs text-neutral-500 mt-1">Borrow Shares: {formatUnits(position[1], 6)}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-600 mb-2">Collateral</h4>
              <p className="text-xl font-bold text-navy-600">
                {formatUnits(position[2], 18)} wCTF
              </p>
              <p className="text-xs text-neutral-500 mt-1">Collateral Value</p>
            </div>
          </div>
        ) : (
          <p className="text-neutral-600">No position found</p>
        )}
      </div>

      {/* Market Stats */}
      <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Market Statistics</h3>
        
        {market ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h4 className="text-sm font-medium text-neutral-600 mb-2">Total Supply</h4>
              <p className="text-lg font-bold text-emerald-600">
                {formatUnits(market[0], 6)} USDC
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-600 mb-2">Total Borrowed</h4>
              <p className="text-lg font-bold text-burnt-orange-600">
                {formatUnits(market[2], 6)} USDC
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-600 mb-2">Utilization</h4>
              <p className="text-lg font-bold text-neutral-900">
                {market[0] > 0n ? ((market[2] * 100n) / market[0]).toString() : '0'}%
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-600 mb-2">Last Update</h4>
              <p className="text-lg font-bold text-neutral-900">
                {new Date(Number(market[4]) * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-neutral-600">Loading market data...</p>
        )}
      </div>

      {/* Health Factor */}
      {position && position[1] > 0n && position[2] > 0n && (
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Health Factor</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Collateral Value:</span>
              <span className="font-medium">{formatUnits(position[2], 18)} wCTF</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Borrowed Value:</span>
              <span className="font-medium">{formatUnits(position[1], 6)} USDC</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Max LTV:</span>
              <span className="font-medium">77%</span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Current LTV:</span>
                <span className={`font-bold ${
                  position[2] > 0n && (position[1] * BigInt(10**12) * 100n) / position[2] > 70n ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {position[2] > 0n ? ((position[1] * BigInt(10**12) * 100n) / position[2]).toString() : '0'}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}