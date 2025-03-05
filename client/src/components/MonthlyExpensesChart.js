import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MonthlyExpensesChart = ({ data }) => {
    // Transform data into the format required by Recharts
    const chartData = Object.keys(data).map((month) => ({
        month,
        expense: data[month],
    }));

    return (
        <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expense" fill="#8884d8" />
        </BarChart>
    );
};

export default MonthlyExpensesChart;