const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://singhaikrish769:LzdMUeUnTuKyfF6Z@krishcluster.axufc.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Backend is running!');
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
        const transactions = await Transaction.find().sort({ date: -1 }); // Sort by most recent
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
            { new: true } // Return the updated transaction
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
        const budgets = await Budget.find({ month, year });
        const transactions = await Transaction.find({
            date: {
                $gte: new Date(`${year}-${month}-01`),
                $lt: new Date(`${year}-${month + 1}-01`),
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
    console.log(`Server is running on port ${PORT}`);
});