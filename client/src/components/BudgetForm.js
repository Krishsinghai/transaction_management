import React, { useState } from 'react';

const BudgetForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        category: 'Food',
        amount: '',
        month: '',
        year: '',
    });

    const categories = ['Food', 'Rent', 'Transportation', 'Entertainment', 'Utilities', 'Other'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ category: 'Food', amount: '', month: '', year: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="budget-form">
            <select name="category" value={formData.category} onChange={handleInputChange} required>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>
            <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} required />
            <input type="text" name="month" placeholder="Month (e.g., October)" value={formData.month} onChange={handleInputChange} required />
            <input type="number" name="year" placeholder="Year (e.g., 2023)" value={formData.year} onChange={handleInputChange} required />
            <button type="submit">Set Budget</button>
        </form>
    );
};

export default BudgetForm;