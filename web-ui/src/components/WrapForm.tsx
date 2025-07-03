import { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { useTokenTransactions, useRawCTFBalance, useCTFBalance, useRawCTFApproval } from '../hooks/useMorpho'

export function WrapForm() {
  const [amount, setAmount] = useState('')
  const [isWrapping, setIsWrapping] = useState(true)
  const { address } = useAccount()
  
  const { data: rawBalance } = useRawCTFBalance(address)
  const { data: wrappedBalance } = useCTFBalance(address)
  const { data: isApproved } = useRawCTFApproval(address)
  const { wrapCTF, unwrapCTF, approveRawCTF, isPending, isConfirming } = useTokenTransactions()

  const needsApproval = isWrapping && isApproved !== undefined && !isApproved
  const balance = isWrapping ? rawBalance : wrappedBalance
  const hasBalance = balance !== undefined && parseUnits(amount || '0', 18) <= balance

  const handleWrap = () => {
    if (!amount) return
    wrapCTF(amount)
  }

  const handleUnwrap = () => {
    if (!amount) return
    unwrapCTF(amount)
  }

  const handleApprove = () => {
    approveRawCTF()
  }

  const setMaxAmount = () => {
    if (balance) {
      setAmount(formatUnits(balance, 18))
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
      <div className="flex mb-4">
        <button
          onClick={() => setIsWrapping(true)}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg border ${
            isWrapping 
              ? 'bg-beige-50 text-beige-800 border-beige-300' 
              : 'bg-white text-neutral-700 border-neutral-300'
          }`}
        >
          Wrap CTF
        </button>
        <button
          onClick={() => setIsWrapping(false)}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg border-t border-r border-b ${
            !isWrapping 
              ? 'bg-beige-50 text-beige-800 border-beige-300' 
              : 'bg-white text-neutral-700 border-neutral-300'
          }`}
        >
          Unwrap CTF
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
              className="w-full px-3 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-transparent"
            />
            <button
              onClick={setMaxAmount}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-beige-600 hover:text-beige-700 font-medium"
            >
              MAX
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {rawBalance && (
              <p className="text-sm text-neutral-600">
                Raw CTF: {formatUnits(rawBalance, 18)}
              </p>
            )}
            {wrappedBalance && (
              <p className="text-sm text-neutral-600">
                Wrapped CTF: {formatUnits(wrappedBalance, 18)}
              </p>
            )}
          </div>
        </div>

        <div className="bg-neutral-50 p-3 rounded-lg">
          <p className="text-xs text-neutral-600">
            {isWrapping 
              ? 'Convert raw ERC1155 CTF tokens to ERC20 wrapped tokens for use in DeFi protocols'
              : 'Convert wrapped ERC20 tokens back to original ERC1155 CTF tokens'
            }
          </p>
        </div>

        {isWrapping && needsApproval ? (
          <button
            onClick={handleApprove}
            disabled={isPending || isConfirming}
            className="w-full bg-navy-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending || isConfirming ? 'Approving...' : 'Approve CTF Tokens'}
          </button>
        ) : (
          <button
            onClick={isWrapping ? handleWrap : handleUnwrap}
            disabled={isPending || isConfirming || !amount || !hasBalance}
            className={`w-full py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
              isWrapping
                ? 'bg-beige-600 text-white hover:bg-beige-700'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {isPending || isConfirming 
              ? (isWrapping ? 'Wrapping...' : 'Unwrapping...')
              : (isWrapping ? 'Wrap CTF Tokens' : 'Unwrap CTF Tokens')
            }
          </button>
        )}

        {!hasBalance && amount && (
          <p className="text-sm text-red-600">
            Insufficient {isWrapping ? 'raw CTF' : 'wrapped CTF'} balance
          </p>
        )}
      </div>
    </div>
  )
}