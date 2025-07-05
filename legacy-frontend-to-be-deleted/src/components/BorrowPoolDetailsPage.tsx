import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface PoolDetails {
  id: string
  name: string
  description: string
  totalDeposited: string
  borrowRate: string
  totalBorrowed: string
  utilization: string
  currentPrice: string
  priceChange24h: string
  marketEndDate: string
  maxLTV: string
}

const mockPoolDetails: Record<string, PoolDetails> = {
  '1': {
    id: '1',
    name: 'Trump Win 2024',
    description: 'Presidential Election Prediction Market - Will Donald Trump win the 2024 US Presidential Election?',
    totalDeposited: '$2.4M',
    borrowRate: '8.5%',
    totalBorrowed: '$1.8M',
    utilization: '75%',
    currentPrice: '$0.52',
    priceChange24h: '+2.3%',
    marketEndDate: 'Nov 5, 2024',
    maxLTV: '60%'
  },
  '2': {
    id: '2',
    name: 'Bitcoin $100K',
    description: 'Will Bitcoin reach $100,000 by the end of 2024?',
    totalDeposited: '$1.2M',
    borrowRate: '12.3%',
    totalBorrowed: '$890K',
    utilization: '74%',
    currentPrice: '$0.34',
    priceChange24h: '-1.8%',
    marketEndDate: 'Dec 31, 2024',
    maxLTV: '50%'
  }
}

function BorrowPoolDetailsPage() {
  const { poolId } = useParams<{ poolId: string }>()
  const navigate = useNavigate()
  const [collateralAmount, setCollateralAmount] = useState('')
  const [borrowAmount, setBorrowAmount] = useState('')
  const [selectedCollateralToken, setSelectedCollateralToken] = useState('USDC')
  
  const pool = poolId ? mockPoolDetails[poolId] : null

  if (!pool) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-navy-900 mb-4">Pool Not Found</h2>
        <button
          onClick={() => navigate('/borrow')}
          className="btn-primary"
        >
          Back to Pools
        </button>
      </div>
    )
  }

  const handleWrapAndDeposit = () => {
    alert('Wrap and deposit functionality would be implemented here')
  }

  const handleBorrow = () => {
    alert('Borrow functionality would be implemented here')
  }

  const calculateLTV = () => {
    if (!collateralAmount || !borrowAmount) return '0'
    const ltv = (parseFloat(borrowAmount) / parseFloat(collateralAmount)) * 100
    return ltv.toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/borrow')}
        className="flex items-center text-navy-600 hover:text-navy-800 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Pools
      </button>

      {/* Pool Header */}
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 mb-2">{pool.name}</h1>
            <p className="text-neutral-600 mb-4">{pool.description}</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-navy-900">{pool.currentPrice}</div>
            <div className={`text-sm ${pool.priceChange24h.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {pool.priceChange24h} (24h)
            </div>
          </div>
        </div>

        {/* Pool Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-50 p-4 rounded-lg">
            <div className="text-sm text-neutral-500 mb-1">Total Deposited</div>
            <div className="text-lg font-semibold text-navy-900">{pool.totalDeposited}</div>
          </div>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <div className="text-sm text-neutral-500 mb-1">Borrow Rate</div>
            <div className="text-lg font-semibold text-navy-900">{pool.borrowRate}</div>
          </div>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <div className="text-sm text-neutral-500 mb-1">Max LTV</div>
            <div className="text-lg font-semibold text-navy-900">{pool.maxLTV}</div>
          </div>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <div className="text-sm text-neutral-500 mb-1">Market Ends</div>
            <div className="text-lg font-semibold text-navy-900">{pool.marketEndDate}</div>
          </div>
        </div>
      </div>

      {/* Deposit and Borrow Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Collateral */}
        <div className="card">
          <h3 className="text-xl font-bold text-navy-900 mb-4">1. Deposit Collateral</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Collateral Token
              </label>
              <select
                value={selectedCollateralToken}
                onChange={(e) => setSelectedCollateralToken(e.target.value)}
                className="w-full p-3 border border-neutral-300 rounded-md focus:ring-navy-500 focus:border-navy-500"
              >
                <option value="USDC">USDC</option>
                <option value="ETH">ETH</option>
                <option value="WBTC">WBTC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Amount to Deposit
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 border border-neutral-300 rounded-md focus:ring-navy-500 focus:border-navy-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-navy-600 text-sm font-medium hover:text-navy-800">
                  MAX
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              {['25%', '50%', '75%', 'MAX'].map((percentage) => (
                <button
                  key={percentage}
                  className="flex-1 py-2 px-3 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
                  onClick={() => {
                    // Mock implementation - would calculate based on actual balance
                    const mockBalance = 1000
                    const percent = percentage === 'MAX' ? 100 : parseInt(percentage)
                    setCollateralAmount(((mockBalance * percent) / 100).toString())
                  }}
                >
                  {percentage}
                </button>
              ))}
            </div>

            <button
              onClick={handleWrapAndDeposit}
              disabled={!collateralAmount}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Wrap & Deposit {selectedCollateralToken}
            </button>
          </div>
        </div>

        {/* Borrow Tokens */}
        <div className="card">
          <h3 className="text-xl font-bold text-navy-900 mb-4">2. Borrow Position Tokens</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Amount to Borrow
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 border border-neutral-300 rounded-md focus:ring-navy-500 focus:border-navy-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 text-sm">
                  {selectedCollateralToken}
                </span>
              </div>
            </div>

            {/* LTV Display */}
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neutral-600">Current LTV</span>
                <span className="text-sm font-semibold text-navy-900">{calculateLTV()}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    parseFloat(calculateLTV()) > 60 ? 'bg-red-500' : 
                    parseFloat(calculateLTV()) > 40 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(parseFloat(calculateLTV()), 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>Safe</span>
                <span>Max {pool.maxLTV}</span>
              </div>
            </div>

            {/* Liquidation Warning */}
            {parseFloat(calculateLTV()) > 50 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      High LTV ratio. Your position may be at risk of liquidation if the collateral value decreases.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleBorrow}
              disabled={!borrowAmount || !collateralAmount || parseFloat(calculateLTV()) > 60}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Borrow Against {pool.name}
            </button>
          </div>
        </div>
      </div>

      {/* Risk Information */}
      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-3">Important Risk Information</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Your collateral may be liquidated if the LTV exceeds the maximum threshold</p>
          <p>• Prediction market tokens can be highly volatile and may lose value rapidly</p>
          <p>• Interest accrues on borrowed amounts and must be repaid</p>
          <p>• Market resolution may affect your position value significantly</p>
        </div>
      </div>
    </div>
  )
}

export default BorrowPoolDetailsPage