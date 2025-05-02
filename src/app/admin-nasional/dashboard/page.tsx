"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/sidebar-admin';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const DashboardPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('Sales');
  const [activeTab, setActiveTab] = useState<string>('approval');

  // Sample data for bar chart
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

  const filteredData = barData.datasets.filter(
    (dataset) => dataset.label === filter
  );

  const horizontalBarData = {
    labels: barData.labels,
    datasets: filteredData,
  };

  // Dummy user pending data
  const [users, setUsers] = useState([
    { id: 1, email: 'user1@email.com', status: 'pending' },
    { id: 2, email: 'user2@email.com', status: 'pending' },
  ]);

  const approveUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
    // (optional) You can call API to update the user status here
  };

  return (
    <Sidebar>
      <div className="w-full px-8 py-10 bg-gray-50 min-h-screen">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold ${activeTab === 'approval' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 bg-gray-200'}`}
            onClick={() => setActiveTab('approval')}
          >
            Approval User
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold ${activeTab === 'dashboard' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 bg-gray-200'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard Grafik
          </button>
        </div>

        {/* Content */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {activeTab === 'approval' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Prsetujuan Registrasi Koordinator Instansi</h2>
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.status}</td>
                      <td className="p-2">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded"
                          onClick={() => approveUser(user.id)}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
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
                    <Bar data={horizontalBarData} options={{ indexAxis: 'y' }} />
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
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default DashboardPage;

