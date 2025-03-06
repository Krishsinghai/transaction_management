import React, { useState } from 'react';

const BudgetForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        category: 'Food',
        amount: '',
        month: 'October', // Default month
        year: '2023', // Default year
    });

    const categories = ['Food', 'Rent', 'Transportation', 'Entertainment', 'Utilities', 'Other'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ category: 'Food', amount: '', month: 'October', year: '2023' });
    };

    return (
        <form onSubmit={handleSubmit} className="budget-form">
            <select name="category" value={formData.category} onChange={handleInputChange} required>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>
            <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} required />
            <select name="month" value={formData.month} onChange={handleInputChange} required>
                {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                ))}
            </select>
            <input type="text" name="year" placeholder="Year" value={formData.year} onChange={handleInputChange} required />
            <button type="submit">Set Budget</button>
        </form>
    );
};

export default BudgetForm;