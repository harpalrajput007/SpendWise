import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function AddEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEdit = Boolean(id)
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: ''
  })

  useEffect(() => {
    if (isEdit) {
      fetchTransaction()
    }
  }, [id])

  const fetchTransaction = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/transactions/${id}`)
      const transaction = response.data
      setFormData({
        title: transaction.title,
        amount: transaction.amount,
        date: transaction.date.split('T')[0],
        category: transaction.category
      })
    } catch (error) {
      console.error('Error fetching transaction:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const transactionData = { ...formData }
      
      // Ensure expenses are negative (except for Income category)
      if (transactionData.category !== 'Income') {
        transactionData.amount = -Math.abs(parseFloat(transactionData.amount))
      } else {
        transactionData.amount = Math.abs(parseFloat(transactionData.amount))
      }
      
      if (!isEdit) {
        transactionData.userId = user.id
      }
      
      if (isEdit) {
        await axios.put(`${import.meta.env.VITE_API_URL}/transactions/${id}`, transactionData)
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/transactions`, transactionData)
      }
      navigate('/finance-tracker')
    } catch (error) {
      console.error('Error saving transaction:', error)
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
      <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={Math.abs(formData.amount)}
              onChange={handleChange}
              required
              placeholder="Enter amount"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          
          <div className="flex space-x-4 pt-4">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEdit ? 'Update' : 'Add'} Transaction
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/finance-tracker')}
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

export default AddEdit