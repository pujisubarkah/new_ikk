"use client";

import React, { useEffect, useState } from 'react';
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
  const [chartData, setChartData] = useState<number[] | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      const userId = localStorage.getItem('id');
      if (!userId) return;

      try {
        const res = await fetch(`/api/nilai/analis_instansi/${userId}`);
        const json = await res.json();
        const score = json?.data?.scores?.[0];

        if (score) {
          setChartData([
            score.a_total_score ?? 0,
            score.b_total_score ?? 0,
            score.c_total_score ?? 0,
            score.d_total_score ?? 0,
          ]);
        }
      } catch (err) {
        console.error("Error fetching radar data:", err);
      }
    };

    fetchScores();
  }, []);

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
        data: chartData ?? [0, 0, 0, 0],
        backgroundColor: 'rgba(102, 126, 234, 0.3)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
      },
    ],
  };

  return (
    <Sidebar>
      <div className="w-full px-6 md:px-10 py-10 bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-screen">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 drop-shadow-sm">Dashboard Kinerja</h1>
          <p className="text-lg text-gray-500 mt-2">
            Visualisasi Radar Dimensi Kebijakan Publik
          </p>
        </div>

        <div className="flex justify-center animate-fadeInUp">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl transform transition-transform duration-500 hover:scale-105">
            <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
              Radar Chart Kinerja Kebijakan
            </h2>
            <Radar data={radarData} />
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Dashboard;
