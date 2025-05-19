"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar-admin";
import axios from "axios";
import { toast } from "sonner";
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

// --- TYPES ---
interface User {
  id: number;
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

interface KoornasEntry {
  id: number;
  name: string;
  instansi: string;
  koor_nasional: {
    id: number;
    name: string;
  } | null;
}

interface KoornasOption {
  label: string;
  value: number;
}

interface HelpdeskTicket {
  nama_lengkap: string;
  email_aktif: string;
  instansi: string;
  masalah: string;
  pesan: string;
  created_at: string;
}

// --- COMPONENT ---
const KornasRow: React.FC<{
  item: KoornasEntry;
  kornasOptions: KoornasOption[];
  onAssign: (koorInstansiId: number, kornasId: number) => Promise<void>;
  assignLoading: boolean;
}> = ({ item, kornasOptions, onAssign, assignLoading }) => {
  const [selectedKornasId, setSelectedKornasId] = useState<number | null>(
    item.koor_nasional?.id ?? null
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setSelectedKornasId(value);
  };

  const handleSave = () => {
    if (!selectedKornasId) {
      toast.error("Silakan pilih koordinator nasional.");
      return;
    }
    onAssign(item.id, selectedKornasId);
  };

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-3">{item.name}</td>
      <td className="p-3">{item.instansi}</td>
      <td className="p-3 w-64">
        <select
          value={selectedKornasId ?? ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
        >
          <option value="">-- Pilih Koordinator Nasional --</option>
          {kornasOptions.map((kornas) => (
            <option key={kornas.value} value={kornas.value}>
              {kornas.label}
            </option>
          ))}
        </select>
      </td>
      <td className="p-3">
        <button
          onClick={handleSave}
          disabled={assignLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-60"
        >
          {assignLoading ? "Memproses..." : "Simpan"}
        </button>
      </td>
    </tr>
  );
};

const DashboardPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("Sales");
  const [activeTab, setActiveTab] = useState<string>("approval");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [helpdeskData, setHelpdeskData] = useState<HelpdeskTicket[]>([]);
  const [loadingHelpdesk, setLoadingHelpdesk] = useState<boolean>(false);
  const [kornasList, setKornasList] = useState<KoornasEntry[]>([]);
  const [kornasOptions, setKornasOptions] = useState<KoornasOption[]>([]);
  const [assignLoading, setAssignLoading] = useState<boolean>(false);

  // --- DATA GRAFIK ---
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

  const filteredData = barData.datasets.filter((dataset) => dataset.label === filter);
  const horizontalBarData = {
    labels: barData.labels,
    datasets: filteredData,
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Gagal memuat daftar user.");
      } finally {
        setLoading(false);
      }
    };

    const fetchHelpdesk = async () => {
      setLoadingHelpdesk(true);
      try {
        const res = await axios.get("/api/helpdesk");
        setHelpdeskData(res.data);
      } catch (error) {
        console.error("Error fetching helpdesk:", error);
        toast.error("Gagal memuat data helpdesk.");
      } finally {
        setLoadingHelpdesk(false);
      }
    };

    const fetchKoornas = async () => {
      setLoading(true);
      try {
        const res = await axios.get<KoornasEntry[]>("/api/koornas");
        const formatted = res.data.map((item) => ({
          ...item,
          instansi: item.instansi || "Tidak Ada",
        }));
        setKornasList(formatted);
      } catch (error) {
        console.error("Error fetching koornas:", error);
        toast.error("Gagal memuat daftar koordinator nasional.");
      } finally {
        setLoading(false);
      }
    };

    const fetchKoornasOptions = async () => {
      try {
        const res = await axios.get<{ id: number; name: string }[]>("/api/koornas/aktif");
        const options = res.data.map((item) => ({
          label: `${item.name} (${item.id})`,
          value: item.id,
        }));
        setKornasOptions(options);
      } catch (error) {
        console.error("Error fetching koornas options:", error);
        toast.error("Gagal memuat opsi koordinator nasional.");
      }
    };

