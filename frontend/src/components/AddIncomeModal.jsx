import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function AddIncomeModal({ isOpen, onClose, onSuccess }) {
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
        amount: Math.abs(parseFloat(formData.amount)),
        userId: user.id
      }
      
      await axios.post(`${import.meta.env.VITE_API_URL}/transactions`, transactionData)
      setFormData({ title: '', amount: '', date: new Date().toISOString().split('T')[0], category: 'Income' })
      onSuccess()
      onClose()
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add Income</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Income Source:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Salary, Freelance"
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
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
            <button 
              type="submit" 
              className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Income
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddIncomeModal