require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://spendwise-frontend.onrender.com',
    /\.onrender\.com$/
  ],
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Personal Finance Tracker API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});