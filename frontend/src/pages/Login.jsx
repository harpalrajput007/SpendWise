import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('') // Clear previous errors
    
    console.log('Attempting login with:', { email: formData.email })
    console.log('API URL:', import.meta.env.VITE_API_URL)
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData)
      console.log('Login response:', response.data)
      
      if (response.data.user) {
        login(response.data.user)
        navigate('/finance-tracker')
      } else {
        setError('Invalid response from server')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure backend is running on port 5000.')
      } else {
        setError(error.response?.data?.message || 'Login failed')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login to SpendWise</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login