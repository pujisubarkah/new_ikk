'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PolicyTableRow from './PolicyTableRow';
import PolicyTablePagination from './PolicyTablePagination';

interface Policy {
    id: number;
    nama: string;
    analis: string;
    tanggal: string;
    nilai_akhir: string;
}

export default function DisetujuiTab() {
    // Removed unused router variable
    const [data, setData] = useState<Policy[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const adminId = localStorage.getItem('id');
                if (!adminId) throw new Error('Admin ID tidak ditemukan');

                const res = await axios.get(`/api/policies/${adminId}/disetujui`);
                const fetched = res.data?.data || [];
                interface FetchedPolicy {
                    id: string;
                    nama_kebijakan?: string;
                    analis?: { nama: string };
                    nama_analis?: string;
                    tanggal_berlaku?: string;
                    nilai_akhir?: string;
                }

                const mapped = fetched.map((item: FetchedPolicy) => ({
                    id: parseInt(item.id),
                    nama: item.nama_kebijakan || '-',
                    analis: item.analis?.nama || item.nama_analis || 'Belum ditetapkan',
                    tanggal: item.tanggal_berlaku
                        ? new Date(item.tanggal_berlaku).toLocaleDateString('id-ID')
                        : '-',
                    nilai_akhir: item.nilai_akhir || '-',
                }));

                setData(mapped);
            } catch (err) {
                console.error('Gagal mengambil data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPolicies();
    }, []);

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
                            <td colSpan={5} className="text-center py-6">
                                Memuat data...
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
