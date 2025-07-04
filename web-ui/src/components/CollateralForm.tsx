import { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { useMorphoTransactions, useTokenTransactions, useCTFBalance, useCTFAllowance } from '../hooks/useMorpho'
import { TOKEN_DECIMALS } from '../contracts/constants'

export function CollateralForm() {
  const [amount, setAmount] = useState('')
  const [isSupplying, setIsSupplying] = useState(true)
  const { address } = useAccount()
  
  const { data: balance } = useCTFBalance(address)
  const { data: allowance } = useCTFAllowance(address)
  const { supplyCollateral, withdrawCollateral, isPending: isMorphoPending, isConfirming: isMorphoConfirming } = useMorphoTransactions()
  const { approveMaxCTF, isPending: isApprovePending, isConfirming: isApproveConfirming } = useTokenTransactions()

  const needsApproval = isSupplying && allowance !== undefined && parseUnits(amount || '0', TOKEN_DECIMALS.CTF_WRAPPER) > allowance
  const hasBalance = balance !== undefined && parseUnits(amount || '0', TOKEN_DECIMALS.CTF_WRAPPER) <= balance

  const handleSupplyCollateral = () => {
    if (!amount || !address) return
    supplyCollateral(amount, address)
  }

  const handleWithdrawCollateral = () => {
    if (!amount || !address) return
    withdrawCollateral(amount, address)
  }

  const handleApprove = () => {
    approveMaxCTF()
  }

  const setMaxAmount = () => {
    if (balance) {
      setAmount(formatUnits(balance, TOKEN_DECIMALS.CTF_WRAPPER))
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
      <div className="flex mb-4">
        <button
          onClick={() => setIsSupplying(true)}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg border ${
            isSupplying 
              ? 'bg-navy-50 text-navy-700 border-navy-300' 
              : 'bg-white text-neutral-700 border-neutral-300'
          }`}
        >
          Supply Collateral
        </button>
        <button
          onClick={() => setIsSupplying(false)}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg border-t border-r border-b ${
            !isSupplying 
              ? 'bg-navy-50 text-navy-700 border-navy-300' 
              : 'bg-white text-neutral-700 border-neutral-300'
          }`}
        >
          Withdraw Collateral
        </button>
      </div>

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
              Balance: {formatUnits(balance, TOKEN_DECIMALS.CTF_WRAPPER)} wCTF
            </p>
          )}
        </div>

        {isSupplying && needsApproval ? (
          <button
            onClick={handleApprove}
            disabled={isApprovePending || isApproveConfirming || !amount || !hasBalance}
            className="w-full bg-navy-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApprovePending || isApproveConfirming ? 'Approving...' : 'Approve wCTF'}
          </button>
        ) : (
          <button
            onClick={isSupplying ? handleSupplyCollateral : handleWithdrawCollateral}
            disabled={isMorphoPending || isMorphoConfirming || !amount || (isSupplying && !hasBalance)}
            className={`w-full py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
              isSupplying
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isMorphoPending || isMorphoConfirming 
              ? (isSupplying ? 'Supplying...' : 'Withdrawing...')
              : (isSupplying ? 'Supply Collateral' : 'Withdraw Collateral')
            }
          </button>
        )}

        {isSupplying && !hasBalance && amount && (
          <p className="text-sm text-red-600">Insufficient balance</p>
        )}
      </div>
    </div>
  )
}