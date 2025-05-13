'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PolicyTableRow from './PolicyTableRow';
import PolicyTablePagination from './PolicyTablePagination';

interface Policy {
    id: number;
    nama: string;
    enumerator: string;
    nilai: string;
    nilai_akhir: string; // Added to match the required property in PolicyTableRow
}

interface FetchedPolicy {
    id: string | number;
    nama_kebijakan: string;
    enumerator: string;
    proses: string;
    nilai_akhir: number;
}

export default function SelesaiTab() {
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

                const res = await axios.get(`/api/policies/${adminId}/selesai`);
                const fetched: FetchedPolicy[] = res.data?.data || [];

                const mapped: Policy[] = fetched.map((item) => ({
                    id: Number(item.id),
                    nama: item.nama_kebijakan || '-',
                    enumerator: item.enumerator || 'Tidak tersedia',
                    nilai: item.nilai_akhir !== undefined ? item.nilai_akhir.toString() : '-',
                    nilai_akhir: item.nilai_akhir !== undefined ? item.nilai_akhir.toString() : '-', // Added to match Policy interface
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
                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Nilai Self Assesment</th>
                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Nilai Hasil Verifikasi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr>
                            <td colSpan={4} className="text-center py-6">
                                Memuat data...
                            </td>
                        </tr>
                    ) : currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <PolicyTableRow
                                key={item.id}
                                item={item}
                                index={startIndex + index + 1}
                                tab="selesai"
                                showAnalysist
                                showScore
                                showViewButton
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center py-6 text-gray-500">
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
