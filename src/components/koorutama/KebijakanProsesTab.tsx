// components/koorutama/KebijakanDiprosesTab.tsx
import React from "react";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";

interface Props {
  data: any[];
  loading: boolean;
  error: any;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function KebijakanDiprosesTab({
  data,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const router = useRouter();

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Kebijakan Diproses</h1>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-100 text-gray-800 font-semibold">
            <tr>
              <th className="px-6 py-3 border-b">No</th>
              <th className="px-6 py-3 border-b">Nama Instansi</th>
              <th className="px-6 py-3 border-b text-center">Total Kebijakan</th>
              <th className="px-6 py-3 border-b text-center">Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-red-500">
                  Gagal memuat data.
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50 transition duration-150">
                  <td className="px-6 py-4 border-b text-center">{item.no}</td>
                  <td className="px-6 py-4 border-b">{item.instansi}</td>
                  <td className="px-6 py-4 border-b text-center">{item.total}</td>
                  <td className="px-6 py-4 border-b text-center">
                    <button
                      onClick={() =>
                        router.push(`/koordinator-utama/daftar-kebijakan-instansi/${item.id}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-xs"
                    >
                      Lihat
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Tidak ada hasil yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
      </div>
    </>
  );
}