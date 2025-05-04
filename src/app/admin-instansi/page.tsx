"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar-inst";
import { withRoleGuard } from '@/lib/withRoleGuard';
import { FaEdit, FaTrashAlt, FaSpinner } from 'react-icons/fa';
import axios from "axios";

// Types
interface AdminData {
  no: number;
  nama: string;
  nip: string;
  instansi: string;
  admin_instansi_id: string;
}

interface EnumeratorData {
  enumerator_id: string;
  name: string;
  nip: string;
  unit_kerja: string;
}

interface KoorinstansiData {
  koorinstansi_id: string;
  name: string;
  work_unit: string;
  koordinator_instansi: any[];
}

function AdminInstansiPage() {
  const [search, setSearch] = useState("");
  const [adminData, setAdminData] = useState<AdminData[]>([]);
  const [activeTab, setActiveTab] = useState<"admin" | "enumerator">("admin");
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");
  const [selectedKoordinator, setSelectedKoordinator] = useState<string>(""); // Added this line
  const [koorinstansiData, setKoorinstansiData] = useState<KoorinstansiData[]>([]);
  const [enumerators, setEnumerators] = useState<EnumeratorData[]>([]);
  const [loading, setLoading] = useState({
    admin: false,
    enumerator: false
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Ambil validator_id dari localStorage
  const validatorId = typeof window !== "undefined" ? localStorage.getItem("id") : null;

  // Fetch data admin dari API
  useEffect(() => {
    if (!validatorId) return;
    setLoading(prev => ({ ...prev, admin: true }));
    setError(null);

    fetch(`/api/verifikator_koor_instansi?validator_id=${validatorId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        // Interface sesuai dengan struktur API
        interface AdminApiResponse {
          id: string;
          nama: string;
          nip: string;
          instansi: string;
        }

        // Format data agar sesuai dengan UI
        const formattedData = Array.isArray(data.koor_instansi)
          ? data.koor_instansi.map((admin: AdminApiResponse, index: number) => ({
              no: index + 1,
              nama: admin.nama,
              nip: admin.nip,
              instansi: admin.instansi,
              admin_instansi_id: admin.id
            }))
          : [];

        setAdminData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching admin data:", error);
        setError("Gagal memuat data admin");
      })
      .finally(() => setLoading(prev => ({ ...prev, admin: false })));
  }, [validatorId]);

 
 
  const handleTampilkanAnalis = async () => {
    if (!selectedKoordinator) return;
    
    setLoading(prev => ({ ...prev, enumerator: true }));
    setError(null);
    
    try {
      // Gunakan endpoint yang benar untuk mendapatkan data analis
      const response = await axios.get(`/api/koorinstansi/${selectedKoordinator}/koordinators`);
      
      // Pastikan response.data adalah array
      if (Array.isArray(response.data)) {
        // Map data dari API ke format yang diharapkan oleh komponen
        const formattedData = response.data.map(item => ({
          enumerator_id: item.id,
          name: item.name,
          nip: item.username,
          unit_kerja: item.unit_kerja
        }));
        
        setEnumerators(formattedData);
      } else {
        throw new Error("Format data tidak valid");
      }
    } catch (error) {
      console.error('Gagal mengambil data analis:', error);
      setError("Gagal memuat data analis");
      setEnumerators([]);
    } finally {
      setLoading(prev => ({ ...prev, enumerator: false }));
    }
  };

  // Filter data admin berdasarkan pencarian
  const filteredAdminData = adminData.filter((row) =>
    row.nama.toLowerCase().includes(search.toLowerCase()) ||
    row.nip.includes(search) ||
    row.instansi.toLowerCase().includes(search.toLowerCase())
  );

  // Handle edit admin
  const handleEdit = (nip: string) => {
    router.push(`/admin-instansi/ubah/${nip}`);
  };

  // Handle delete admin
  const handleDelete = async (nip: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus admin ini?")) return;
    try {
      const response = await fetch(`/api/delete-admin?id=${nip}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Failed to delete admin");
      setAdminData(adminData.filter(admin => admin.nip !== nip));
      alert("Admin berhasil dihapus");
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Gagal menghapus admin");
    }
  };

  return (
    <div className="p-6">
      <Sidebar>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === "admin" ? "Daftar Koordinator Instansi" : "Daftar Analis Instansi"}
          </h1>
          {activeTab === "admin" && (
            <button
              onClick={() => router.push("/admin-instansi/tambah")}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
            >
              Tambah Koordinator Instansi
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("admin")}
            className={`py-2 px-6 ${activeTab === "admin" 
              ? "border-b-2 border-blue-500 text-blue-600 font-medium" 
              : "text-gray-500 hover:text-gray-700"}`}
          >
            Koordinator Instansi
          </button>
          <button
            onClick={() => setActiveTab("enumerator")}
            className={`py-2 px-6 ${activeTab === "enumerator" 
              ? "border-b-2 border-blue-500 text-blue-600 font-medium" 
              : "text-gray-500 hover:text-gray-700"}`}
          >
            Analis Instansi
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Admin Tab Content */}
        {activeTab === "admin" && (
          <div>
            <div className="flex justify-end mb-4">
              <input
                type="text"
                placeholder="Cari koordinator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {loading.admin ? (
              <div className="flex justify-center items-center h-40">
                <FaSpinner className="animate-spin text-blue-500 text-2xl" />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-blue-50 text-gray-700 font-medium">
                    <tr>
                      <th className="px-6 py-3 border-b">No</th>
                      <th className="px-6 py-3 border-b">Nama</th>
                      <th className="px-6 py-3 border-b">NIP</th>
                      <th className="px-6 py-3 border-b">Nama Instansi</th>
                      <th className="px-6 py-3 border-b text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdminData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          {adminData.length === 0 ? "Tidak ada data koordinator" : "Tidak ditemukan hasil pencarian"}
                        </td>
                      </tr>
                    ) : (
                      filteredAdminData.map((row) => (
                        <tr key={row.nip} className="hover:bg-gray-50">
                          <td className="px-6 py-4 border-b text-center">{row.no}</td>
                          <td className="px-6 py-4 border-b">{row.nama}</td>
                          <td className="px-6 py-4 border-b">{row.nip}</td>
                          <td className="px-6 py-4 border-b">{row.instansi}</td>
                          <td className="px-6 py-4 border-b text-center">
                            <button
                              onClick={() => handleEdit(row.nip)}
                              className="text-blue-500 hover:text-blue-700 mr-4"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(row.nip)}
                              className="text-red-500 hover:text-red-700"
                              title="Hapus"
                            >
                              <FaTrashAlt />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

               {/* Enumerator Tab Content - Disederhanakan */}
               {activeTab === "enumerator" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <select
                value={selectedKoordinator}
                onChange={(e) => setSelectedKoordinator(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Pilih Koordinator Instansi</option>
                {adminData.map((row) => (
                  <option key={row.nip} value={row.admin_instansi_id}>
                    {row.nama} - {row.instansi}
                  </option>
                ))}
              </select>
              <button
                onClick={handleTampilkanAnalis}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-150 disabled:opacity-50"
                disabled={!selectedKoordinator}
              >
                Tampilkan Analis
              </button>
            </div>

            {loading.enumerator ? (
              <div className="flex justify-center items-center h-40">
                <FaSpinner className="animate-spin text-blue-500 text-2xl" />
              </div>
            ) : (
              selectedKoordinator && (
                <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    {/* Table header */}
                    <thead className="bg-blue-50 text-gray-700 font-medium">
                      <tr>
                        <th className="px-6 py-3 border-b">No</th>
                        <th className="px-6 py-3 border-b">Nama</th>
                        <th className="px-6 py-3 border-b">NIP</th>
                        <th className="px-6 py-3 border-b">Unit Kerja</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enumerators.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                            Tidak ada analis untuk koordinator ini
                          </td>
                        </tr>
                      ) : (
                        enumerators.map((enumerator, index) => (
                          <tr key={enumerator.enumerator_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 border-b text-center">{index + 1}</td>
                            <td className="px-6 py-4 border-b">{enumerator.name}</td>
                            <td className="px-6 py-4 border-b">{enumerator.nip}</td>
                            <td className="px-6 py-4 border-b">{enumerator.unit_kerja}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}
      </Sidebar>
    </div>
  );
}

const ProtectedPage = withRoleGuard(AdminInstansiPage, [3]);
export default function Page() {
  return <ProtectedPage />;
}
