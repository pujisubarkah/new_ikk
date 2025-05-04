"use client";
import React, { useState, useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import classNames from "classnames";
import Sidebar from "@/components/sidebar-koor";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DataRow {
    no: number;
    nama: string;
    nip: string;
    wilayah: string;
    validator_id?: string;
    work_unit?: string;
}

interface ValidatorData {
    validator_id: string;
    name: string;
    work_unit: string;
    koordinator_instansi?: {
        id: string;
        name: string;
        username: string;
    }[];
}

const Page = () => {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"koordinator" | "admin">("koordinator");
    const [selectedKoordinator, setSelectedKoordinator] = useState("");
    const [koordinatorData, setKoordinatorData] = useState<DataRow[]>([]);
    const [validatorData, setValidatorData] = useState<ValidatorData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fetchKoordinatorData = async () => {
            const id = localStorage.getItem("id");
            if (id) {
                try {
                    setIsLoading(true);
                    const response = await axios.get(`/api/koordinator_utama?id=${id}`);
                    const formattedData = response.data.map((item: any, index: number) => ({
                        no: index + 1,
                        nama: item.name,
                        nip: item.username,
                        wilayah: item.coordinator_type_name,
                        validator_id: item.validator_id,
                        work_unit: item.work_unit
                    }));
                    setKoordinatorData(formattedData);
                } catch (error) {
                    console.error("Error fetching koordinator data:", error);
                    alert("Gagal memuat data koordinator");
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchKoordinatorData();
    }, []);


    const handleTampilkanAdmin = async () => {
        try {
          const response = await axios.get(`/api/validator/${selectedKoordinator}/koordinators`);
      
          // Membungkus response.data ke dalam bentuk yang sesuai dengan struktur yang kamu butuhkan
        setValidatorData([{
            validator_id: selectedKoordinator, // Menggunakan ID yang dipilih
            name: 'Default Name', // Tambahkan nilai default untuk properti name
            work_unit: 'Nama Instansi', // Ganti dengan data yang sesuai, misal dari API atau state lain
            koordinator_instansi: response.data // Data koordinator yang didapat dari API
        }]);
      
          console.log("Data validator diset:", response.data);
        } catch (error) {
          console.error('Gagal mengambil data koordinator instansi:', error);
        }
      };
      

    const handleKeluarkan = (nama: string) => {
        if (confirm(`Yakin ingin mengeluarkan ${nama}?`)) {
            // Implementasi logika pengeluaran
            console.log(`Mengeluarkan ${nama}`);
        }
    };

    const handleTambah = () => {
        if (activeTab === "koordinator") {
          router.push("/koordinator-utama/verifikator/tambah"); // untuk Tim Verifikasi
        } else {
          router.push("/koordinator-utama/pengguna/tambah"); // untuk Koordinator Instansi
        }
      }
      

    // Filter data dengan debounce
    const filteredKoordinatorData = koordinatorData.filter(
        (row) =>
            row.nama.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            row.nip.includes(debouncedSearch) ||
            (row.wilayah || "").toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return (
        <Sidebar>
            <div className="w-full px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Daftar {activeTab === "koordinator" ? "Tim Verifikasi" : "Koordinator Instansi"}
                    </h1>
                    <div className="flex items-center gap-4">
                        <Button 
                            onClick={handleTambah} 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
                        >
                            Tambah {activeTab === "koordinator" ? "Tim Verifikasi" : "Koordinator Instansi"}
                        </Button>
                        <Input
                            type="text"
                            placeholder="Cari Nama..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-60"
                        />
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => {
                            setActiveTab("koordinator");
                            setSearch("");
                        }}
                        className={classNames(
                            "px-4 py-2 rounded-lg transition duration-150",
                            activeTab === "koordinator"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                    >
                        Tim Verifikasi
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("admin");
                            setSearch("");
                            setSelectedKoordinator("");
                            setValidatorData([]);
                        }}
                        className={classNames(
                            "px-4 py-2 rounded-lg transition duration-150",
                            activeTab === "admin"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                    >
                        Koordinator Instansi
                    </button>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* Tabel tim verifikator */}
                {!isLoading && activeTab === "koordinator" && (
                    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-blue-100 text-gray-800 font-semibold">
                                <tr>
                                    <th className="px-6 py-3 border-b">No</th>
                                    <th className="px-6 py-3 border-b">Nama</th>
                                    <th className="px-6 py-3 border-b">NIP</th>
                                    <th className="px-6 py-3 border-b">Wilayah Koordinasi</th>
                                    <th className="px-6 py-3 border-b text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredKoordinatorData.length > 0 ? (
                                    filteredKoordinatorData.map((row) => (
                                        <tr key={`${row.no}-${row.nip}`} className="hover:bg-blue-50 transition duration-150">
                                            <td className="px-6 py-4 border-b text-center">{row.no}</td>
                                            <td className="px-6 py-4 border-b">{row.nama}</td>
                                            <td className="px-6 py-4 border-b">{row.nip}</td>
                                            <td className="px-6 py-4 border-b">{row.wilayah}</td>
                                            <td className="px-6 py-4 border-b text-center">
                                                <button
                                                    onClick={() => handleKeluarkan(row.nama)}
                                                    className="text-red-600 hover:text-red-800 flex items-center justify-center gap-1 transition duration-150"
                                                >
                                                    <FaSignOutAlt className="text-lg" />
                                                    <span className="hidden sm:inline">Keluarkan</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6 text-gray-500">
                                            Tidak ada hasil yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tabel koordinator instansi */}
                {!isLoading && activeTab === "admin" && (
                    <div className="admin-tab">
                        <div className="flex items-center gap-4 mb-4">
                            <select
                                value={selectedKoordinator}
                                onChange={(e) => setSelectedKoordinator(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Pilih Tim Verifikasi</option>
                                {koordinatorData.map((item) => (
                                    item.validator_id && (
                                        <option key={item.validator_id} value={item.validator_id}>
                                            {item.nama} - {item.work_unit}
                                        </option>
                                    )
                                ))}
                            </select>
                            <button
                                onClick={handleTampilkanAdmin}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-150 disabled:opacity-50"
                                disabled={!selectedKoordinator}
                            >
                                Tampilkan
                            </button>
                        </div>

                        {validatorData.length > 0 ? (
  <div className="overflow-x-auto rounded-lg shadow-md bg-white">
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="bg-blue-100 text-gray-800 font-semibold">
        <tr>
          <th className="px-6 py-3 border-b">No</th>
          <th className="px-6 py-3 border-b">Nama Instansi</th>
          <th className="px-6 py-3 border-b">Nama</th>
          <th className="px-6 py-3 border-b">NIP</th>
        </tr>
      </thead>
      <tbody>
        {validatorData.flatMap((validator, validatorIndex) =>
          (validator.koordinator_instansi || []).map((instansi, instansiIndex) => (
            <tr key={`${validator.validator_id}-${instansi.id}`} className="hover:bg-blue-50 transition duration-150">
              <td className="px-6 py-4 border-b text-center">{instansiIndex + 1}</td>
              <td className="px-6 py-4 border-b">{validator.work_unit || 'Instansi tidak tersedia'}</td>
              <td className="px-6 py-4 border-b">{instansi.name || 'Nama tidak tersedia'}</td>
              <td className="px-6 py-4 border-b">{instansi.username || 'NIP tidak tersedia'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
                        ) : selectedKoordinator ? (
                            <div className="text-center py-6 text-gray-500">
                                Tidak ada data koordinator instansi yang ditemukan.
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                Silakan pilih tim verifikasi dan klik tombol tampilkan.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Sidebar>
    );
};

export default Page;
