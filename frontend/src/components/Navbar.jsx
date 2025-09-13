import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Brand */}
          <Link to="/" className="text-xl md:text-2xl font-bold hover:text-green-200">
            SpendWise
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-green-200 transition">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-green-200 transition">
              Dashboard
            </Link>
            <Link to="/finance-tracker" className="hover:text-green-200 transition">
              Finance Tracker
            </Link>
            <Link to="/about" className="hover:text-green-200 transition">
              About Us
            </Link>
            
            {/* Desktop User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition"
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button 
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                  >
                    👤
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link 
                        to="/login" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        to="/signup" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-md hover:bg-green-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-green-500">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 rounded-md hover:bg-green-700 transition"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className="block px-3 py-2 rounded-md hover:bg-green-700 transition"
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/finance-tracker" 
                className="block px-3 py-2 rounded-md hover:bg-green-700 transition"
                onClick={() => setShowMobileMenu(false)}
              >
                Finance Tracker
              </Link>
              <Link 
                to="/about" 
                className="block px-3 py-2 rounded-md hover:bg-green-700 transition"
                onClick={() => setShowMobileMenu(false)}
              >
                About Us
              </Link>
              
              {/* Mobile User Menu */}
              <div className="border-t border-green-500 pt-2">
                {isAuthenticated ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <button 
                      onClick={() => {
                        logout()
                        setShowMobileMenu(false)
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-green-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link 
                      to="/login" 
                      className="block px-3 py-2 rounded-md hover:bg-green-700 transition"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="block px-3 py-2 rounded-md hover:bg-green-700 transition"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar