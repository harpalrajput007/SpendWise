import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
          <div className="space-x-4">
            <Link 
              to="/login" 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute