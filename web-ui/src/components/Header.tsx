import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Lend', path: '/lend' },
    { name: 'Borrow', path: '/borrow' },
    { name: 'Wrap/Unwrap', path: '/wrap' },
  ]

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-navy-500 to-emerald-500 rounded-lg"></div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-neutral-900">Morpho Blue</h1>
                <p className="text-xs text-neutral-600">Leveraged Prediction Positions</p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-navy-600 border-b-2 border-navy-600'
                    : 'text-neutral-700 hover:text-navy-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}