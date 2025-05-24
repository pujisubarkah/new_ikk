'use client';
import {  useState } from 'react';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import PolicyTableRow from './PolicyTableRow';
import PolicyTablePagination from './PolicyTablePagination';

interface Policy {
    id: number;
    nama: string;
    analis: string;
    tanggal: string;
    nilai_akhir: string;
    nilai_akhir_verif?: string;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data.data || []);

export default function DisetujuiTab() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Ambil ID admin hanya di client-side
    const adminId = typeof window !== 'undefined' ? localStorage.getItem('id') : null;

    // Gunakan SWR untuk fetching data
    const { data, error, isLoading } = useSWR(
        adminId ? `/api/policies/${adminId}/disetujui` : null,
        fetcher
    );

    // Mapping data ke format tabel
    const mappedData: Policy[] = (data || []).map((item: any, index: number) => ({
        id: parseInt(item.id),
        nama: item.nama_kebijakan || '-',
        analis: item.analis?.nama || item.nama_analis || 'Belum ditetapkan',
        tanggal: item.tanggal_berlaku
            ? new Date(item.tanggal_berlaku).toLocaleDateString('id-ID')
            : '-',
        nilai_akhir: item.nilai_akhir || '-',
        nilai_akhir_verif: item.nilai_akhir_verif || '-',
    }));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = mappedData.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(mappedData.length / itemsPerPage);

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">No</th>
                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Nama Kebijakan</th>
                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Analis Instansi</th>
                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Tanggal Berlaku</th>
                        <th className="px-4 py-3 text-center text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="text-center py-6 text-gray-500">
                                Memuat data...
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={5} className="text-center py-6 text-red-500">
                                Gagal mengambil data.
                            </td>
                        </tr>
                    ) : currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <PolicyTableRow key={item.id} item={item} index={startIndex + index + 1} showAnalyst showAction tab="disetujui" />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-6 text-gray-500">
                                Tidak ada data.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Tombol Refresh Manual */}
            <div className="p-4 flex justify-end">
                <button
                    onClick={() => {
                        const userId = localStorage.getItem('id');
                        if (userId) {
                            mutate(`/api/policies/${userId}/disetujui`);
                        }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                    Muat Ulang Data
                </button>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <PolicyTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}