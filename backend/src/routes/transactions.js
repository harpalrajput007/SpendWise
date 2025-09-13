const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET /api/transactions - fetch all with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, start, end, userId } = req.query;
    let filter = {};
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = new Date(start);
      if (end) filter.date.$lte = new Date(end);
    }
    
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/transactions/:id - fetch one
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/transactions - create
router.post('/', async (req, res) => {
  try {
    const { title, amount, date, category, userId } = req.body;
    
    // Input validation
    if (!title || !amount || !date || !category || !userId) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (isNaN(amount) || amount === 0) {
      return res.status(400).json({ message: 'Amount must be a valid non-zero number' });
    }
    
    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/transactions/:id - update
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/transactions/:id - delete
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;