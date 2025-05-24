'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar-koornas';
import KebijakanMasukTab from '@/components/koorutama/KebijakanMasukTab';
import KebijakanDiprosesTab from '@/components/koorutama/KebijakanProsesTab';
import KebijakanSelesaiTab from '@/components/koorutama/KebijakanSelesaiTab';

// Interface untuk data kebijakan
interface Kebijakan {
  no: number;
  instansi: string;
  total: number;
  validator?: string;
  id: string;
  status: 'masuk' | 'diproses' | 'selesai' | 'validasi';
}

interface APIResponseItem {
  agency_id_panrb: string;
  agency_name: string;
  total: number;
  status: string;
  validator?: string;
}

interface APIResponse {
  data: APIResponseItem[];
}

const ITEMS_PER_PAGE = 5;

// Fungsi fetcher untuk SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Gagal mengambil data dari API');
    return res.json();
  });
export default function Page() {
  const router = useRouter();
  // State
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'masuk' | 'diproses' | 'selesai'>('masuk');

  // Ambil ID dari localStorage
  const id = typeof window !== 'undefined' ? localStorage.getItem('id') : null;

  // Gunakan SWR untuk fetching data berdasarkan ID
  const { data, error } = useSWR<APIResponse>(id ? `/api/koornas/${id}/policy` : null, fetcher);

  // Format data
  const formattedData: Kebijakan[] = data
    ? data.data.map((item: APIResponseItem, index: number) => ({
        no: index + 1,
        instansi: item.agency_name || '-',
        total: item.total || 0,
        validator: item.validator || '-',
        id: item.agency_id_panrb || '',
        status: item.status as Kebijakan['status'] || 'masuk',
      }))
    : [];

  // Filter data
  const filteredByTab = formattedData.filter((item) =>
    activeTab === 'diproses'
      ? item.status === 'diproses' || item.status === 'validasi'
      : item.status === activeTab
  );

  const filteredBySearch = filteredByTab.filter((item) =>
    item.instansi.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredBySearch.length / ITEMS_PER_PAGE);
  const paginatedData = filteredBySearch.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Sidebar>
      <div className="w-full px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 md:space-x-4 mb-6 md:mb-8 overflow-x-auto">
          <button
            className={`px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold whitespace-nowrap ${
              activeTab === 'masuk'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 bg-gray-200'
            }`}
            onClick={() => {
              setActiveTab('masuk');
              setCurrentPage(1);
            }}
          >
            Kebijakan Masuk
          </button>
          <button
            className={`px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold whitespace-nowrap ${
              activeTab === 'diproses'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 bg-gray-200'
            }`}
            onClick={() => {
              setActiveTab('diproses');
              setCurrentPage(1);
            }}
          >
            Kebijakan Diproses
          </button>
          <button
            className={`px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold whitespace-nowrap ${
              activeTab === 'selesai'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 bg-gray-200'
            }`}
            onClick={() => {
              setActiveTab('selesai');
              setCurrentPage(1);
            }}
          >
            Kebijakan Selesai
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Cari instansi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Tombol Kembali */}
        <div className="mb-4">
          <button
            onClick={() => router.push('/koordinator-utama/daftar-kebijakan')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Kembali
          </button>
        </div>

        {/* Render Tab Content */}
        {activeTab === 'masuk' && (
          <KebijakanMasukTab
            data={paginatedData}
            loading={!data && !error}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {activeTab === 'diproses' && (
          <KebijakanDiprosesTab
            data={paginatedData}
            loading={!data && !error}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {activeTab === 'selesai' && (
          <KebijakanSelesaiTab
            data={paginatedData}
            loading={!data && !error}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Sidebar>
  );
}