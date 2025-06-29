import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface Pool {
  id: string
  name: string
  totalDeposited: string
  borrowRate: string
  totalBorrowed: string
  utilization: string
  description: string
}

const mockPools: Pool[] = [
  {
    id: '1',
    name: 'Trump Win 2024',
    totalDeposited: '$2.4M',
    borrowRate: '8.5%',
    totalBorrowed: '$1.8M',
    utilization: '75%',
    description: 'Presidential Election Prediction Market'
  },
  {
    id: '2', 
    name: 'Bitcoin $100K',
    totalDeposited: '$1.2M',
    borrowRate: '12.3%',
    totalBorrowed: '$890K',
    utilization: '74%',
    description: 'Bitcoin Price Prediction'
  },
  {
    id: '3',
    name: 'AI Breakthrough 2024',
    totalDeposited: '$850K',
    borrowRate: '15.7%',
    totalBorrowed: '$425K',
    utilization: '50%',
    description: 'Technology Advancement Market'
  },
  {
    id: '4',
    name: 'Climate Goals Met',
    totalDeposited: '$650K',
    borrowRate: '9.2%',
    totalBorrowed: '$195K',
    utilization: '30%',
    description: 'Environmental Impact Prediction'
  }
]

function BorrowPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const filteredPools = mockPools.filter(pool =>
    pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePoolClick = (poolId: string) => {
    navigate(`/borrow/${poolId}`)
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Borrow Against Prediction Markets</h2>
            <p className="text-neutral-600">
              Deposit collateral and borrow against Polymarket prediction tokens to create leveraged positions.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search pools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-1 focus:ring-navy-500 focus:border-navy-500"
          />
        </div>

        {/* Pools Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Pool
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Total Deposited
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Borrow Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Total Borrowed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Utilization
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredPools.map((pool) => (
                <tr
                  key={pool.id}
                  onClick={() => handlePoolClick(pool.id)}
                  className="hover:bg-neutral-50 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-navy-900">{pool.name}</div>
                      <div className="text-sm text-neutral-500">{pool.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-navy-900">{pool.totalDeposited}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-navy-900">{pool.borrowRate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-navy-900">{pool.totalBorrowed}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-navy-900 mr-2">{pool.utilization}</div>
                      <div className="w-16 bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-navy-600 h-2 rounded-full"
                          style={{ width: pool.utilization }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPools.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-500">No pools found matching your search.</p>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold text-navy-900 mb-2">Leveraged Positions</h3>
          <p className="text-sm text-neutral-600">
            Amplify your exposure to prediction markets by borrowing against your collateral.
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-navy-900 mb-2">Risk Management</h3>
          <p className="text-sm text-neutral-600">
            Monitor your positions and maintain healthy collateral ratios to avoid liquidation.
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-navy-900 mb-2">Flexible Terms</h3>
          <p className="text-sm text-neutral-600">
            Adjust your positions as market conditions change to optimize returns.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BorrowPage