import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function EditTransactionModal({ isOpen, onClose, onSuccess, transactionId }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && transactionId) {
      fetchTransaction()
    }
  }, [isOpen, transactionId])

  const fetchTransaction = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/transactions/${transactionId}`)
      const transaction = response.data
      setFormData({
        title: transaction.title,
        amount: Math.abs(transaction.amount),
        date: transaction.date.split('T')[0],
        category: transaction.category
      })
    } catch (error) {
      console.error('Error fetching transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const transactionData = { ...formData }
      
      if (transactionData.category !== 'Income') {
        transactionData.amount = -Math.abs(parseFloat(transactionData.amount))
      } else {
        transactionData.amount = Math.abs(parseFloat(transactionData.amount))
      }
      
      await axios.put(`${import.meta.env.VITE_API_URL}/transactions/${transactionId}`, transactionData)
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating transaction:', error)
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
        <h2 className="text-2xl font-bold mb-4">Edit Transaction</h2>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Category</option>
                <option value="Food">Food & Dining</option>
                <option value="Groceries">Groceries</option>
                <option value="Transport">Transportation</option>
                <option value="Fuel">Fuel</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills & Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Rent">Rent</option>
                <option value="Insurance">Insurance</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Gifts">Gifts & Donations</option>
                <option value="Income">Income</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update Transaction
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
        )}
      </div>
    </div>
  )
}

export default EditTransactionModal