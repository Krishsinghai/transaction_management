// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

if (process.env.MONGO_URI) {
    console.log("dotenv loaded successfully!");
} else {
    console.log("dotenv failed to load.");
}


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected to Atlas'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Backend is running on Vercel!');
});

// Add a new transaction
app.post('/transactions', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all transactions
app.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Edit a transaction
app.put('/transactions/:id', async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a transaction
app.delete('/transactions/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Set a budget for a category
app.post('/budgets', async (req, res) => {
    try {
        const { category, amount, month, year } = req.body;
        const newBudget = new Budget({ category, amount, month, year });
        const savedBudget = await newBudget.save();
        res.status(201).json(savedBudget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all budgets
app.get('/budgets', async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Compare budgets with actual spending
app.get('/budgets/comparison', async (req, res) => {
    try {
        const { month, year } = req.query;
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const budgets = await Budget.find({ month, year });
        const transactions = await Transaction.find({
            date: {
                $gte: startDate,
                $lt: endDate,
            },
        });

        const comparison = budgets.map((budget) => {
            const actualSpending = transactions
                .filter((t) => t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
            return {
                category: budget.category,
                budget: budget.amount,
                actual: actualSpending,
            };
        });

        res.json(comparison);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});