"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar-koor";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

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
  { no: 4, instansi: "Dinas Sosial", total: 4, tanggal: "2025-03-10", detail: "Bantuan sosial, program keluarga harapan..." },
  { no: 5, instansi: "Dinas Pertanian", total: 6, tanggal: "2025-04-05", detail: "Program ketahanan pangan, subsidi pupuk..." },
  // Tambahkan lebih banyak data jika diperlukan
];

const ITEMS_PER_PAGE = 2;

const Page = () => {
  const params = useParams();
  const wilayahId = params?.wilayahId || "Unknown";
  const [search, setSearch] = useState("");
  const [expandedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const filteredData = mockData.filter(
    (item) =>
      item.instansi.toLowerCase().includes(search.toLowerCase()) ||
      item.tanggal.includes(search)
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewDetails = (instansiId: number) => {
    router.push(`/koordinator-utama/daftar-kebijakan-instansi/${instansiId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    router.push("/koordinator-utama/daftar-kebijakan");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md border-r">
        <Sidebar>
          {/* Add any valid children content here */}
          <><></></>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Daftar Kebijakan - {decodeURIComponent(String(wilayahId))}
          </h1>
          <input
            type="text"
            placeholder="Cari instansi atau tanggal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Back
          </button>
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
              {paginatedData.map((item) => (
                <React.Fragment key={item.no}>
                  <tr className="hover:bg-blue-50 transition duration-150">
                    <td className="px-6 py-4 border-b text-center">{item.no}</td>
                    <td className="px-6 py-4 border-b">{item.instansi}</td>
                    <td className="px-6 py-4 border-b text-center">{item.total}</td>
                    <td className="px-6 py-4 border-b text-center">{item.tanggal}</td>
                    <td className="px-6 py-4 border-b text-center">
                      <button
                        onClick={() => handleViewDetails(item.no)}
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
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Tidak ada hasil yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationPrevious
              onClick={currentPage === 1 ? undefined : () => handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? "cursor-not-allowed text-gray-400" : ""}
            >
              Previous
            </PaginationPrevious>
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
            <PaginationNext
              onClick={currentPage === totalPages ? undefined : () => handlePageChange(currentPage + 1)}
              className={currentPage === totalPages ? "cursor-not-allowed text-gray-400" : ""}
            >
              Next
            </PaginationNext>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Page;

