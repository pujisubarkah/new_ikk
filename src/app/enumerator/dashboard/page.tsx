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
import Sidebar from "@/components/sidebar-enum";

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
            <Sidebar>
                <div className="w-full px-8 py-10 bg-gray-50 min-h-screen">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-base text-gray-600 mt-1">Overview of key metrics and performance</p>
                        </div>

                        {/* Filter Dropdown */}
                        <div className="flex items-center space-x-4">
                            <label htmlFor="filter" className="text-gray-700 font-medium">Filter by:</label>
                            <select
                                id="filter"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="Sales">Sales</option>
                                <option value="Profit">Profit</option>
                            </select>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Bar Chart */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bar Chart</h2>
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <Bar data={horizontalBarData} />
                            </div>
                        </div>

                        {/* Radar Chart */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Radar Chart</h2>
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <Radar data={radarData} />
                            </div>
                        </div>
                    </div>
                </div>
                </Sidebar>
    );
};

export default Dashboard;
