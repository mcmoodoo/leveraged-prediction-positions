import { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { useMorphoTransactions, useTokenTransactions, useUSDCBalance, useUSDCAllowance } from '../hooks/useMorpho'

export function SupplyForm() {
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  
  const { data: balance } = useUSDCBalance(address)
  const { data: allowance } = useUSDCAllowance(address)
  const { supply, isPending: isSupplyPending, isConfirming: isSupplyConfirming } = useMorphoTransactions()
  const { approveMaxUSDC, isPending: isApprovePending, isConfirming: isApproveConfirming } = useTokenTransactions()

  const needsApproval = allowance !== undefined && parseUnits(amount || '0', 6) > allowance
  const hasBalance = balance !== undefined && parseUnits(amount || '0', 6) <= balance

  const handleSupply = () => {
    if (!amount || !address) return
    supply(amount, address)
  }

  const handleApprove = () => {
    approveMaxUSDC()
  }

  const setMaxAmount = () => {
    if (balance) {
      setAmount(formatUnits(balance, 6))
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Supply USDC</h3>
      
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
          {balance && (
            <p className="text-sm text-neutral-600 mt-1">
              Balance: {formatUnits(balance, 6)} USDC
            </p>
          )}
        </div>

        {needsApproval ? (
          <button
            onClick={handleApprove}
            disabled={isApprovePending || isApproveConfirming}
            className="w-full bg-navy-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApprovePending || isApproveConfirming ? 'Approving...' : 'Approve USDC'}
          </button>
        ) : (
          <button
            onClick={handleSupply}
            disabled={isSupplyPending || isSupplyConfirming || !amount || !hasBalance}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSupplyPending || isSupplyConfirming ? 'Supplying...' : 'Supply USDC'}
          </button>
        )}

        {!hasBalance && amount && (
          <p className="text-sm text-red-600">Insufficient balance</p>
        )}
      </div>
    </div>
  )
}