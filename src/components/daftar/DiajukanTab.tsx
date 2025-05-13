'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SendPolicyDialog from './SendPolicyDialog';
import PolicyTableRow from './PolicyTableRow';
import PolicyTablePagination from './PolicyTablePagination';

interface Policy {
    id: number;
    nama: string;
    tanggal: string;
    file: string;
    status: string;
}

export default function DiajukanTab() {
    const router = useRouter();
    const [data, setData] = useState<Policy[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Fetch data dari API
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const adminId = localStorage.getItem('id');
                if (!adminId) throw new Error('Admin ID tidak ditemukan');

                const res = await axios.get(`/api/policies/${adminId}/diajukan`);
                const fetched = res.data?.data || [];

                const mapped = fetched.map((item: any) => ({
                    id: parseInt(item.id),
                    nama: item.nama_kebijakan || '-',
                    tanggal: item.tanggal_berlaku
                        ? new Date(item.tanggal_berlaku).toLocaleDateString('id-ID')
                        : '-',
                    file: item.file_url || '-',
                    status: item.status || '-'
                }));

                setData(mapped);
            } catch (err) {
                console.error('Gagal mengambil data:', err);
                toast.error('Gagal memuat daftar kebijakan diajukan');
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPolicies();
    }, []);

    return (
        <>
            {/* Tombol Kirim Kebijakan */}
            {data.length > 0 && (
                <div className="mt-6 flex justify-end">
                    <SendPolicyDialog
                        onSend={() => {
                            toast.success('Kebijakan berhasil dikirim ke pusat');
                            // Refresh atau redirect jika dibutuhkan
                        }}
                    >
                        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition-colors">
                            <span>Kirim Kebijakan ke Pusat</span>
                        </button>
                    </SendPolicyDialog>
                </div>
            )}

            {/* Tabel Daftar Kebijakan */}
            <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">No</th>
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Nama Kebijakan</th>
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">Tanggal Berlaku</th>
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider border-r">File</th>
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
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
                                <PolicyTableRow key={item.id} item={item} index={startIndex + index + 1} tab="diajukan" />
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <PolicyTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </>
    );
}