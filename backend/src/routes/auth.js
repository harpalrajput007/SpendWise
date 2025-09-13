const express = require('express')
const User = require('../models/User')
const router = express.Router()

// Route for user registration/signup
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    // Check if all fields are filled
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    
    // Password should be at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    
    // Basic email validation - found this regex online
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create new user
    const newUser = new User({ name, email, password })
    await newUser.save()
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Route for user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Make sure both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    
    // Find user and check password
    const foundUser = await User.findOne({ email })
    if (!foundUser || foundUser.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    
    // Send back user info (without password)
    res.json({ 
      message: 'Login successful',
      user: { id: foundUser._id, name: foundUser.name, email: foundUser.email }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router