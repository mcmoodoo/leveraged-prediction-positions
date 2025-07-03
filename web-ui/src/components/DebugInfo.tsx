import { useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import { useUserPosition } from '../hooks/useMorpho'

export function DebugInfo() {
  const { address } = useAccount()
  const { data: position } = useUserPosition(address)

  if (!address || !position) return null

  const collateralValue = position[2] // 18 decimals
  const borrowedValue = position[1] // 6 decimals
  const maxBorrow = collateralValue * 77n / 100n / BigInt(10**12) // Convert to 6 decimals
  const currentLTV = position[2] > 0n ? (position[1] * BigInt(10**12) * 100n) / position[2] : 0n

  return (
    <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
      <h4 className="font-medium text-yellow-800 mb-2">Debug Info</h4>
      <div className="text-sm text-yellow-700 space-y-1">
        <p>Collateral (raw): {position[2].toString()} (18 decimals)</p>
        <p>Collateral (formatted): {formatUnits(position[2], 18)} CTF</p>
        <p>Borrowed (raw): {position[1].toString()} (6 decimals)</p>
        <p>Borrowed (formatted): {formatUnits(position[1], 6)} USDC</p>
        <p>Max Borrow (calc): {formatUnits(maxBorrow, 6)} USDC</p>
        <p>Current LTV: {currentLTV.toString()}%</p>
      </div>
    </div>
  )
}