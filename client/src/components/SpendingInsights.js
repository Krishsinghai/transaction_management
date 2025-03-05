import React from 'react';

const SpendingInsights = ({ comparison }) => {
    const totalSpending = comparison.reduce((sum, item) => sum + item.actual, 0);
    const overBudgetCategories = comparison.filter((item) => item.actual > item.budget);
    const withinBudgetCategories = comparison.filter((item) => item.actual <= item.budget);

    return (
        <div className="spending-insights">
            <h3>Spending Insights</h3>
            <p>Total Spending: ${totalSpending.toFixed(2)}</p>
            <p>Over Budget Categories: {overBudgetCategories.map((item) => item.category).join(', ')}</p>
            <p>Within Budget Categories: {withinBudgetCategories.map((item) => item.category).join(', ')}</p>
        </div>
    );
};

export default SpendingInsights;