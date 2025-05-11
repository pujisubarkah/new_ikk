"use client";

import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import Sidebar from "@/components/sidebar-enum";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const Dashboard: React.FC = () => {
    const radarData = {
        labels: [
            'Perencanaan Kebijakan',
            'Implementasi Kebijakan',
            'Evaluasi dan Keberlanjutan',
            'Transparansi dan Partisipasi Publik'
        ],
        datasets: [
            {
                label: 'Skor Kinerja',
                data: [4, 3, 5, 2],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            },
        ],
    };

    return (
        <Sidebar>
            <div className="w-full px-8 py-10 bg-gray-50 min-h-screen">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-base text-gray-600 mt-2">
                        Visualisasi Radar Dimensi Kebijakan Publik
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl w-full hover:scale-105 transition-transform duration-300">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Radar Chart Kinerja Kebijakan</h2>
                        <Radar data={radarData} />
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default Dashboard;
