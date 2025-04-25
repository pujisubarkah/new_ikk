"use client";
import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import classNames from 'classnames';
import Sidebar from '@/components/sidebar-koor';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface DataRow {
    no: number;
    nama: string;
    nip: string;
    wilayah: string;
}

const Page = () => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'koordinator' | 'admin'>('koordinator');
    const [selectedKoordinator, setSelectedKoordinator] = useState('');
    const [showAdminTable, setShowAdminTable] = useState(false);
    const [koordinatorData, setKoordinatorData] = useState<DataRow[]>([]);
    const [adminData] = useState<DataRow[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchKoordinatorData = async () => {
            const id = localStorage.getItem('id');
            if (id) {
                try {
                    const response = await axios.get(`/api/koordinator_utama?id=${id}`);
                    const data: Array<{ name: string; username: string; coordinator_type_name: string }> = response.data;

                    // Format data sesuai dengan struktur yang diinginkan
                    setKoordinatorData(
                        data.map((item, index) => ({
                            no: index + 1,
                            nama: item.name,
                            nip: item.username,
                            wilayah: item.coordinator_type_name,
                        }))
                    );
                } catch (error) {
                    console.error('Error fetching koordinator data:', error);
                }
            }
        };

        fetchKoordinatorData();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    

    const filteredKoordinatorData = koordinatorData.filter(
        (row) =>
            row.nama.toLowerCase().includes(search.toLowerCase()) ||
            row.nip.includes(search) ||
            (row.wilayah || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleKeluarkan = (nama: string) => {
        alert(`Keluarkan ${nama}?`);
        // Tambahkan logic API atau lainnya di sini
    };

    const handleTambah = () => {
        router.push('/koordinator-utama/pengguna/tambah');
    };

    const handleTampilkanAdmin = () => {
        if (selectedKoordinator) {
            setShowAdminTable(true);
        }
    };

    return (
        <div className="p-6">
            <Sidebar>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Daftar Pengguna -{' '}
                            {activeTab === 'koordinator' ? 'Koordinator Instansi' : 'Admin Instansi'}
                        </h1>
                        <button
                            onClick={handleTambah}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
                        >
                            Tambah {activeTab === 'koordinator' ? 'Koordinator Instansi' : 'Admin Instansi'}
                        </button>
                    </div>
                    {activeTab === 'koordinator' && (
                        <div className="flex justify-end">
                            <input
                                type="text"
                                placeholder="Cari..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => {
                            setActiveTab('koordinator');
                            setSearch('');
                        }}
                        className={classNames(
                            'px-4 py-2 rounded-lg font-medium transition duration-150',
                            activeTab === 'koordinator'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        )}
                    >
                        Koordinator Instansi
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('admin');
                            setSearch('');
                            setShowAdminTable(false);
                        }}
                        className={classNames(
                            'px-4 py-2 rounded-lg font-medium transition duration-150',
                            activeTab === 'admin'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        )}
                    >
                        Admin Instansi
                    </button>
                </div>

                {/* Tabel Koordinator */}
                {activeTab === 'koordinator' && (
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
                                {filteredKoordinatorData.map((row) => (
                                    <tr key={row.no} className="hover:bg-blue-50 transition duration-150">
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
                                ))}
                                {filteredKoordinatorData.length === 0 && (
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

                {/* Tabel Admin */}
                {activeTab === 'admin' && (
                    <>
                        <div className="flex items-center gap-4 mb-4">
                            <select
                                value={selectedKoordinator}
                                onChange={(e) => setSelectedKoordinator(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Pilih Koordinator Instansi</option>
                                {/* Daftar koordinator akan diisi di sini */}
                            </select>
                            <button
                                onClick={handleTampilkanAdmin}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-150"
                            >
                                Tampilkan
                            </button>
                        </div>

                        {showAdminTable && (
                            <>
                                <div className="flex justify-end mb-2">
                                    <input
                                        type="text"
                                        placeholder="Cari..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

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
                                            {adminData.map((row, index) => (
                                                <tr key={index} className="hover:bg-blue-50 transition duration-150">
                                                    <td className="px-6 py-4 border-b text-center">{row.no}</td>
                                                    <td className="px-6 py-4 border-b">{row.wilayah}</td>
                                                    <td className="px-6 py-4 border-b">{row.nama}</td>
                                                    <td className="px-6 py-4 border-b">{row.nip}</td>
                                                </tr>
                                            ))}
                                            {adminData.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-6 text-gray-500">
                                                        Tidak ada hasil yang ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </>
                )}
            </Sidebar>
        </div>
    );
};

export default Page;
