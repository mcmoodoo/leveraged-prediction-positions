import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { AlertTriangle, TrendingUp, Wallet, Activity } from 'lucide-react'
import { CONTRACTS, ABIS } from '../contracts/contracts'
import { formatUnits } from 'viem'

interface PositionData {
  collateralValue: bigint
  borrowValue: bigint
  isLiquidatable: boolean
}

const Dashboard = () => {
  const { address } = useAccount()
  const [positions, setPositions] = useState<PositionData[]>([])

  // Read YES vault position
  const { data: yesPosition } = useReadContract({
    address: CONTRACTS.POLYGON.YES_LENDING_VAULT,
    abi: ABIS.VAULT,
    functionName: 'getPositionValues',
    args: [address],
    query: { enabled: !!address }
  })

  // Read NO vault position  
  const { data: noPosition } = useReadContract({
    address: CONTRACTS.POLYGON.NO_LENDING_VAULT,
    abi: ABIS.VAULT,
    functionName: 'getPositionValues',
    args: [address],
    query: { enabled: !!address }
  })

  // Check if YES position is liquidatable
  const { data: yesLiquidatable } = useReadContract({
    address: CONTRACTS.POLYGON.YES_LENDING_VAULT,
    abi: ABIS.VAULT,
    functionName: 'isLiquidatable',
    args: [address],
    query: { enabled: !!address }
  })

  // Check if NO position is liquidatable
  const { data: noLiquidatable } = useReadContract({
    address: CONTRACTS.POLYGON.NO_LENDING_VAULT,
    abi: ABIS.VAULT,
    functionName: 'isLiquidatable',
    args: [address],
    query: { enabled: !!address }
  })

  useEffect(() => {
    const positionData: PositionData[] = []
    
    if (yesPosition && Array.isArray(yesPosition)) {
      positionData.push({
        collateralValue: yesPosition[0] as bigint,
        borrowValue: yesPosition[1] as bigint,
        isLiquidatable: yesLiquidatable as boolean || false
      })
    }
    
    if (noPosition && Array.isArray(noPosition)) {
      positionData.push({
        collateralValue: noPosition[0] as bigint,
        borrowValue: noPosition[1] as bigint,
        isLiquidatable: noLiquidatable as boolean || false
      })
    }
    
    setPositions(positionData)
  }, [yesPosition, noPosition, yesLiquidatable, noLiquidatable])

  const hasPositions = positions.length > 0 && positions.some(p => p.collateralValue > 0n)
  const hasLiquidatablePositions = positions.some(p => p.isLiquidatable)

  const calculateLTV = (collateral: bigint, borrow: bigint): number => {
    if (collateral === 0n) return 0
    return Number((borrow * 10000n) / collateral) / 100
  }

  const formatValue = (value: bigint): string => {
    return parseFloat(formatUnits(value, 6)).toFixed(2)
  }

  return (
    <div className="space-y-8">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-navy-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Active Positions</p>
              <p className="text-2xl font-bold text-navy-900">
                {positions.filter(p => p.collateralValue > 0n).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Collateral</p>
              <p className="text-2xl font-bold text-navy-900">
                ${positions.reduce((sum, p) => sum + parseFloat(formatValue(p.collateralValue)), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              hasLiquidatablePositions ? 'bg-red-100' : 'bg-emerald-100'
            }`}>
              <Activity className={`w-5 h-5 ${
                hasLiquidatablePositions ? 'text-red-600' : 'text-emerald-600'
              }`} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Health Status</p>
              <p className={`text-2xl font-bold ${
                hasLiquidatablePositions ? 'text-red-600' : 'text-emerald-600'
              }`}>
                {hasLiquidatablePositions ? 'At Risk' : 'Healthy'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-navy-900">Your Positions</h2>
          {hasLiquidatablePositions && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">Liquidation Risk</span>
            </div>
          )}
        </div>

        {!hasPositions ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No Positions Yet</h3>
            <p className="text-neutral-600 mb-6">
              You haven't created any leveraged positions. Start by wrapping your Polymarket tokens.
            </p>
            <button className="btn-primary">
              Get Started
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Token</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Collateral</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Borrowed</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">LTV</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position, index) => {
                  const tokenType = index === 0 ? 'YES' : 'NO'
                  const ltv = calculateLTV(position.collateralValue, position.borrowValue)
                  
                  if (position.collateralValue === 0n) return null
                  
                  return (
                    <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            tokenType === 'YES' ? 'bg-emerald-500' : 'bg-burnt-orange-500'
                          }`}>
                            {tokenType}
                          </div>
                          <span className="font-medium text-navy-900">{tokenType} Token</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-navy-900 font-medium">
                        ${formatValue(position.collateralValue)}
                      </td>
                      <td className="py-4 px-4 text-navy-900 font-medium">
                        ${formatValue(position.borrowValue)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${
                          ltv > 75 ? 'text-red-600' : ltv > 60 ? 'text-yellow-600' : 'text-emerald-600'
                        }`}>
                          {ltv.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          position.isLiquidatable 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {position.isLiquidatable ? 'At Risk' : 'Healthy'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard