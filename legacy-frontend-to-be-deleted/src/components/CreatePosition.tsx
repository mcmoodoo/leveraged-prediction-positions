import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { TrendingUp, CheckCircle, Loader2, AlertCircle, Calculator } from 'lucide-react'
import { CONTRACTS, ABIS } from '../contracts/contracts'

const CreatePosition = () => {
  const { address } = useAccount()
  const [collateralAmount, setCollateralAmount] = useState('')
  const [borrowAmount, setBorrowAmount] = useState('')
  const [tokenType, setTokenType] = useState<'YES' | 'NO'>('YES')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState('approve' as 'approve' | 'position' | 'complete')

  const vaultAddress = tokenType === 'YES' 
    ? CONTRACTS.POLYGON.YES_LENDING_VAULT 
    : CONTRACTS.POLYGON.NO_LENDING_VAULT

  const wrapperAddress = tokenType === 'YES' 
    ? CONTRACTS.POLYGON.YES_TOKEN_WRAPPER 
    : CONTRACTS.POLYGON.NO_TOKEN_WRAPPER

  // Get max borrow amount
  const { data: maxBorrowAmount } = useReadContract({
    address: vaultAddress,
    abi: ABIS.VAULT,
    functionName: 'getMaxBorrowAmount',
    args: collateralAmount ? [parseUnits(collateralAmount, 18)] : undefined,
    query: { enabled: !!collateralAmount }
  })

  const { writeContract, data: hash, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleApprove = async () => {
    if (!collateralAmount || !address) return

    setIsLoading(true)
    
    try {
      await writeContract({
        address: wrapperAddress,
        abi: ABIS.WRAPPER,
        functionName: 'approve',
        args: [vaultAddress, parseUnits(collateralAmount, 18)],
      })
    } catch (error) {
      console.error('Approval failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePosition = async () => {
    if (!collateralAmount || !borrowAmount || !address) return

    setIsLoading(true)
    
    try {
      await writeContract({
        address: vaultAddress,
        abi: ABIS.VAULT,
        functionName: 'createLeveragedPosition',
        args: [
          parseUnits(collateralAmount, 18),
          parseUnits(borrowAmount, 6) // USDC has 6 decimals
        ],
      })
    } catch (error) {
      console.error('Position creation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle step progression
  useEffect(() => {
    if (isSuccess) {
      if (currentStep === 'approve') {
        setCurrentStep('position')
      } else if (currentStep === 'position') {
        setCurrentStep('complete')
      }
    }
  }, [isSuccess, currentStep])

  const calculateLTV = (): number => {
    if (!collateralAmount || !borrowAmount) return 0
    const collateral = parseFloat(collateralAmount)
    const borrow = parseFloat(borrowAmount)
    return (borrow / collateral) * 100
  }

  const isMaxBorrowExceeded = (): boolean => {
    if (!borrowAmount || !maxBorrowAmount) return false
    return parseUnits(borrowAmount, 6) > (maxBorrowAmount as bigint)
  }

  const resetForm = () => {
    setCollateralAmount('')
    setBorrowAmount('')
    setCurrentStep('approve')
    setIsLoading(false)
  }

  if (currentStep === 'complete') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Position Created Successfully!</h2>
          <p className="text-neutral-600 mb-6">
            Your leveraged position has been created. You can monitor it in the Dashboard.
          </p>
          <div className="bg-neutral-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-600">Collateral:</span>
                <p className="font-semibold text-navy-900">{collateralAmount} {tokenType} Tokens</p>
              </div>
              <div>
                <span className="text-neutral-600">Borrowed:</span>
                <p className="font-semibold text-navy-900">${borrowAmount} USDC</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={resetForm}
              className="btn-secondary"
            >
              Create Another Position
            </button>
            <button className="btn-primary">
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'approve' 
                ? 'bg-navy-600 text-white' 
                : 'bg-emerald-100 text-emerald-600'
            }`}>
              {currentStep === 'approve' ? '1' : '✓'}
            </div>
            <span className={`font-medium ${
              currentStep === 'approve' ? 'text-navy-900' : 'text-neutral-600'
            }`}>Approve Tokens</span>
          </div>
          
          <div className="flex-1 h-0.5 bg-neutral-200 mx-4">
            <div className={`h-full transition-all duration-300 ${
              currentStep !== 'approve' ? 'bg-emerald-500' : 'bg-neutral-200'
            }`} style={{ width: currentStep !== 'approve' ? '100%' : '0%' }}></div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'position' 
                ? 'bg-navy-600 text-white' 
                : (currentStep as string) === 'complete'
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-neutral-200 text-neutral-500'
            }`}>
              {(currentStep as string) === 'complete' ? '✓' : '2'}
            </div>
            <span className={`font-medium ${
              currentStep === 'position' ? 'text-navy-900' : 'text-neutral-600'
            }`}>Create Position</span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-navy-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-900">Create Leveraged Position</h2>
            <p className="text-sm text-neutral-600">
              {currentStep === 'approve' ? 'Step 1: Approve token spending' : 'Step 2: Create your leveraged position'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Token Type Selection */}
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-3">
              Position Type
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setTokenType('YES')}
                disabled={currentStep !== 'approve'}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg border transition-all duration-200 disabled:opacity-50 ${
                  tokenType === 'YES'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>YES Position</span>
                </div>
              </button>
              <button
                onClick={() => setTokenType('NO')}
                disabled={currentStep !== 'approve'}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg border transition-all duration-200 disabled:opacity-50 ${
                  tokenType === 'NO'
                    ? 'bg-burnt-orange-50 border-burnt-orange-200 text-burnt-orange-700'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-burnt-orange-500 rounded-full"></div>
                  <span>NO Position</span>
                </div>
              </button>
            </div>
          </div>

          {/* Collateral Amount */}
          <div>
            <label htmlFor="collateral" className="block text-sm font-medium text-navy-900 mb-2">
              Collateral Amount
            </label>
            <input
              type="text"
              id="collateral"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              disabled={currentStep === 'position'}
              placeholder="0.00"
              className="input-field disabled:opacity-50"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Amount of {tokenType} tokens to use as collateral
            </p>
          </div>

          {/* Borrow Amount */}
          <div>
            <label htmlFor="borrow" className="block text-sm font-medium text-navy-900 mb-2">
              Borrow Amount (USDC)
            </label>
            <div className="relative">
              <input
                type="text"
                id="borrow"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                disabled={currentStep === 'approve'}
                placeholder="0.00"
                className={`input-field disabled:opacity-50 ${
                  isMaxBorrowExceeded() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
              {maxBorrowAmount ? (
                <button
                  onClick={() => setBorrowAmount(formatUnits(maxBorrowAmount as bigint, 6))}
                  disabled={currentStep === 'approve'}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-navy-600 hover:text-navy-700 disabled:opacity-50"
                >
                  Max: {parseFloat(formatUnits(maxBorrowAmount as bigint, 6)).toFixed(2)}
                </button>
              ) : null}
            </div>
            {isMaxBorrowExceeded() && (
              <p className="text-xs text-red-600 mt-1">
                Borrow amount exceeds maximum allowed
              </p>
            )}
          </div>

          {/* Position Summary */}
          {collateralAmount && borrowAmount && (
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="w-4 h-4 text-navy-600" />
                <h4 className="font-medium text-navy-900">Position Summary</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">Loan-to-Value:</span>
                  <p className={`font-semibold ${
                    calculateLTV() > 70 ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {calculateLTV().toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="text-neutral-600">Liquidation Risk:</span>
                  <p className={`font-semibold ${
                    calculateLTV() > 70 ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {calculateLTV() > 70 ? 'High' : 'Low'}
                  </p>
                </div>
              </div>
              {calculateLTV() > 70 && (
                <div className="flex items-center space-x-2 mt-3 p-2 bg-red-50 rounded">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-xs text-red-700">
                    High LTV ratio increases liquidation risk
                  </p>
                </div>
              )}
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

          {/* Action Button */}
          <button
            onClick={currentStep === 'approve' ? handleApprove : handleCreatePosition}
            disabled={
              !collateralAmount || 
              (currentStep === 'position' && !borrowAmount) ||
              isMaxBorrowExceeded() ||
              isLoading || 
              isConfirming
            }
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isConfirming ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isConfirming ? 'Confirming...' : 'Processing...'}</span>
              </div>
            ) : currentStep === 'approve' ? (
              'Approve Tokens'
            ) : (
              'Create Position'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreatePosition