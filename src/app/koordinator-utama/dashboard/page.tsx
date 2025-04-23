"use client";

import React, { useState } from 'react';
import { Bar, Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import Sidebar from '@/components/sidebar-admin'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const Dashboard: React.FC = () => {
    const [filter, setFilter] = useState<string>('Sales'); // Default filter

    // Sample data
    const barData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Sales',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Profit',
                data: [5, 8, 2, 4, 1, 2],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const radarData = {
        labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
        datasets: [
            {
                label: 'Performance',
                data: [2, 3, 4, 5, 1],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Filter logic to change barData based on selected filter
    const filteredData = barData.datasets.filter(
        (dataset) => dataset.label === filter
    );

    // Bar chart with horizontal layout
    const horizontalBarData = {
        ...barData,
        datasets: filteredData,
        options: {
            indexAxis: 'y', // This makes the chart horizontal
        },
    };

    return (
        <div className="p-6">
            <Sidebar>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Filter Dropdown */}
            <div className="mb-6">
                <label htmlFor="filter" className="mr-2">Filter by:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2"
                >
                    <option value="Sales">Sales</option>
                    <option value="Profit">Profit</option>
                </select>
            </div>

            {/* Bar Chart */}
            <div className="mb-10">
                <h2 className="text-lg font-semibold mb-4">Bar Chart</h2>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <Bar data={horizontalBarData} />
                </div>
            </div>

            {/* Radar Chart */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Radar Chart</h2>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <Radar data={radarData} />
                </div>
            </div>
                </Sidebar>
        </div>
    );
};

export default Dashboard;
