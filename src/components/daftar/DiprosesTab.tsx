'use client';
import { useState } from 'react';
import useSWR from 'swr';
import PolicyTableRow from './PolicyTableRow';
import PolicyTablePagination from './PolicyTablePagination';

interface ApiPolicy {
  id: string;
  nama_kebijakan: string;
  enumerator: string;
  progress?: string;
  tanggal_proses: string;
  nilai_akhir?: string;
  nilai_akhir_verif?: string;
}

interface Policy {
  id: number;
  nama: string;
  enumerator: string;
  progress: string;
  tanggalAssign: string;
  nilai_akhir: string;
  nilai_akhir_verif: string;
}

// Fungsi format tanggal
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Fungsi fetcher untuk SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal memuat data');
  const data = await res.json();
  return data.data.map((item: ApiPolicy) => ({
    id: parseInt(item.id),
    nama: item.nama_kebijakan,
    enumerator: item.enumerator,
    progress: item.progress ? `${item.progress}%` : '0%',
    tanggalAssign: formatDate(item.tanggal_proses),
    nilai_akhir: item.nilai_akhir || '0',
    nilai_akhir_verif: item.nilai_akhir_verif || '',
  }));
};

export default function DiprosesTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Ambil adminId dari localStorage
  const adminId = typeof window !== 'undefined' ? localStorage.getItem('id') : null;

  // Gunakan SWR untuk fetching data
  const { data, error, isLoading } = useSWR(
    adminId ? `/api/policies/${adminId}/diproses` : null,
    fetcher
  );

  if (error) {
    console.error('Gagal memuat data:', error);
  }

  const policies = data || [];
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = policies.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(policies.length / itemsPerPage);

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
            currentData.map((item: Policy, index: number) => (
              <PolicyTableRow
                key={item.id}
                item={item}
                index={startIndex + index + 1}
                tab="diproses"
                showProgress
                showAssignDate
                showViewButton
                showAction
              />
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