    fetchUsers();
    fetchHelpdesk();
    fetchKoornas();
    fetchKoornasOptions();
  }, []);

  // --- APPROVAL USER ---
  const approveUser = async (userId: number) => {
    try {
      const res = await fetch("/api/approveUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        toast.success("User berhasil disetujui dan email telah terkirim!");
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        toast.error("Gagal menyetujui user.");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Terjadi kesalahan saat menyetujui user.");
    }
  };

  // --- ASSIGN KOORNAS ---
  const handleAssignKornas = async (
    koorInstansiId: number,
    kornasId: number
  ): Promise<void> => {
    if (!kornasId) {
      toast.error("Silakan pilih koordinator nasional.");
      return;
    }

    setAssignLoading(true);
    try {
      const res = await fetch("/api/penentuan-koornas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          koor_instansi_id: koorInstansiId,
          koor_nasional_id: kornasId,
        }),
      });

      if (res.ok) {
        toast.success("Koordinator Nasional berhasil ditetapkan");
      } else {
        toast.error("Gagal menetapkan koordinator nasional.");
      }
    } catch (error) {
      console.error("Error assigning kornas:", error);
      toast.error("Terjadi kesalahan.");
    } finally {
      setAssignLoading(false);
    }
  };

  // --- FILTER USERS ---
  const filteredUsers = users.filter(
    (user) => user.role_user?.role_id === "4" && user.status === "inactive"
  );

  return (
    <Sidebar>
      <div className="w-full px-4 md:px-8 py-6 md:py-10 bg-gray-50 min-h-screen">
        {/* Tabs */}
        <div className="flex space-x-2 md:space-x-4 mb-6 md:mb-8 overflow-x-auto">
          <button
            className={`px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold whitespace-nowrap ${
              activeTab === "approval"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 bg-gray-200"
            }`}
            onClick={() => setActiveTab("approval")}
          >
            Approval User
          </button>
          <button
            key="penentuan_kornas"
            onClick={() => setActiveTab("penentuan_kornas")}
            className={`px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold whitespace-nowrap ${
              activeTab === "penentuan_kornas"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 bg-gray-200"
            }`}
          >
            Penentuan Koordinator Nasional
          </button>
          <button
            className={`px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold ${
              activeTab === "dashboard"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 bg-gray-200"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard Grafik
          </button>
          <button
            className={`px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold ${
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
          {/* Tab: Approval */}
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
                          <tr key={user.id} className="border-t hover:bg-gray-50">
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
                                <span className="text-gray-500">Tidak Ada</span>
                              )}
                            </td>
                            <td className="p-3">
                              {(user.status === "inactive" ||
                                user.status === "nonaktif") && (
                                <button
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base"
                                  onClick={() =>
                                    approveUser(Number(user.id))
                                  }
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

          {/* Tab: Penentuan Koordinator Nasional */}
          {activeTab === "penentuan_kornas" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Penentuan Koordinator Nasional untuk Koordinator Instansi
              </h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3">Nama Koordinator Instansi</th>
                      <th className="text-left p-3">Instansi</th>
                      <th className="text-left p-3">Pilih Koordinator Nasional</th>
                      <th className="text-left p-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kornasList.length > 0 ? (
                      kornasList.map((item) => (
                        <KornasRow
                          key={item.id}
                          item={item}
                          kornasOptions={kornasOptions}
                          onAssign={handleAssignKornas}
                          assignLoading={assignLoading}
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-4 text-center text-gray-500"
                        >
                          Tidak ada koordinator instansi yang tersedia.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Dashboard Grafik */}
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

          {/* Tab: Helpdesk */}
          {activeTab === "helpdesk" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Dashboard Helpdesk
              </h2>
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
                          .sort(
                            (a, b) =>
                              new Date(b.created_at).getTime() -
                              new Date(a.created_at).getTime()
                          )
                          .map((item, idx) => (
                            <tr
                              key={idx}
                              className="border-t hover:bg-gray-50"
                            >
                              <td className="p-3">{item.nama_lengkap}</td>
                              <td className="p-3">{item.email_aktif}</td>
                              <td className="p-3">{item.instansi}</td>
                              <td className="p-3">{item.masalah}</td>
                              <td className="p-3 w-1/2">{item.pesan}</td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-4 text-center text-gray-500"
                          >
                            Tidak ada data helpdesk yang tersedia
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default DashboardPage;
