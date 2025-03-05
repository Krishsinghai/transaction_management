const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Rent', 'Transportation', 'Entertainment', 'Utilities', 'Other'], // Predefined categories
    },
});

module.exports = mongoose.model('Transaction', TransactionSchema);