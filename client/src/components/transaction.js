import React, { useState, useEffect } from 'react';
import MonthlyExpensesChart from './MonthlyExpensesChart';
import CategoryPieChart from './CategoryPieChart';
// import CategoryPieChart from './MonthlyExpensesChart';
import './Transaction.css';

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        description: '',
        category: 'Food', // Default category
    });
    const [editId, setEditId] = useState(null);

    // Predefined categories
    const categories = ['Food', 'Rent', 'Transportation', 'Entertainment', 'Utilities', 'Other'];

    // Fetch all transactions
    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const response = await fetch('http://localhost:5000/transactions');
        const data = await response.json();
        setTransactions(data);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission (add or edit)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.amount <= 0) {
            alert('Amount must be a positive number.');
            return;
        }

        if (new Date(formData.date) > new Date()) {
            alert('Date cannot be in the future.');
            return;
        }

        if (formData.description.length < 3) {
            alert('Description must be at least 3 characters long.');
            return;
        }

        // Submit logic
        const url = editId ? `http://localhost:5000/transactions/${editId}` : 'http://localhost:5000/transactions';
        const method = editId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            fetchTransactions(); // Refresh the list
            setFormData({ amount: '', date: '', description: '', category: 'Food' }); // Reset form
            setEditId(null); // Clear edit mode
        }
    };

    // Handle editing a transaction
    const handleEdit = (transaction) => {
        setFormData({
            amount: transaction.amount,
            date: new Date(transaction.date).toISOString().split('T')[0], // Format date for input
            description: transaction.description,
            category: transaction.category,
        });
        setEditId(transaction._id);
    };

    // Handle deleting a transaction
    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:5000/transactions/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchTransactions(); // Refresh the list
        }
    };

    // Calculate monthly expenses
    const calculateMonthlyExpenses = () => {
        const monthlyExpenses = {};
        transactions.forEach((transaction) => {
            const month = new Date(transaction.date).toLocaleString('default', { month: 'long' });
            if (!monthlyExpenses[month]) {
                monthlyExpenses[month] = 0;
            }
            monthlyExpenses[month] += transaction.amount;
        });
        return monthlyExpenses;
    };

    // Calculate category-wise expenses
    const calculateCategoryExpenses = () => {
        const categoryExpenses = {};
        transactions.forEach((transaction) => {
            const { category, amount } = transaction;
            if (!categoryExpenses[category]) {
                categoryExpenses[category] = 0;
            }
            categoryExpenses[category] += amount;
        });
        return categoryExpenses;
    };

    // Calculate total expenses
    const totalExpenses = transactions.reduce((total, transaction) => total + transaction.amount, 0);

    // Get most recent transactions
    const mostRecentTransactions = transactions.slice(0, 5);

    return (
        <div className="transaction-app">
            <h1 className="transaction-heading">Transaction Tracker</h1>
            <form className="transaction-form" onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="transaction-input"
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="transaction-input"
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="transaction-input"
                    required
                />
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="transaction-input"
                    required
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <button type="submit" className="transaction-button">
                    {editId ? 'Update' : 'Add'} Transaction
                </button>
            </form>

            {/* Dashboard Summary Cards */}
            <div className="dashboard-summary">
                <div className="summary-card">
                    <h3>Total Expenses</h3>
                    <p>${totalExpenses.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                    <h3>Most Recent Transactions</h3>
                    <ul>
                        {mostRecentTransactions.map((transaction) => (
                            <li key={transaction._id}>
                                {transaction.description}: ${transaction.amount}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Charts */}
            <MonthlyExpensesChart data={calculateMonthlyExpenses()} />
            <CategoryPieChart data={calculateCategoryExpenses()} />

            {/* Transaction List */}
            <ul className="transaction-list">
                {transactions.map((transaction) => (
                    <li key={transaction._id} className="transaction-item">
                        <span>
                            {transaction.description}: ${transaction.amount} on {new Date(transaction.date).toLocaleDateString()} ({transaction.category})
                        </span>
                        <div>
                            <button onClick={() => handleEdit(transaction)} className="transaction-button">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(transaction._id)} className="transaction-button">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Transaction;