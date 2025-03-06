import React, { useState, useEffect } from 'react';
import MonthlyExpensesChart from './MonthlyExpensesChart';
import CategoryPieChart from './CategoryPieChart';
import BudgetForm from './BudgetForm';
import BudgetVsActualChart from './BudgetVsActualChart';
import SpendingInsights from './SpendingInsights';
import './Transaction.css';

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        description: '',
        category: 'Food',
    });
    const [editId, setEditId] = useState(null);
    const [comparison, setComparison] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('October');
    const [selectedYear, setSelectedYear] = useState('2023');

    const categories = ['Food', 'Rent', 'Transportation', 'Entertainment', 'Utilities', 'Other'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    useEffect(() => {
        fetchTransactions();
        fetchComparison(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    const fetchTransactions = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/transactions`);
        const data = await response.json();
        setTransactions(data);
    };

    const fetchComparison = async (month, year) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/budgets/comparison?month=${month}&year=${year}`);
        const data = await response.json();
        setComparison(data);
    };

    const handleBudgetSubmit = async (budget) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/budgets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budget),
        });
        if (response.ok) {
            fetchComparison(selectedMonth, selectedYear);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.amount <= 0 || new Date(formData.date) > new Date() || formData.description.length < 3) {
            alert('Please enter valid transaction details.');
            return;
        }

        const url = editId ? `${process.env.REACT_APP_API_URL}/transactions/${editId}` : `${process.env.REACT_APP_API_URL}/transactions`;
        const method = editId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            fetchTransactions();
            setFormData({ amount: '', date: '', description: '', category: 'Food' });
            setEditId(null);
            fetchComparison(selectedMonth, selectedYear);
        }
    };

    const handleEdit = async (id) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/transactions/${id}`);
        if (response.ok) {
            const transaction = await response.json();
            setFormData({ ...transaction, date: new Date(transaction.date).toISOString().split('T')[0] });
            setEditId(transaction._id);
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/transactions/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchTransactions();
            fetchComparison(selectedMonth, selectedYear);
        }
    };

    const calculateMonthlyExpenses = () => {
        const monthlyExpenses = {};
        transactions.forEach((transaction) => {
            const month = new Date(transaction.date).toLocaleString('default', { month: 'long' });
            monthlyExpenses[month] = (monthlyExpenses[month] || 0) + transaction.amount;
        });
        return monthlyExpenses;
    };

    const calculateCategoryExpenses = () => {
        return transactions.reduce((acc, { category, amount }) => {
            acc[category] = (acc[category] || 0) + amount;
            return acc;
        }, {});
    };

    const totalExpenses = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    const mostRecentTransactions = transactions.slice(0, 5);

    return (
        <div className="transaction-app">
            <h1 className="transaction-heading">Transaction Tracker</h1>

            <div className="form-container">
                <h3>Add a New Transaction</h3>
                <form className="transaction-form" onSubmit={handleSubmit}>
                    <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} required />
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
                    <select name="category" value={formData.category} onChange={handleInputChange} required>
                        {categories.map((category) => (<option key={category} value={category}>{category}</option>))}
                    </select>
                    <button type="submit">{editId ? 'Update' : 'Add'} Transaction</button>
                </form>
            </div>

            <div className="form-container">
                <h3>Add a Budget</h3>
                <BudgetForm onSubmit={handleBudgetSubmit} />
            </div>

            <div className="charts-section">
                <h3>Your Expenses</h3>
                <MonthlyExpensesChart data={calculateMonthlyExpenses()} />
                <h4>Category-Wise Expense Division</h4>
                <CategoryPieChart data={calculateCategoryExpenses()} />
                <h3>Compare Your Expenses</h3>
                <BudgetVsActualChart data={comparison} />
                <SpendingInsights comparison={comparison} />
            </div>
        </div>
    );
};

export default Transaction;
