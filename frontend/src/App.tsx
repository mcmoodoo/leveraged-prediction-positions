import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import WrapTokens from './components/WrapTokens'
import CreatePosition from './components/CreatePosition'
import Layout from './components/Layout'
import LendPage from './components/LendPage'
import BorrowPage from './components/BorrowPage'
import BorrowPoolDetailsPage from './components/BorrowPoolDetailsPage'
import { useAccount } from 'wagmi'

function App() {
  const { isConnected } = useAccount()

  return (
    <Router>
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
            <Layout>
              <Routes>
                <Route path="/lend" element={<LendPage />} />
                <Route path="/borrow" element={<BorrowPage />} />
                <Route path="/borrow/:poolId" element={<BorrowPoolDetailsPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/wrap" element={<WrapTokens />} />
                <Route path="/position" element={<CreatePosition />} />
                <Route path="/" element={<Navigate to="/borrow" replace />} />
              </Routes>
            </Layout>
          )}
        </main>
      </div>
    </Router>
  )
}

export default App