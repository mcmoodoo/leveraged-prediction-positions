import { ConnectButton } from '@rainbow-me/rainbowkit'
import { TrendingUp, BarChart3 } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white border-b border-neutral-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-navy-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <div className="flex space-x-0.5">
                <TrendingUp className="w-4 h-4 text-white" />
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy-900">
                Polymarket Leverage
              </h1>
              <p className="text-xs text-neutral-600 hidden sm:block">
                Leveraged Prediction Positions
              </p>
            </div>
          </div>

          {/* Navigation & Wallet Connection */}
          <div className="flex items-center space-x-6">
            {/* Network Status */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700">Polygon</span>
            </div>

            {/* Connect Wallet Button */}
            <div className="flex items-center">
              <ConnectButton 
                chainStatus="icon"
                accountStatus="address"
                showBalance={false}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header