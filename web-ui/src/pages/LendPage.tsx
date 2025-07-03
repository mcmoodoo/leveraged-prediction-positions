import { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { useMorphoTransactions, useTokenTransactions, useUSDCBalance, useUSDCAllowance, useUserPosition } from '../hooks/useMorpho'

export function LendPage() {
  const [supplyAmount, setSupplyAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const { address } = useAccount()
  
  const { data: balance } = useUSDCBalance(address)
  const { data: allowance } = useUSDCAllowance(address)
  const { data: position } = useUserPosition(address)
  const { supply, withdraw, isPending: isMorphoPending, isConfirming: isMorphoConfirming } = useMorphoTransactions()
  const { approveMaxUSDC, isPending: isApprovePending, isConfirming: isApproveConfirming } = useTokenTransactions()

  const supplyNeedsApproval = allowance !== undefined && parseUnits(supplyAmount || '0', 6) > allowance
  const hasSupplyBalance = balance !== undefined && parseUnits(supplyAmount || '0', 6) <= balance
  const hasWithdrawBalance = position !== undefined && parseUnits(withdrawAmount || '0', 6) <= position[0]

  const handleSupply = () => {
    if (!supplyAmount || !address) return
    supply(supplyAmount, address)
  }

  const handleWithdraw = () => {
    if (!withdrawAmount || !address) return
    withdraw(withdrawAmount, address)
  }

  const handleApprove = () => {
    approveMaxUSDC()
  }

  const setMaxSupply = () => {
    if (balance) {
      setSupplyAmount(formatUnits(balance, 6))
    }
  }

  const setMaxWithdraw = () => {
    if (position && position[0] > 0n) {
      setWithdrawAmount(formatUnits(position[0], 6))
    }
  }

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-soft border border-neutral-200 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Connect Wallet</h2>
          <p className="text-neutral-600">Please connect your wallet to start lending USDC</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Lend USDC</h1>
        <p className="text-neutral-600">Supply USDC to earn interest from borrowers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Supply Form */}
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">Supply USDC</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Amount to Supply
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={supplyAmount}
                  onChange={(e) => setSupplyAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-4 border border-neutral-300 rounded-lg text-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  onClick={setMaxSupply}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  MAX
                </button>
              </div>
              {balance && (
                <p className="text-sm text-neutral-600 mt-2">
                  Available: {formatUnits(balance, 6)} USDC
                </p>
              )}
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg">
              <h4 className="font-medium text-emerald-800 mb-2">Benefits of Supplying</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Earn interest from borrowers</li>
                <li>• Liquidity can be withdrawn anytime</li>
                <li>• No impermanent loss risk</li>
              </ul>
            </div>

            {supplyNeedsApproval ? (
              <button
                onClick={handleApprove}
                disabled={isApprovePending || isApproveConfirming || !supplyAmount || !hasSupplyBalance}
                className="w-full bg-navy-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isApprovePending || isApproveConfirming ? 'Approving...' : 'Approve USDC'}
              </button>
            ) : (
              <button
                onClick={handleSupply}
                disabled={isMorphoPending || isMorphoConfirming || !supplyAmount || !hasSupplyBalance}
                className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isMorphoPending || isMorphoConfirming ? 'Supplying...' : 'Supply USDC'}
              </button>
            )}

            {!hasSupplyBalance && supplyAmount && (
              <p className="text-sm text-red-600">Insufficient USDC balance</p>
            )}
          </div>
        </div>

        {/* Withdraw Form */}
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">Withdraw USDC</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Amount to Withdraw
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-4 border border-neutral-300 rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  onClick={setMaxWithdraw}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  MAX
                </button>
              </div>
              {position && (
                <p className="text-sm text-neutral-600 mt-2">
                  Supplied: {formatUnits(position[0], 6)} USDC
                </p>
              )}
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-2">Withdrawal Info</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Withdraw your supplied USDC + interest</li>
                <li>• Available immediately</li>
                <li>• No withdrawal fees</li>
              </ul>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={isMorphoPending || isMorphoConfirming || !withdrawAmount || !hasWithdrawBalance}
              className="w-full bg-red-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isMorphoPending || isMorphoConfirming ? 'Withdrawing...' : 'Withdraw USDC'}
            </button>

            {!hasWithdrawBalance && withdrawAmount && (
              <p className="text-sm text-red-600">Insufficient supplied balance</p>
            )}
          </div>
        </div>
      </div>

      {/* Current Position */}
      {position && position[0] > 0n && (
        <div className="mt-8 bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">Your Lending Position</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-1">Total Supplied</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatUnits(position[0], 6)} USDC
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-1">Supply Shares</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatUnits(position[0], 6)}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-1">Est. APY</p>
              <p className="text-2xl font-bold text-emerald-600">
                5.2%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}