import axios from 'axios'

function DeleteConfirmModal({ isOpen, onClose, onSuccess, transaction }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/transactions/${transaction._id}`)
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  if (!isOpen || !transaction) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Transaction</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{transaction.title}"? This action cannot be undone.
        </p>
        <div className="flex space-x-4">
          <button 
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button 
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal