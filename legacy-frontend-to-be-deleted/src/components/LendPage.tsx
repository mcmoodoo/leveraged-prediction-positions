function LendPage() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-navy-900 mb-4">Lend Assets</h2>
        <p className="text-neutral-600 mb-6">
          Lend your assets to earn interest. Your assets will be used to back borrowing positions.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            <p className="text-blue-800 text-sm">
              Lending functionality coming soon. Check back later for updates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-50 p-4 rounded-lg">
            <h3 className="font-semibold text-navy-900 mb-2">Stable Returns</h3>
            <p className="text-sm text-neutral-600">
              Earn consistent returns by lending your assets to the protocol.
            </p>
          </div>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <h3 className="font-semibold text-navy-900 mb-2">Flexible Withdrawals</h3>
            <p className="text-sm text-neutral-600">
              Withdraw your assets at any time, subject to protocol liquidity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LendPage