import { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { useMorphoTransactions, useTokenTransactions, useCTFBalance, useCTFAllowance, useUserPosition } from '../hooks/useMorpho'

export function BorrowForm() {
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  
  const { data: ctfBalance } = useCTFBalance(address)
  const { data: ctfAllowance } = useCTFAllowance(address)
  const { data: position } = useUserPosition(address)
  const { borrow, isPending: isBorrowPending, isConfirming: isBorrowConfirming } = useMorphoTransactions()
  const { approveMaxCTF, isPending: isApprovePending, isConfirming: isApproveConfirming } = useTokenTransactions()

  const needsApproval = ctfAllowance !== undefined && parseUnits(amount || '0', 18) > ctfAllowance
  const collateralValue = position ? position[2] : 0n // collateral amount in 18 decimals
  // Oracle price: 100000000 (8 decimals) = 1.00 USDC per CTF
  // maxBorrow = (collateral_18_decimals * oracle_price_8_decimals * lltv_77%) / (10^18 * 10^8 * 100)
  // Simplified for 1:1 price: collateral * 77% / 100% / 10^12 (convert 18->6 decimals)
  const maxBorrow = collateralValue * 77n / 100n / BigInt(10**12) // 77% LTV, convert 18->6 decimals

  const handleBorrow = () => {
    if (!amount || !address) return
    borrow(amount, address)
  }

  const handleApprove = () => {
    approveMaxCTF()
  }

  const setMaxAmount = () => {
    if (maxBorrow > 0n) {
      setAmount(formatUnits(maxBorrow, 6))
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Borrow USDC</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            />
            <button
              onClick={setMaxAmount}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-navy-600 hover:text-navy-700 font-medium"
            >
              MAX
            </button>
          </div>
          {maxBorrow > 0n && (
            <p className="text-sm text-neutral-600 mt-1">
              Max borrow: {formatUnits(maxBorrow, 6)} USDC (77% LTV)
            </p>
          )}
        </div>

        <div className="bg-neutral-50 p-3 rounded-lg">
          <p className="text-sm text-neutral-700">
            Collateral: {position ? formatUnits(position[2], 18) : '0'} wCTF
          </p>
        </div>

        {needsApproval ? (
          <button
            onClick={handleApprove}
            disabled={isApprovePending || isApproveConfirming || !amount}
            className="w-full bg-navy-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApprovePending || isApproveConfirming ? 'Approving...' : 'Approve CTF'}
          </button>
        ) : (
          <button
            onClick={handleBorrow}
            disabled={isBorrowPending || isBorrowConfirming || !amount || collateralValue === 0n}
            className="w-full bg-burnt-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-burnt-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBorrowPending || isBorrowConfirming ? 'Borrowing...' : 'Borrow USDC'}
          </button>
        )}

        {collateralValue === 0n && (
          <p className="text-sm text-amber-600">Supply collateral first to borrow</p>
        )}
      </div>
    </div>
  )
}