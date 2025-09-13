import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function AddIncome() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Income'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const transactionData = {
        ...formData,
        amount: Math.abs(parseFloat(formData.amount)), // Ensure positive for income
        userId: user.id
      }
      
      await axios.post(`${import.meta.env.VITE_API_URL}/transactions`, transactionData)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving income:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Add Income</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Income Source:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Salary, Freelance, Investment"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="Enter income amount"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button 
              type="submit" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Income
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddIncome