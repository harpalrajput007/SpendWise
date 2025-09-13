import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'
import AddIncomeModal from '../components/AddIncomeModal'
import axios from 'axios'

// Colors for the pie chart - different shades of green
const chartColors = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5', '#ECFDF5']

// Dashboard component - shows overview of user's finances
function Dashboard() {
  const { user } = useAuth()
  
  // State for storing data
  const [allTransactions, setAllTransactions] = useState([])
  const [moneyStats, setMoneyStats] = useState({ income: 0, expense: 0, balance: 0 })
  const [showIncomeModal, setShowIncomeModal] = useState(false)

  // Load data when user logs in
  useEffect(() => {
    if (user?.id) {
      loadAllTransactions()
    }
  }, [user])

  // Auto refresh every 5 seconds - maybe not the best idea but works for now
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      if (user?.id) {
        loadAllTransactions()
      }
    }, 5000)
    
    return () => clearInterval(refreshTimer)
  }, [user])

  // Get all transactions for this user
  const loadAllTransactions = async () => {
    try {
      const params = new URLSearchParams()
      if (user?.id) params.append('userId', user.id)
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/transactions?${params}`)
      setAllTransactions(response.data)
      calculateStats(response.data) // calculate income, expenses, balance
    } catch (error) {
      console.error('Error loading transactions:', error)
    }
  }

  // Calculate total income, expenses and balance
  const calculateStats = (data) => {
    const totalIncome = data.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = Math.abs(data.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
    setMoneyStats({ income: totalIncome, expense: totalExpense, balance: totalIncome - totalExpense })
  }

  // Data for the bar chart
  const getChartData = () => {
    return [
      { name: 'Income', amount: moneyStats.income, fill: '#10B981' },
      { name: 'Expenses', amount: moneyStats.expense, fill: '#EF4444' }
    ]
  }

  // Group expenses by category for pie chart
  const getCategoryBreakdown = () => {
    const categoryTotals = {}
    // Only look at expenses (negative amounts)
    allTransactions.filter(t => t.amount < 0).forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount)
    })
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))
  }

  // Get the 5 most recent transactions
  const getLatestTransactions = () => {
    return allTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's your financial overview.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">Total Income</h3>
                </div>
                <p className="text-3xl font-bold text-white">${moneyStats.income.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => setShowIncomeModal(true)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Total Expenses</h3>
            </div>
            <p className="text-3xl font-bold text-white">${moneyStats.expense.toFixed(2)}</p>
          </div>

          <div className={`group p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${
            moneyStats.balance >= 0 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
              : 'bg-gradient-to-br from-orange-500 to-orange-600'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Net Balance</h3>
            </div>
            <p className="text-3xl font-bold text-white">${moneyStats.balance.toFixed(2)}</p>
            <p className="text-white/80 text-sm mt-1">
              {moneyStats.balance >= 0 ? 'Great saving!' : 'Consider reducing expenses'}
            </p>
          </div>
        </div>

        {/* Charts and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Income vs Expenses Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Income vs Expenses</h3>
              <div className="flex space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Income</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Expenses</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {getLatestTransactions().map((transaction, index) => (
                <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d={transaction.amount > 0 ? "M12 6v6m0 0v6m0-6h6m-6 0H6" : "M20 12H4"} />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{transaction.title}</p>
                      <p className="text-xs text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {getLatestTransactions().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expenses by Category */}
        {getCategoryBreakdown().length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Expenses by Category</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getCategoryBreakdown()}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getCategoryBreakdown().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {getCategoryBreakdown().map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: chartColors[index % chartColors.length] }}
                      ></div>
                      <span className="font-medium text-gray-700">{category.name}</span>
                    </div>
                    <span className="font-bold text-gray-800">${category.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AddIncomeModal 
        isOpen={showIncomeModal} 
        onClose={() => setShowIncomeModal(false)}
        onSuccess={loadAllTransactions}
      />
    </div>
  )
}

export default Dashboard