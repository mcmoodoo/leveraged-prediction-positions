import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import WrapTokens from './components/WrapTokens'
import CreatePosition from './components/CreatePosition'
import { useAccount } from 'wagmi'

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wrap' | 'position'>('dashboard')
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-16">
            <div className="card max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-neutral-600 mb-6">
                Connect your wallet to start creating leveraged positions on Polymarket prediction tokens.
              </p>
              <div className="flex justify-center">
                <div id="wallet-connect-placeholder" className="text-navy-600">
                  Use the "Connect Wallet" button in the header above
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-soft mb-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-navy-100 text-navy-700 shadow-soft'
                    : 'text-neutral-600 hover:text-navy-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('wrap')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'wrap'
                    ? 'bg-navy-100 text-navy-700 shadow-soft'
                    : 'text-neutral-600 hover:text-navy-600'
                }`}
              >
                Wrap Tokens
              </button>
              <button
                onClick={() => setActiveTab('position')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'position'
                    ? 'bg-navy-100 text-navy-700 shadow-soft'
                    : 'text-neutral-600 hover:text-navy-600'
                }`}
              >
                Create Position
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'wrap' && <WrapTokens />}
              {activeTab === 'position' && <CreatePosition />}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App