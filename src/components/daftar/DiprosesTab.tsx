'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PolicyTableRow from './PolicyTableRow';
import PolicyTablePagination from './PolicyTablePagination';

interface Policy {
    id: number;
    nama: string;
    enumerator: string;
    progress: string;
    tanggalAssign: string;
    nilai_akhir: string;
    nilai_akhir_verif?: string;
}

export default function DiprosesTab() {
    // Removed unused router variable
    const [data, setData] = useState<Policy[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const adminId = localStorage.getItem('id');
                if (!adminId) throw new Error('Admin ID tidak ditemukan');

                const res = await axios.get(`/api/policies/${adminId}/diproses`);
 const apiData = res.data?.data || [];
interface ApiPolicy {
  id: string;
  nama_kebijakan: string;
  enumerator: string;
  progress?: string;
  tanggal_proses: string;
  nilai_akhir?: string;
  nilai_akhir_verif?: string;
}

const mappedData = apiData.map((item: ApiPolicy) => ({
  id: parseInt(item.id),
  nama: item.nama_kebijakan,
  enumerator: item.enumerator,
  progress: item.progress ? `${item.progress}%` : '0%',
  tanggalAssign: formatDate(item.tanggal_proses),
  nilai_akhir: item.nilai_akhir || '0', // Default to '0' if nilai_akhir is missing
  nilai_akhir_verif: item.nilai_akhir_verif || '0',
}));

setData(mappedData);

                setData(mappedData);
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
                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Progress</th>
                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Tanggal Assign</th>
                        <th className="px-4 py-3 text-center text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="text-center py-6">
                                Memuat data...
                            </td>
                        </tr>
                    ) : currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <PolicyTableRow key={item.id} item={item} index={startIndex + index + 1} tab="diproses" showProgress showAssignDate showViewButton />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-6 text-gray-500">
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
