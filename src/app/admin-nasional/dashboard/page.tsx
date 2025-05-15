"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar-admin";
import axios from "axios";
import { toast } from 'sonner';
import { Bar, Radar } from "react-chartjs-2";
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
} from "chart.js";

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

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  position: string | null;
  work_unit: string | null;
  active_year: string;
  status: "aktif" | "nonaktif" | "inactive";
  instansi: {
    agency_id: string;
    agency_name: string;
    instansi_kategori: {
      id: number;
      kat_instansi: string;
    };
  };
  surat_penunjukkan: {
    file: string;
  } | null;
  role_user: {
    role_id: string;
    role: {
      id: string;
      name: string;
    };
  };
}

const DashboardPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("Sales");
  const [activeTab, setActiveTab] = useState<string>("approval");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const barData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Profit",
        data: [5, 8, 2, 4, 1, 2],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const radarData = {
    labels: ["Speed", "Reliability", "Comfort", "Safety", "Efficiency"],
    datasets: [
      {
        label: "Performance",
        data: [2, 3, 4, 5, 1],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const approveUser = async (userId: number) => {
    try {
      // Mengirim request POST ke API untuk mengupdate status user dan mengirim email
      const response = await fetch('/api/approveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
  
      if (response.ok) {
        console.log('User approved and email sent');
        toast.success('User berhasil disetujui dan email telah terkirim!');  // Toast sukses
        // Opsional: Update UI (misalnya dengan mengubah status di UI atau memberi pesan sukses)
      } else {
        console.error('Failed to approve user');
        toast.error('Gagal menyetujui user, coba lagi.');  // Toast error jika gagal
      }
    } catch (error) {
      console.error('Error in approveUser:', error);
      toast.error('Terjadi kesalahan, coba lagi.');  // Toast error jika terjadi kesalahan
    }
  };

  const filteredUsers = users.filter(
    (user) => user.role_user?.role_id === "4" && user.status !== "aktif"
  );

  const [helpdeskData, setHelpdeskData] = useState<any[]>([]);
  const [loadingHelpdesk, setLoadingHelpdesk] = useState<boolean>(false);

  useEffect(() => {
    const fetchHelpdeskData = async () => {
      setLoadingHelpdesk(true);
      try {
        const response = await axios.get("/api/helpdesk");
        setHelpdeskData(response.data);
      } catch (error) {
        console.error("Error fetching helpdesk data:", error);
      } finally {
        setLoadingHelpdesk(false);
      }
    };
    fetchHelpdeskData();
  }, []);

  return (
    <Sidebar>
      <div className="w-full px-4 md:px-8 py-6 md:py-10 bg-gray-50 min-h-screen">
        <div className="flex space-x-2 md:space-x-4 mb-6 md:mb-8 overflow-x-auto">
          <button
            className={`px-4 py-2 text-sm md:text-base md:px-6 md:py-2 rounded-t-lg font-semibold ${
              activeTab === "approval"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 bg-gray-200"
            }`}
            onClick={() => setActiveTab("approval")}
          >
            Approval User
          </button>
          <button
            className={`px-4 py-2 text-sm md:text-base md:px-6 md:py-2 rounded-t-lg font-semibold ${
              activeTab === "dashboard"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 bg-gray-200"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard Grafik
          </button>
          <button
            className={`px-4 py-2 text-sm md:text-base md:px-6 md:py-2 rounded-t-lg font-semibold ${
              activeTab === "helpdesk"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 bg-gray-200"
            }`}
            onClick={() => setActiveTab("helpdesk")}
          >
            Dashboard Helpdesk
          </button>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          {activeTab === "approval" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Persetujuan Registrasi Koordinator Instansi
              </h2>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-3">Nama</th>
                        <th className="text-left p-3">Instansi</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Surat Penunjukkan</th>
                        <th className="text-left p-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="border-t hover:bg-gray-50"
                          >
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">
                              {user.instansi?.agency_name || "Tidak Ada"}
                            </td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  user.status === "aktif"
                                    ? "bg-green-100 text-green-800"
                                    : user.status === "inactive"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="p-3">
                              {user.surat_penunjukkan?.file ? (
                                <a
                                  href={user.surat_penunjukkan.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline break-all"
                                >
                                  Lihat Surat
                                </a>
                              ) : (
                                <span className="text-gray-500">
                                  Tidak Ada
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              {(user.status === "inactive" ||
                                user.status === "nonaktif") && (
                                <button
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base"
                                  onClick={() => approveUser(Number(user.id))}
                                >
                                  Approve
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-gray-500"
                          >
                            Tidak ada data koordinator instansi yang perlu
                            disetujui
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "dashboard" && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Dashboard Pemantauan
                  </h1>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    Overview of key metrics and performance
                  </p>
                </div>

                <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
                  <label
                    htmlFor="filter"
                    className="text-gray-700 font-medium whitespace-nowrap"
                  >
                    Filter by:
                  </label>
                  <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-auto"
                  >
                    <option value="Sales">Sales</option>
                    <option value="Profit">Profit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                    Bar Chart
                  </h2>
                  <div className="h-64 md:h-80">
                    <Bar
                      data={horizontalBarData}
                      options={{
                        indexAxis: "y",
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                    Radar Chart
                  </h2>
                  <div className="h-64 md:h-80">
                    <Radar
                      data={radarData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "helpdesk" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Dashboard Helpdesk
              </h2>
              
                <div>
                  {loadingHelpdesk ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left p-3">Nama Lengkap</th>
                            <th className="text-left p-3">Email Aktif</th>
                            <th className="text-left p-3">Instansi</th>
                            <th className="text-left p-3">Masalah</th>
                            <th className="text-left p-3 w-1/2">Pesan</th>
                          </tr>
                        </thead>
                        <tbody>
                            {helpdeskData.length > 0 ? (
                            helpdeskData
                              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                              .map((item, index) => (
                              <tr key={index} className="border-t hover:bg-gray-50">
                                <td className="p-3">{item.nama_lengkap}</td>
                                <td className="p-3">{item.email_aktif}</td>
                                <td className="p-3">{item.instansi}</td>
                                <td className="p-3">{item.masalah}</td>
                                <td className="p-3 w-1/2">{item.pesan}</td>
                              </tr>
                              ))
                            ) : (
                            <tr>
                              <td colSpan={5} className="p-4 text-center text-gray-500">
                              Tidak ada data helpdesk yang tersedia
                              </td>
                            </tr>
                            )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default DashboardPage;
