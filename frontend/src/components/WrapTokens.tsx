import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { Package, ArrowRight, CheckCircle, Loader2, Info } from 'lucide-react'
import { CONTRACTS, ABIS } from '../contracts/contracts'

const WrapTokens = () => {
  const { address } = useAccount()
  const [tokenId, setTokenId] = useState('')
  const [amount, setAmount] = useState('')
  const [tokenType, setTokenType] = useState<'YES' | 'NO'>('YES')
  const [isLoading, setIsLoading] = useState(false)

  const { writeContract, data: hash, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleWrap = async () => {
    if (!tokenId || !amount || !address) return

    setIsLoading(true)
    
    try {
      const wrapperAddress = tokenType === 'YES' 
        ? CONTRACTS.POLYGON.YES_TOKEN_WRAPPER 
        : CONTRACTS.POLYGON.NO_TOKEN_WRAPPER

      await writeContract({
        address: wrapperAddress,
        abi: ABIS.WRAPPER,
        functionName: 'wrap',
        args: [BigInt(tokenId), parseUnits(amount, 18)],
      })
    } catch (error) {
      console.error('Wrap failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTokenId('')
    setAmount('')
    setIsLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Tokens Wrapped Successfully!</h2>
          <p className="text-neutral-600 mb-6">
            Your Polymarket tokens have been converted to ERC20 format and are ready for leveraging.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={resetForm}
              className="btn-secondary"
            >
              Wrap More Tokens
            </button>
            <button className="btn-primary">
              Create Position
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Info Card */}
      <div className="card bg-navy-50 border-navy-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-navy-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-navy-900 mb-1">About Token Wrapping</h3>
            <p className="text-sm text-navy-700">
              Polymarket uses ERC1155 tokens, but our lending protocol requires ERC20 tokens. 
              Wrapping converts your prediction tokens to the compatible format without changing their value.
            </p>
          </div>
        </div>
      </div>

      {/* Wrap Form */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-navy-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-900">Wrap Prediction Tokens</h2>
            <p className="text-sm text-neutral-600">Convert ERC1155 tokens to ERC20 format</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Token Type Selection */}
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-3">
              Token Type
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setTokenType('YES')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  tokenType === 'YES'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>YES Token</span>
                </div>
              </button>
              <button
                onClick={() => setTokenType('NO')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  tokenType === 'NO'
                    ? 'bg-burnt-orange-50 border-burnt-orange-200 text-burnt-orange-700'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-burnt-orange-500 rounded-full"></div>
                  <span>NO Token</span>
                </div>
              </button>
            </div>
          </div>

          {/* Token ID Input */}
          <div>
            <label htmlFor="tokenId" className="block text-sm font-medium text-navy-900 mb-2">
              Token ID
            </label>
            <input
              type="text"
              id="tokenId"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter the Polymarket token ID"
              className="input-field"
            />
            <p className="text-xs text-neutral-500 mt-1">
              You can find the token ID on Polymarket or from the contract logs
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-navy-900 mb-2">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-field"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Amount of tokens to wrap (in token units)
            </p>
          </div>

          {/* Transaction Preview */}
          {tokenId && amount && (
            <div className="bg-neutral-50 rounded-lg p-4">
              <h4 className="font-medium text-navy-900 mb-3">Transaction Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">From:</span>
                  <span className="text-navy-900">ERC1155 Token #{tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">To:</span>
                  <span className="text-navy-900">ERC20 {tokenType} Token</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Amount:</span>
                  <span className="text-navy-900">{amount} Tokens</span>
                </div>
                <div className="flex justify-center py-2">
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                Transaction failed: {error.message}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleWrap}
            disabled={!tokenId || !amount || isLoading || isConfirming}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isConfirming ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isConfirming ? 'Confirming...' : 'Wrapping...'}</span>
              </div>
            ) : (
              'Wrap Tokens'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WrapTokens