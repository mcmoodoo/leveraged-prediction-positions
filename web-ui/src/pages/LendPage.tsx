import { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { useMorphoTransactions, useTokenTransactions, useUSDCBalance, useUSDCAllowance, useUserPosition } from '../hooks/useMorpho'
import { MarketValidation } from '../components/MarketValidation'
import { CONTRACT_ADDRESSES, MARKET_PARAMS, CALCULATED_MARKET_ID, TOKEN_DECIMALS } from '../contracts/constants'

export function LendPage() {
  const [supplyAmount, setSupplyAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const { address } = useAccount()
  
  const { data: balance } = useUSDCBalance(address)
  const { data: allowance } = useUSDCAllowance(address)
  const { data: position } = useUserPosition(address)
  const { supply, withdraw, isPending: isMorphoPending, isConfirming: isMorphoConfirming } = useMorphoTransactions()
  const { approveMaxUSDC, isPending: isApprovePending, isConfirming: isApproveConfirming } = useTokenTransactions()

  // Use market params and calculated ID from constants

  const supplyAmountInWei = supplyAmount ? parseUnits(supplyAmount, TOKEN_DECIMALS.USDC) : 0n

  const supplyNeedsApproval = allowance !== undefined && parseUnits(supplyAmount || '0', 6) > allowance
  const hasSupplyBalance = balance !== undefined && parseUnits(supplyAmount || '0', 6) <= balance
  const hasWithdrawBalance = position !== undefined && parseUnits(withdrawAmount || '0', 6) <= position[0]

  const handleSupply = () => {
    console.log('handleSupply called', { supplyAmount, address, hasSupplyBalance, supplyNeedsApproval })
    if (!supplyAmount || !address) {
      console.log('handleSupply early return', { supplyAmount, address })
      return
    }
    console.log('Calling supply function with:', { supplyAmount, address })
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

            {/* Debug Information */}
            {supplyAmount && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">🔧 Debug: Supply Transaction Details</h4>
                <div className="text-xs text-gray-700 space-y-1 font-mono">
                  <p><strong>Contract:</strong> {CONTRACT_ADDRESSES.morphoBlueAddress}</p>
                  <p><strong>Function:</strong> supply</p>
                  <p><strong>Amount (input):</strong> {supplyAmount} USDC</p>
                  <p><strong>Amount (wei):</strong> {supplyAmountInWei.toString()}</p>
                  <p><strong>Parameters:</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• _marketParams:</p>
                    <div className="ml-6 space-y-1">
                      <p>  - loanToken: {MARKET_PARAMS.loanToken}</p>
                      <p>  - collateralToken: {MARKET_PARAMS.collateralToken}</p>
                      <p>  - oracle: {MARKET_PARAMS.oracle}</p>
                      <p>  - irm: {MARKET_PARAMS.irm}</p>
                      <p>  - lltv: {MARKET_PARAMS.lltv.toString()}</p>
                    </div>
                    <p>• _assets: {supplyAmountInWei.toString()}</p>
                    <p>• _shares: 0</p>
                    <p>• _onBehalf: {address}</p>
                    <p>• _data: toHex('') (empty bytes)</p>
                  </div>
                  <p><strong>Market ID:</strong> {CALCULATED_MARKET_ID}</p>
                  <p><strong>Button State Debug:</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• supplyNeedsApproval: {supplyNeedsApproval ? 'true' : 'false'}</p>
                    <p>• isMorphoPending: {isMorphoPending ? 'true' : 'false'}</p>
                    <p>• isMorphoConfirming: {isMorphoConfirming ? 'true' : 'false'}</p>
                    <p>• hasSupplyAmount: {supplyAmount ? 'true' : 'false'}</p>
                    <p>• hasSupplyBalance: {hasSupplyBalance ? 'true' : 'false'}</p>
                    <p>• allowance: {allowance?.toString() || 'undefined'}</p>
                    <p>• balance: {balance?.toString() || 'undefined'}</p>
                    <p>• buttonDisabled: {(isMorphoPending || isMorphoConfirming || !supplyAmount || !hasSupplyBalance) ? 'true' : 'false'}</p>
                  </div>
                </div>
              </div>
            )}

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
                onClick={(e) => {
                  console.log('Supply button clicked', { 
                    disabled: e.currentTarget.disabled,
                    supplyAmount,
                    hasSupplyBalance,
                    isMorphoPending,
                    isMorphoConfirming 
                  })
                  handleSupply()
                }}
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
                  Supplied: {formatUnits(position[0], 12)} USDC
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
                {formatUnits(position[0], 12)} USDC
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-1">Supply Shares</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatUnits(position[0], 12)}
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

      <MarketValidation />
    </div>
  )
}
