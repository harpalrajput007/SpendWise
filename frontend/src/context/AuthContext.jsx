import { createContext, useContext, useState, useEffect } from 'react'

// Creating context for user authentication stuff
const AuthContext = createContext()

// Custom hook to use auth context - learned this pattern from a tutorial
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user was already logged in when app starts
  useEffect(() => {
    const savedUserData = localStorage.getItem('user')
    if (savedUserData) {
      const userInfo = JSON.parse(savedUserData)
      setCurrentUser(userInfo)
      setIsLoggedIn(true)
    }
  }, [])

  // Function to handle user login
  const loginUser = (userInfo) => {
    setCurrentUser(userInfo)
    setIsLoggedIn(true)
    // Save to localStorage so user stays logged in
    localStorage.setItem('user', JSON.stringify(userInfo))
  }

  // Function to handle logout
  const logoutUser = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('user')
  }

  const authValues = {
    user: currentUser,
    isAuthenticated: isLoggedIn,
    login: loginUser,
    logout: logoutUser
  }

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  )
}