import { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { useMorphoTransactions, useTokenTransactions, useCTFBalance, useCTFAllowance, useUserPosition, useUSDCBalance } from '../hooks/useMorpho'
import { DebugInfo } from '../components/DebugInfo'
import { MarketValidation } from '../components/MarketValidation'

export function BorrowPage() {
  const [collateralAmount, setCollateralAmount] = useState('')
  const [withdrawCollateralAmount, setWithdrawCollateralAmount] = useState('')
  const [borrowAmount, setBorrowAmount] = useState('')
  const [repayAmount, setRepayAmount] = useState('')
  const { address } = useAccount()
  
  const { data: ctfBalance } = useCTFBalance(address)
  const { data: usdcBalance } = useUSDCBalance(address)
  const { data: ctfAllowance } = useCTFAllowance(address)
  const { data: position } = useUserPosition(address)
  const { supplyCollateral, withdrawCollateral, borrow, repay, isPending: isMorphoPending, isConfirming: isMorphoConfirming } = useMorphoTransactions()
  const { approveMaxCTF, isPending: isApprovePending, isConfirming: isApproveConfirming } = useTokenTransactions()

  const collateralNeedsApproval = ctfAllowance !== undefined && parseUnits(collateralAmount || '0', 18) > ctfAllowance
  const hasCollateralBalance = ctfBalance !== undefined && parseUnits(collateralAmount || '0', 18) <= ctfBalance
  const hasRepayBalance = usdcBalance !== undefined && parseUnits(repayAmount || '0', 6) <= usdcBalance

  // Calculate max borrow based on collateral (77% LTV)
  const collateralValue = position ? position[2] : 0n // CTF collateral in 18 decimals
  // Convert collateral to USDC terms (6 decimals) assuming 1:1 price, then apply 77% LTV
  const maxBorrow = collateralValue * 77n / 100n / BigInt(10**12) // Convert 18->6 decimals
  const currentBorrow = position ? position[1] : 0n // Already in 6 decimals
  const availableToBorrow = maxBorrow > currentBorrow ? maxBorrow - currentBorrow : 0n

  // Calculate max withdrawable collateral (must maintain LTV ≤ 77%)
  const minRequiredCollateral = currentBorrow > 0n ? (currentBorrow * BigInt(10**12) * 100n) / 77n : 0n // Convert to 18 decimals
  const maxWithdrawableCollateral = collateralValue > minRequiredCollateral ? collateralValue - minRequiredCollateral : 0n

  const handleSupplyCollateral = () => {
    if (!collateralAmount || !address) return
    supplyCollateral(collateralAmount, address)
  }

  const handleBorrow = () => {
    if (!borrowAmount || !address) return
    borrow(borrowAmount, address)
  }

  const handleRepay = () => {
    if (!repayAmount || !address) return
    repay(repayAmount, address)
  }

  const handleApproveCollateral = () => {
    approveMaxCTF()
  }

  const handleWithdrawCollateral = () => {
    if (!withdrawCollateralAmount || !address) return
    withdrawCollateral(withdrawCollateralAmount, address)
  }


  if (!address) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-soft border border-neutral-200 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Connect Wallet</h2>
          <p className="text-neutral-600">Please connect your wallet to start borrowing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Borrow USDC</h1>
        <p className="text-neutral-600">Supply CTF tokens as collateral to borrow USDC</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Supply Collateral */}
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">Supply Collateral</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                CTF Amount
              </label>
              <input
                type="number"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-4 border border-neutral-300 rounded-lg text-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
              {ctfBalance && (
                <p className="text-sm text-neutral-600 mt-2">
                  Available: {formatUnits(ctfBalance, 18)} wCTF
                </p>
              )}
            </div>

            <div className="bg-navy-50 p-4 rounded-lg">
              <h4 className="font-medium text-navy-800 mb-2">Collateral Info</h4>
              <ul className="text-sm text-navy-700 space-y-1">
                <li>• Max LTV: 77%</li>
                <li>• 1 wCTF ≈ 1 USDC value</li>
                <li>• Risk of liquidation if LTV {'>'} 77%</li>
              </ul>
            </div>

            {collateralNeedsApproval ? (
              <button
                onClick={handleApproveCollateral}
                disabled={isApprovePending || isApproveConfirming || !collateralAmount || !hasCollateralBalance}
                className="w-full bg-navy-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isApprovePending || isApproveConfirming ? 'Approving...' : 'Approve wCTF'}
              </button>
            ) : (
              <button
                onClick={handleSupplyCollateral}
                disabled={isMorphoPending || isMorphoConfirming || !collateralAmount || !hasCollateralBalance}
                className="w-full bg-navy-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isMorphoPending || isMorphoConfirming ? 'Supplying...' : 'Supply Collateral'}
              </button>
            )}
          </div>
        </div>

        {/* Withdraw Collateral */}
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">Withdraw Collateral</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                CTF Amount to Withdraw
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={withdrawCollateralAmount}
                  onChange={(e) => setWithdrawCollateralAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-4 border border-neutral-300 rounded-lg text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={() => setWithdrawCollateralAmount(formatUnits(maxWithdrawableCollateral, 18))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  MAX
                </button>
              </div>
              {position && (
                <p className="text-sm text-neutral-600 mt-2">
                  Available to withdraw: {formatUnits(maxWithdrawableCollateral, 18)} wCTF
                </p>
              )}
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Withdrawal Info</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Can only withdraw excess collateral</li>
                <li>• Must maintain LTV ≤ 77%</li>
                <li>• Reduces your borrowing power</li>
              </ul>
            </div>

            <button
              onClick={handleWithdrawCollateral}
              disabled={isMorphoPending || isMorphoConfirming || !withdrawCollateralAmount || collateralValue === 0n || parseUnits(withdrawCollateralAmount || '0', 18) > maxWithdrawableCollateral}
              className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isMorphoPending || isMorphoConfirming ? 'Withdrawing...' : 'Withdraw Collateral'}
            </button>

            {collateralValue === 0n && (
              <p className="text-sm text-amber-600">No collateral to withdraw</p>
            )}
          </div>
        </div>

        {/* Borrow */}
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">Borrow USDC</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                USDC Amount
              </label>
              <input
                type="number"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-4 border border-neutral-300 rounded-lg text-lg focus:ring-2 focus:ring-burnt-orange-500 focus:border-transparent"
              />
              <p className="text-sm text-neutral-600 mt-2">
                Available to borrow: {formatUnits(availableToBorrow, 6)} USDC
              </p>
            </div>

            <div className="bg-burnt-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-burnt-orange-800 mb-2">Borrowing Terms</h4>
              <ul className="text-sm text-burnt-orange-700 space-y-1">
                <li>• Variable interest rate</li>
                <li>• No fixed repayment term</li>
                <li>• Repay anytime</li>
              </ul>
            </div>

            <button
              onClick={handleBorrow}
              disabled={isMorphoPending || isMorphoConfirming || !borrowAmount || collateralValue === 0n || parseUnits(borrowAmount || '0', 6) > availableToBorrow}
              className="w-full bg-burnt-orange-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-burnt-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isMorphoPending || isMorphoConfirming ? 'Borrowing...' : 'Borrow USDC'}
            </button>

            {collateralValue === 0n && (
              <p className="text-sm text-amber-600">Supply collateral first</p>
            )}
          </div>
        </div>

        {/* Repay */}
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">Repay USDC</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Repay Amount
              </label>
              <input
                type="number"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-4 border border-neutral-300 rounded-lg text-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              {position && (
                <p className="text-sm text-neutral-600 mt-2">
                  Borrowed: {formatUnits(position[1], 6)} USDC
                </p>
              )}
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg">
              <h4 className="font-medium text-emerald-800 mb-2">Repayment Benefits</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Reduce liquidation risk</li>
                <li>• Free up collateral</li>
                <li>• Lower interest payments</li>
              </ul>
            </div>

            <button
              onClick={handleRepay}
              disabled={isMorphoPending || isMorphoConfirming || !repayAmount || !hasRepayBalance || currentBorrow === 0n}
              className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isMorphoPending || isMorphoConfirming ? 'Repaying...' : 'Repay USDC'}
            </button>

            {currentBorrow === 0n && (
              <p className="text-sm text-neutral-600">No outstanding debt</p>
            )}
          </div>
        </div>
      </div>

      {/* Position Summary */}
      {position && (position[1] > 0n || position[2] > 0n) && (
        <div className="mt-8 bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">Your Borrowing Position</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-1">Collateral</p>
              <p className="text-2xl font-bold text-navy-600">
                {formatUnits(position[2], 18)} wCTF
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-1">Borrowed</p>
              <p className="text-2xl font-bold text-burnt-orange-600">
                {formatUnits(position[1], 6)} USDC
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-1">Current LTV</p>
              <p className={`text-2xl font-bold ${
                position[2] > 0n && (position[1] * BigInt(10**12) * 100n) / position[2] > 70n 
                  ? 'text-red-600' 
                  : 'text-emerald-600'
              }`}>
                {position[2] > 0n ? ((position[1] * BigInt(10**12) * 100n) / position[2]).toString() : '0'}%
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-1">Available to Borrow</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatUnits(availableToBorrow, 6)} USDC
              </p>
            </div>
          </div>

          {position[2] > 0n && (position[1] * BigInt(10**12) * 100n) / position[2] > 70n && (
            <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-800 font-medium">⚠️ High Risk Position</p>
              <p className="text-red-700 text-sm mt-1">
                Your LTV is above 70%. Consider repaying debt or adding collateral to reduce liquidation risk.
              </p>
            </div>
          )}
        </div>
      )}

      <DebugInfo />
      <MarketValidation />
    </div>
  )
}
