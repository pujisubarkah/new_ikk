"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/sidebar-koor'

interface DataRow {
    no: number;
    nama: string;
    nip: string;
    wilayah: string;
}

const data: DataRow[] = [
    { no: 1, nama: 'John Doe', nip: '123456', wilayah: 'Jakarta' },
    { no: 2, nama: 'Jane Smith', nip: '654321', wilayah: 'Bandung' },
    { no: 3, nama: 'Alice Johnson', nip: '789012', wilayah: 'Surabaya' },
];

const Page = () => {
    const [search, setSearch] = useState('');
    const filteredData = data.filter(
        (row) =>
            row.nama.toLowerCase().includes(search.toLowerCase()) ||
            row.nip.includes(search) ||
            row.wilayah.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <Sidebar>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Daftar Koordinator Instansi</h1>
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
                            <th className="px-6 py-3 border-b">Nama</th>
                            <th className="px-6 py-3 border-b">NIP</th>
                            <th className="px-6 py-3 border-b">Wilayah Koordinasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row) => (
                            <tr key={row.no} className="hover:bg-blue-50 transition duration-150">
                                <td className="px-6 py-4 border-b text-center">{row.no}</td>
                                <td className="px-6 py-4 border-b">{row.nama}</td>
                                <td className="px-6 py-4 border-b">{row.nip}</td>
                                <td className="px-6 py-4 border-b">{row.wilayah}</td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-6 text-gray-500">
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
