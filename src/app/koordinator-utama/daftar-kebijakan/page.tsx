"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/sidebar-koor';
import { useRouter } from 'next/navigation';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination";

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
    { no: 4, nama: 'Bob Brown', nip: '345678', wilayah: 'Medan' },
    { no: 5, nama: 'Charlie White', nip: '901234', wilayah: 'Bali' },
    { no: 6, nama: 'Diana Green', nip: '567890', wilayah: 'Yogyakarta' },
];

const ITEMS_PER_PAGE = 3;

const Page = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    const handleClick = (wilayah: string) => {
        const wilayahId = encodeURIComponent(wilayah);
        router.push(`/koordinator-utama/daftar-kebijakan/${wilayahId}`);
    };

    const filteredData = data.filter(
        (row) =>
            row.nama.toLowerCase().includes(search.toLowerCase()) ||
            row.nip.includes(search) ||
            row.wilayah.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                                <th className="px-6 py-3 border-b text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((row) => (
                                <tr key={row.no} className="hover:bg-blue-50 transition duration-150">
                                    <td className="px-6 py-4 border-b text-center">{row.no}</td>
                                    <td className="px-6 py-4 border-b">{row.nama}</td>
                                    <td className="px-6 py-4 border-b">{row.nip}</td>
                                    <td className="px-6 py-4 border-b">{row.wilayah}</td>
                                    <td className="px-6 py-4 border-b text-center">
                                        <button
                                            onClick={() => handleClick(row.wilayah)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-xs"
                                        >
                                            Lihat Wilayah
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-500">
                                        Tidak ada hasil yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <Pagination>
                        <PaginationPrevious
                            className={currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}
                            onClick={currentPage === 1 ? undefined : () => handlePageChange(Math.max(1, currentPage - 1))}
                        >
                            Previous
                        </PaginationPrevious>
                        <PaginationContent>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        onClick={() => handlePageChange(index + 1)}
                                        isActive={currentPage === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                        </PaginationContent>
                        <PaginationNext
                            onClick={currentPage === totalPages ? undefined : () => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}
                        >
                            Next
                        </PaginationNext>
                    </Pagination>
                </div>
            </Sidebar>
        </div>
    );
};

export default Page;

