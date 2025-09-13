import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import AddTransactionModal from '../components/AddTransactionModal'
import EditTransactionModal from '../components/EditTransactionModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import axios from 'axios'

// Main component for showing list of transactions
function TransactionList() {
  const { user } = useAuth()
  
  // State variables for managing data and UI
  const [transList, setTransList] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false) 
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTrans, setSelectedTrans] = useState(null)
  const [filterOptions, setFilterOptions] = useState({
    category: '',
    startDate: '',
    endDate: ''
  })
  const [searchText, setSearchText] = useState('')

  // Load transactions when component mounts or filters change
  useEffect(() => {
    loadTransactions()
  }, [filterOptions])

  // Function to get transactions from backend
  const loadTransactions = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (user?.id) queryParams.append('userId', user.id)
      if (filterOptions.category) queryParams.append('category', filterOptions.category)
      if (filterOptions.startDate) queryParams.append('start', filterOptions.startDate)
      if (filterOptions.endDate) queryParams.append('end', filterOptions.endDate)
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/transactions?${queryParams}`)
      // Only show expenses (negative amounts) - not income
      const expenseOnly = response.data.filter(trans => trans.amount < 0)
      setTransList(expenseOnly)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  // Update filter when user changes dropdown/input
  const updateFilters = (e) => {
    setFilterOptions({
      ...filterOptions,
      [e.target.name]: e.target.value
    })
  }

  // Clear all filters and search
  const clearAllFilters = () => {
    setFilterOptions({ category: '', startDate: '', endDate: '' })
    setSearchText('')
  }

  // Filter transactions based on search text
  const filteredList = transList.filter(trans =>
    trans.title.toLowerCase().includes(searchText.toLowerCase()) ||
    trans.category.toLowerCase().includes(searchText.toLowerCase())
  )

  // Calculate total expenses for header
  const getTotalExpenses = () => {
    return filteredList.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍽️',
      'Groceries': '🛒',
      'Transport': '🚗',
      'Fuel': '⛽',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Healthcare': '🏥',
      'Education': '📚',
      'Travel': '✈️',
      'Rent': '🏠',
      'Insurance': '🛡️',
      'Subscriptions': '📱',
      'Personal Care': '💄',
      'Gifts': '🎁',
      'Other': '📦'
    }
    return icons[category] || '💰'
  }

  // Open edit modal with selected transaction
  const openEditModal = (trans) => {
    setSelectedTrans(trans)
    setShowEditModal(true)
  }

  // Open delete confirmation modal
  const openDeleteModal = (trans) => {
    setSelectedTrans(trans)
    setShowDeleteModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
              <p className="text-gray-600 mt-1">Track and manage your daily expenses</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-red-600 font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-red-700">${getTotalExpenses().toFixed(2)}</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Search & Filter</h3>
            <button
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700 flex items-center space-x-1 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Clear All</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              name="category"
              value={filterOptions.category}
              onChange={updateFilters}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
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
              <option value="Other">Other</option>
            </select>
            
            {/* Date Filters */}
            <input
              type="date"
              name="startDate"
              value={filterOptions.startDate}
              onChange={updateFilters}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            
            <input
              type="date"
              name="endDate"
              value={filterOptions.endDate}
              onChange={updateFilters}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            
            {/* Results Count */}
            <div className="flex items-center justify-center bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-sm text-gray-600 font-medium">
                {filteredList.length} expense{filteredList.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        
        {/* Transactions List */}
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No expenses found</h3>
            <p className="text-gray-600 mb-6">Start tracking your expenses by adding your first transaction.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Add Your First Expense
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredList.map(transaction => (
              <div key={transaction._id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                      <span className="text-xl">{getCategoryIcon(transaction.category)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{transaction.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          {transaction.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openEditModal(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => openDeleteModal(transaction)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <AddTransactionModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSuccess={loadTransactions}
      />
      
      <EditTransactionModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        onSuccess={loadTransactions}
        transactionId={selectedTrans?._id}
      />
      
      <DeleteConfirmModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        onSuccess={loadTransactions}
        transaction={selectedTrans}
      />
    </div>
  )
}

export default TransactionList