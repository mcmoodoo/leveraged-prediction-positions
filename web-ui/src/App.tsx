import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { LendPage } from './pages/LendPage'
import { BorrowPage } from './pages/BorrowPage'
import { WrapPage } from './pages/WrapPage'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <div className="min-h-screen bg-neutral-50">
              <Header />
              
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/lend" element={<LendPage />} />
                  <Route path="/borrow" element={<BorrowPage />} />
                  <Route path="/wrap" element={<WrapPage />} />
                </Routes>
              </main>
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App