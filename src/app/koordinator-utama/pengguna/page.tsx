"use client";
import React, { useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import classNames from 'classnames';
import Sidebar from '@/components/sidebar-koor'

interface DataRow {
    no: number;
    nama: string;
    nip: string;
    wilayah: string;
}

const dataKoordinator: DataRow[] = [
    { no: 1, nama: 'John Doe', nip: '123456', wilayah: 'Jakarta' },
    { no: 2, nama: 'Jane Smith', nip: '654321', wilayah: 'Bandung' },
    { no: 3, nama: 'Alice Johnson', nip: '789012', wilayah: 'Surabaya' },
];

const dataAdmin: DataRow[] = [
    { no: 1, nama: 'Michael Scott', nip: '987654', wilayah: 'Yogyakarta' },
    { no: 2, nama: 'Dwight Schrute', nip: '112233', wilayah: 'Semarang' },
];

const Page = () => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'koordinator' | 'admin'>('koordinator');

    const currentData = activeTab === 'koordinator' ? dataKoordinator : dataAdmin;
    const filteredData = currentData.filter(
        (row) =>
            row.nama.toLowerCase().includes(search.toLowerCase()) ||
            row.nip.includes(search) ||
            row.wilayah.toLowerCase().includes(search.toLowerCase())
    );

    const handleKeluarkan = (nama: string) => {
        alert(`Keluarkan ${nama}?`);
        // Tambahkan logic API atau lainnya di sini
    };

    const handleTambah = () => {
        alert(`Tambah ${activeTab === 'koordinator' ? 'Koordinator Instansi' : 'Admin Instansi'}`);
        // Tambahkan logika tambah data di sini
    };

    return (
        <div className="p-6">
            <Sidebar>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Daftar Pengguna -{' '}
                    {activeTab === 'koordinator' ? 'Koordinator Instansi' : 'Admin Instansi'}
                </h1>
                <input
                    type="text"
                    placeholder="Cari..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setActiveTab('koordinator')}
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
                    onClick={() => setActiveTab('admin')}
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

            {/* Tombol Tambah */}
            <div className="mb-4">
                <button
                    onClick={handleTambah}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
                >
                    Tambah {activeTab === 'koordinator' ? 'Koordinator Instansi' : 'Admin Instansi'}
                </button>
            </div>

            {/* Tabel */}
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
                        {filteredData.map((row) => (
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
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-500">
                                    Tidak ada hasil yang ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
                </Sidebar>
        </div>
    );
};

export default Page;
