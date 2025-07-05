import { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { useTokenTransactions, useRawCTFBalance, useCTFBalance, useRawCTFApproval } from '../hooks/useMorpho'
import { TOKEN_DECIMALS } from '../contracts/constants'

export function WrapForm() {
  const [amount, setAmount] = useState('')
  const [isWrapping, setIsWrapping] = useState(true)
  const { address } = useAccount()
  
  const { data: rawBalance } = useRawCTFBalance(address)
  const { data: wrappedBalance } = useCTFBalance(address)
  const { data: isApproved } = useRawCTFApproval(address)
  const { wrapCTF, unwrapCTF, approveRawCTF, isPending, isConfirming, error } = useTokenTransactions()

  const needsApproval = isWrapping && isApproved !== undefined && !isApproved
  const balance = isWrapping ? rawBalance : wrappedBalance
  const isValidAmount = amount && !isNaN(Number(amount)) && Number(amount) > 0
  const isValidInteger = !isWrapping || (Number(amount) % 1 === 0) // Raw CTF must be whole number
  const hasBalance = balance !== undefined && isValidAmount && (isWrapping 
    ? BigInt(amount) <= balance // Raw CTF has no decimals
    : parseUnits(amount, TOKEN_DECIMALS.CTF_WRAPPER) <= balance
  )

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
      setAmount(isWrapping 
        ? balance.toString() // Raw CTF has no decimals
        : formatUnits(balance, TOKEN_DECIMALS.CTF_WRAPPER)
      )
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
          <label className={`block text-sm font-medium mb-2 ${
            isWrapping && needsApproval ? 'text-neutral-400' : 'text-neutral-700'
          }`}>
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={isWrapping ? "0" : "0.00"}
              step={isWrapping ? "1" : "0.01"}
              min="0"
              disabled={isWrapping && needsApproval}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-transparent ${
                isWrapping && needsApproval 
                  ? 'border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed' 
                  : 'border-neutral-300'
              }`}
            />
            <button
              onClick={setMaxAmount}
              disabled={isWrapping && needsApproval}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${
                isWrapping && needsApproval
                  ? 'text-neutral-400 cursor-not-allowed'
                  : 'text-beige-600 hover:text-beige-700'
              }`}
            >
              MAX
            </button>
          </div>
          {isWrapping && needsApproval && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700 mb-2">
                <strong>Approval needed:</strong> Allow the wrapper contract to transfer your CTF tokens (one-time setup)
              </p>
              <button
                onClick={handleApprove}
                disabled={isPending || isConfirming}
                className="px-3 py-1 bg-amber-600 text-white text-xs rounded font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending || isConfirming ? 'Approving...' : 'Approve'}
              </button>
            </div>
          )}
          <div className="mt-2 space-y-1">
            {rawBalance && (
              <p className={`text-sm ${
                isWrapping && needsApproval ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Raw CTF: {rawBalance.toString()}
              </p>
            )}
            {wrappedBalance && (
              <p className={`text-sm ${
                isWrapping && needsApproval ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Wrapped CTF: {formatUnits(wrappedBalance, TOKEN_DECIMALS.CTF_WRAPPER)}
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
          {isWrapping && rawBalance === 0n && (
            <p className="text-xs text-amber-600 mt-1">
              <strong>No CTF tokens found.</strong> You need raw CTF tokens to wrap. Check if you have the correct tokens or mint some for testing.
            </p>
          )}
          {!isWrapping && wrappedBalance === 0n && (
            <p className="text-xs text-amber-600 mt-1">
              <strong>No wrapped CTF tokens found.</strong> You need to wrap some CTF tokens first.
            </p>
          )}
        </div>


        <button
          onClick={isWrapping ? handleWrap : handleUnwrap}
          disabled={isPending || isConfirming || !amount || !hasBalance || !isValidInteger || (isWrapping && needsApproval)}
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

        {!hasBalance && amount && isValidInteger && (
          <p className="text-sm text-red-600">
            Insufficient {isWrapping ? 'raw CTF' : 'wrapped CTF'} balance
          </p>
        )}
        
        {amount && !isValidInteger && (
          <p className="text-sm text-red-600">
            Raw CTF tokens must be whole numbers (no decimals)
          </p>
        )}
        
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Transaction failed:</strong> {error.message || 'Unknown error occurred'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}