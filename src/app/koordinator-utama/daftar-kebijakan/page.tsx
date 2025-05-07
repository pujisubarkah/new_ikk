"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar-koor';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import axios from 'axios';

interface DataRow {
    no: number;
    nama: string;
    nip: string;
    koordinatorinstansiid: string; // <-- Tambah ini
  }

const ITEMS_PER_PAGE = 5;

const Page = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [koordinatorData, setKoordinatorData] = useState<DataRow[]>([]);
    const router = useRouter();

   
    const handleClick = (koordinatorinstansiid: string) => {
        const encodedId = encodeURIComponent(koordinatorinstansiid); // ✅ encode yang dikirim ke parameter
        router.push(`/koordinator-utama/daftar-kebijakan/${encodedId}`);
    };

    useEffect(() => {
        const fetchKoordinatorData = async () => {
            const id = localStorage.getItem('id');
            if (id) {
                try {
                    const response = await axios.get(`/api/koordinator_utama?id=${id}`);
                    const data: Array<{ name: string; username: string; coordinator_instansi_id: string }> = response.data;

                    // Format data sesuai dengan struktur yang diinginkan
                    setKoordinatorData(
                        data.map((item, index) => ({
                          no: index + 1,
                          nama: item.name,
                          nip: item.username,
                          koordinatorinstansiid: item.coordinator_instansi_id, // <-- Ambil ID-nya
                        }))
                      );
                } catch (error) {
                    console.error('Error fetching koordinator data:', error);
                }
            }
        };

        fetchKoordinatorData();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    // Filter data based on search input
    const filteredData = koordinatorData.filter(
        (row) =>
            (row.nama?.toLowerCase().includes(search.toLowerCase()) || '') ||
            (row.nip?.includes(search) || '') 
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
            <Sidebar>
                <div className="w-full px-6 py-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Daftar Tim Verifikasi</h1>
                    <input
                        type="text"
                        placeholder="Cari..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead className="text-center">NIP/No Identitas</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((row) => (
                                <TableRow key={row.no} className="hover:bg-blue-50 transition duration-150">
                                    <TableCell className="text-center">{row.no}</TableCell>
                                    <TableCell>{row.nama}</TableCell>
                                    <TableCell className="text-center">{row.nip}</TableCell>
                                    <TableCell className="text-center">
                                    <Button
  onClick={() => handleClick(row.koordinatorinstansiid)} // ✅ Panggil pakai ID
  className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
>
  Lihat Tim Verifikasi
</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {paginatedData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                        Tidak ada hasil yang ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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
            </div>
            </Sidebar>
    );
};

export default Page;
