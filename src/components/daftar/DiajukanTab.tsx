'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'sonner';
import SendPolicyDialog from './SendPolicyDialog';
import PolicyTableRow from './PolicyTableRow';
import PolicyTablePagination from './PolicyTablePagination';

// Interfaces tetap sama
interface Policy {
  id: number;
  nama: string;
  tanggal: string;
  file: string;
  status: string;
  proses: string;
  nilai_akhir: string;
  nilai_akhir_verif?: string;
}

// Fungsi fetcher untuk SWR
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function DiajukanTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Tambah state untuk menyimpan adminId
  const [adminId, setAdminId] = useState<string | null>(null);

  // Ambil dari localStorage hanya di client
  useEffect(() => {
    const id = localStorage.getItem('id');
    setAdminId(id);
  }, []);

  const { data, isLoading, mutate } = useSWR(
    adminId ? `/api/policies/${adminId}/diajukan` : null,
    fetcher
  );

  // Mapping data
  const mappedData: Policy[] = (data?.data || []).map((item: any) => ({
    id: parseInt(item.id),
    nama: item.nama_kebijakan || '-',
    tanggal: item.tanggal_berlaku
      ? new Date(item.tanggal_berlaku).toLocaleDateString('id-ID')
      : '-',
    file: item.file_url || '-',
    status: item.status || '-',
    proses: item.proses || '-',
    nilai_akhir: item.nilai_akhir || '-',
    nilai_akhir_verif: item.nilai_akhir_verif || '-',
  }));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = mappedData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(mappedData.length / itemsPerPage);

  if (!adminId) {
    return (
      <div className="text-center py-6 text-red-500">
        User ID tidak ditemukan. Silakan login kembali.
      </div>
    );
  }

  return (
    <>
      {/* Tombol Kirim Kebijakan */}
      {mappedData.length > 0 && (
        <div className="mt-6 flex justify-end">
          <SendPolicyDialog
            onSend={() => {
              toast.success('Kebijakan berhasil dikirim ke pusat');
              mutate(); // Re-fetch data
            }}
          >
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition-colors">
              <span>Kirim Kebijakan ke Koornas</span>
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
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
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
                <PolicyTableRow key={item.id} item={item} index={startIndex + index + 1} tab="diajukan" />
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