import { useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    if (path === '/borrow') {
      return location.pathname === '/borrow' || location.pathname.startsWith('/borrow/')
    }
    return location.pathname === path
  }

  return (
    <>
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-soft mb-8">
        <button
          onClick={() => navigate('/lend')}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
            isActive('/lend')
              ? 'bg-navy-100 text-navy-700 shadow-soft'
              : 'text-neutral-600 hover:text-navy-600'
          }`}
        >
          Lend
        </button>
        <button
          onClick={() => navigate('/borrow')}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
            isActive('/borrow')
              ? 'bg-navy-100 text-navy-700 shadow-soft'
              : 'text-neutral-600 hover:text-navy-600'
          }`}
        >
          Borrow
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
            isActive('/dashboard')
              ? 'bg-navy-100 text-navy-700 shadow-soft'
              : 'text-neutral-600 hover:text-navy-600'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/wrap')}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
            isActive('/wrap')
              ? 'bg-navy-100 text-navy-700 shadow-soft'
              : 'text-neutral-600 hover:text-navy-600'
          }`}
        >
          Wrap Tokens
        </button>
        <button
          onClick={() => navigate('/position')}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
            isActive('/position')
              ? 'bg-navy-100 text-navy-700 shadow-soft'
              : 'text-neutral-600 hover:text-navy-600'
          }`}
        >
          Create Position
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {children}
      </div>
    </>
  )
}

export default Layout