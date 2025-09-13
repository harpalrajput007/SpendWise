import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

// Modal component for adding new transactions
function AddTransactionModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth()
  
  // Form state - keeping track of what user types
  const [formInfo, setFormInfo] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // today's date as default
    category: ''
  })

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault()
    try {
      const newTransaction = { ...formInfo }
      
      // Make expenses negative and income positive
      if (newTransaction.category !== 'Income') {
        newTransaction.amount = -Math.abs(parseFloat(newTransaction.amount))
      } else {
        newTransaction.amount = Math.abs(parseFloat(newTransaction.amount))
      }
      
      newTransaction.userId = user.id
      
      // Send to backend
      await axios.post(`${import.meta.env.VITE_API_URL}/transactions`, newTransaction)
      
      // Reset form after successful submission
      setFormInfo({ title: '', amount: '', date: new Date().toISOString().split('T')[0], category: '' })
      onSuccess() // refresh the transaction list
      onClose()   // close the modal
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  // Update form when user types something
  const updateForm = (e) => {
    setFormInfo({
      ...formInfo,
      [e.target.name]: e.target.value
    })
  }

  // Don't show modal if it's not open
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
            <input
              type="text"
              name="title"
              value={formInfo.title}
              onChange={updateForm}
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
              value={formInfo.amount}
              onChange={updateForm}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
            <input
              type="date"
              name="date"
              value={formInfo.date}
              onChange={updateForm}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
            <select
              name="category"
              value={formInfo.category}
              onChange={updateForm}
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
              Add Transaction
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

export default AddTransactionModal