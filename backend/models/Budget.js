const mongoose = require('mongoose');
const BudgetSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Rent', 'Transportation', 'Entertainment', 'Utilities', 'Other'],
    },
    amount: {
        type: Number,
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Budget', BudgetSchema);