import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function DeletePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState(null)

  useEffect(() => {
    fetchTransaction()
  }, [id])

  const fetchTransaction = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/transactions/${id}`)
      setTransaction(response.data)
    } catch (error) {
      console.error('Error fetching transaction:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/transactions/${id}`)
      navigate('/')
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  if (!transaction) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Delete Transaction</h1>
          <p className="text-gray-700 mb-4">Are you sure you want to delete this transaction? This action cannot be undone.</p>
          
          <div className="bg-red-50 border border-red-200 p-4 rounded mb-6">
            <h3 className="font-semibold text-lg">{transaction.title}</h3>
            <p className="text-gray-700">Amount: ${Math.abs(transaction.amount).toFixed(2)}</p>
            <p className="text-gray-700">Date: {new Date(transaction.date).toLocaleDateString()}</p>
            <p className="text-gray-700">Category: {transaction.category}</p>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex-1"
            >
              Delete Transaction
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeletePage