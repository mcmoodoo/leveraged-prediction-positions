import { useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import { useUserPosition } from '../hooks/useMorpho'

export function DebugInfo() {
  const { address } = useAccount()
  const { data: position } = useUserPosition(address)

  if (!address || !position) return null

  const collateralValue = position[2] // CTF collateral in 18 decimals
  const borrowedValue = position[1] // USDC borrowed in 6 decimals
  const supplyShares = position[0] // USDC supply shares in 6 decimals
  
  // Oracle: 100000000 (8 decimals) = 1.00 USDC per CTF
  // Max borrow = collateral * oracle_price * lltv / (10^18 * 10^8) * 10^6
  // Simplified for 1:1 price: collateral * 77% / 100% / 10^12
  const maxBorrow = collateralValue * 77n / 100n / BigInt(10**12) // Convert 18->6 decimals
  const availableToBorrow = maxBorrow > borrowedValue ? maxBorrow - borrowedValue : 0n
  const currentLTV = collateralValue > 0n ? (borrowedValue * BigInt(10**12) * 100n) / collateralValue : 0n

  return (
    <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
      <h4 className="font-medium text-yellow-800 mb-2">🔍 Debug Info - Decimal Analysis</h4>
      <div className="text-sm text-yellow-700 space-y-1">
        <p><strong>Position Data:</strong></p>
        <p>• Supply Shares: {position[0].toString()} raw ({formatUnits(position[0], 6)} USDC)</p>
        <p>• Borrow Shares: {position[1].toString()} raw ({formatUnits(position[1], 6)} USDC)</p>
        <p>• Collateral: {position[2].toString()} raw ({formatUnits(position[2], 18)} CTF)</p>
        
        <p><strong>Calculations:</strong></p>
        <p>• Max Borrow: {maxBorrow.toString()} raw ({formatUnits(maxBorrow, 6)} USDC)</p>
        <p>• Available to Borrow: {availableToBorrow.toString()} raw ({formatUnits(availableToBorrow, 6)} USDC)</p>
        <p>• Current LTV: {currentLTV.toString()}%</p>
        
        <p><strong>Decimal Info:</strong></p>
        <p>• CTF: 18 decimals | USDC: 6 decimals | Oracle: 8 decimals</p>
        <p>• Oracle Price: 100000000 (8 dec) = 1.00 CTF/USDC</p>
      </div>
    </div>
  )
}