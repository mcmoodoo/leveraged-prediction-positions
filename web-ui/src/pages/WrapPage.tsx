import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useTokenTransactions, useRawCTFBalance, useCTFBalance, useRawCTFApproval } from '../hooks/useMorpho'
import { TOKEN_IDS } from '../contracts/constants'

export function WrapPage() {
  const [amount, setAmount] = useState('')
  const [isWrapping, setIsWrapping] = useState(true)
  const { address } = useAccount()
  
  const { data: rawBalance } = useRawCTFBalance(address)
  const { data: wrappedBalance } = useCTFBalance(address)
  const { data: isApproved } = useRawCTFApproval(address)
  const { wrapCTF, unwrapCTF, approveRawCTF, isPending, isConfirming } = useTokenTransactions()

  const needsApproval = isWrapping && isApproved !== undefined && !isApproved
  const balance = isWrapping ? rawBalance : wrappedBalance
  const hasBalance = balance !== undefined && balance !== null && typeof balance === 'bigint' && balance > 0n && BigInt(amount || '0') <= balance

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
    if (balance && typeof balance === 'bigint') {
      setAmount(balance.toString())
    }
  }

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-soft border border-neutral-200 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Connect Wallet</h2>
          <p className="text-neutral-600">Please connect your wallet to wrap/unwrap CTF tokens</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Wrap/Unwrap CTF Tokens</h1>
        <p className="text-neutral-600">Convert between ERC1155 and ERC20 CTF tokens for DeFi compatibility</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Wrap/Unwrap Interface */}
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
          <div className="flex mb-6">
            <button
              onClick={() => setIsWrapping(true)}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-l-lg border transition-colors ${
                isWrapping 
                  ? 'bg-beige-100 text-beige-800 border-beige-300' 
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              Wrap CTF
            </button>
            <button
              onClick={() => setIsWrapping(false)}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-r-lg border-t border-r border-b transition-colors ${
                !isWrapping 
                  ? 'bg-beige-100 text-beige-800 border-beige-300' 
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              Unwrap CTF
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  step="1"
                  className="w-full px-4 py-4 border border-neutral-300 rounded-lg text-lg focus:ring-2 focus:ring-beige-500 focus:border-transparent"
                />
                <button
                  onClick={setMaxAmount}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-beige-600 hover:text-beige-700 font-medium"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="bg-neutral-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">From:</span>
                <span className="text-sm font-medium">
                  {isWrapping ? 'ERC1155 CTF' : 'ERC20 wCTF'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">To:</span>
                <span className="text-sm font-medium">
                  {isWrapping ? 'ERC20 wCTF' : 'ERC1155 CTF'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Rate:</span>
                <span className="text-sm font-medium">1:1</span>
              </div>
            </div>

            {isWrapping && needsApproval ? (
              <button
                onClick={handleApprove}
                disabled={isPending || isConfirming}
                className="w-full bg-navy-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending || isConfirming ? 'Approving...' : 'Approve CTF Tokens'}
              </button>
            ) : (
              <button
                onClick={isWrapping ? handleWrap : handleUnwrap}
                disabled={isPending || isConfirming || !amount || !hasBalance}
                className={`w-full py-4 px-6 rounded-lg text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
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

        {/* Info Panel */}
        <div className="space-y-6">
          {/* Balances */}
          <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Balances</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900">Raw CTF (ERC1155)</p>
                  <p className="text-xs text-neutral-600">Original prediction tokens</p>
                </div>
                <p className="text-lg font-bold text-neutral-900">
                  {rawBalance && typeof rawBalance === 'bigint' ? rawBalance.toString() : '0'}
                </p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900">Wrapped CTF (ERC20)</p>
                  <p className="text-xs text-neutral-600">DeFi-compatible tokens</p>
                </div>
                <p className="text-lg font-bold text-neutral-900">
                  {wrappedBalance && typeof wrappedBalance === 'bigint' ? wrappedBalance.toString() : '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Token Info */}
          <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Token Information</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-neutral-700">Token ID:</p>
                <p className="text-xs text-neutral-600 break-all font-mono">
                  {TOKEN_IDS.RECESSION_NO}
                </p>
              </div>
              
              <div>
                <p className="font-medium text-neutral-700">Conversion Rate:</p>
                <p className="text-neutral-600">1 Raw CTF = 1 Wrapped CTF</p>
              </div>
              
              <div>
                <p className="font-medium text-neutral-700">Gas Cost:</p>
                <p className="text-neutral-600">~50,000 gas per transaction</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-beige-50 rounded-xl p-6 border border-beige-200">
            <h3 className="text-lg font-semibold text-beige-900 mb-4">How it Works</h3>
            
            <div className="space-y-3 text-sm text-beige-800">
              <div className="flex items-start space-x-2">
                <span className="font-bold">1.</span>
                <p>Raw CTF tokens are ERC1155 tokens from Polymarket</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="font-bold">2.</span>
                <p>Wrapped CTF tokens are ERC20 compatible for DeFi protocols</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="font-bold">3.</span>
                <p>You need wrapped tokens to use as collateral in Morpho</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="font-bold">4.</span>
                <p>Unwrap back to original tokens to trade on Polymarket</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}