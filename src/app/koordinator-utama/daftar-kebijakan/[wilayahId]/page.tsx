"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Kebijakan {
  no: number;
  instansi: string;
  total: number;
  tanggal: string;
  detail: string;
}

const mockData: Kebijakan[] = [
  { no: 1, instansi: "Dinas Kesehatan", total: 5, tanggal: "2024-12-01", detail: "Kebijakan tentang vaksinasi, protokol kesehatan..." },
  { no: 2, instansi: "Dinas Pendidikan", total: 3, tanggal: "2025-01-15", detail: "Kurikulum Merdeka, Bantuan Sekolah..." },
  { no: 3, instansi: "Dinas Perhubungan", total: 2, tanggal: "2025-02-20", detail: "Peraturan lalu lintas, transportasi umum..." },
];

const Page = () => {
  const params = useParams();
  const wilayahId = params?.wilayahId || "Unknown";
  const [search, setSearch] = useState("");
  const [expandedRow] = useState<number | null>(null);
  const router = useRouter(); // useRouter untuk navigasi

  const filteredData = mockData.filter(
    (item) =>
      item.instansi.toLowerCase().includes(search.toLowerCase()) ||
      item.tanggal.includes(search)
  );

  const handleViewDetails = (instansiId: number) => {
    router.push(`/koordinator-utama/daftar-kebijakan-instansi/${instansiId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Kebijakan - {decodeURIComponent(String(wilayahId))}</h1>
        <input
          type="text"
          placeholder="Cari instansi atau tanggal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-100 text-gray-800 font-semibold">
            <tr>
              <th className="px-6 py-3 border-b">No</th>
              <th className="px-6 py-3 border-b">Nama Instansi</th>
              <th className="px-6 py-3 border-b">Total Kebijakan</th>
              <th className="px-6 py-3 border-b">Tanggal Diajukan</th>
              <th className="px-6 py-3 border-b text-center">Detail</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <React.Fragment key={item.no}>
                <tr className="hover:bg-blue-50 transition duration-150">
                  <td className="px-6 py-4 border-b text-center">{item.no}</td>
                  <td className="px-6 py-4 border-b">{item.instansi}</td>
                  <td className="px-6 py-4 border-b text-center">{item.total}</td>
                  <td className="px-6 py-4 border-b text-center">{item.tanggal}</td>
                  <td className="px-6 py-4 border-b text-center">
                    <button
                      onClick={() => handleViewDetails(item.no)} // Navigasi ke halaman instansi
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-xs"
                    >
                      Lihat
                    </button>
                  </td>
                </tr>
                {expandedRow === item.no && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 border-b bg-blue-50 text-sm text-gray-600">
                      {item.detail}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Tidak ada hasil yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
