"use client";

import { useParams, useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import React, { useState } from "react";
import Sidebar from "@/components/sidebar-koor";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface KebijakanDetail {
  no: number;
  nama: string;
  progress: number;
  enumerator: string;
  tanggal: string;
  id: string;
}

const mockData: KebijakanDetail[] = [
  {
    no: 1,
    nama: "Kebijakan Vaksinasi Lansia",
    progress: 80,
    enumerator: "Andi",
    tanggal: "2024-11-01",
    id: "kebijakan-001",
  },
  {
    no: 2,
    nama: "Kebijakan Pendidikan Gratis",
    progress: 50,
    enumerator: "Budi",
    tanggal: "2024-12-15",
    id: "kebijakan-002",
  },
  {
    no: 3,
    nama: "Kebijakan Transportasi Umum",
    progress: 95,
    enumerator: "Citra",
    tanggal: "2025-01-10",
    id: "kebijakan-003",
  },
  {
    no: 4,
    nama: "Kebijakan Energi Terbarukan",
    progress: 70,
    enumerator: "Dewi",
    tanggal: "2025-02-18",
    id: "kebijakan-004",
  },
];

const itemsPerPage = 2;

const Page = () => {
  const { id } = useParams() ?? { id: "" };
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = mockData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md border-r">
        <Sidebar>
          <div>Sidebar Content</div>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Daftar Kebijakan Instansi - {decodeURIComponent(String(id))}
        </h1>

        {/* Back Button */}
        <button
          onClick={() => router.push("/koordinator-utama/daftar-kebijakan")}
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          Back
        </button>

        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-100 text-gray-800 font-semibold">
              <tr>
                <th className="px-6 py-3 border-b">No</th>
                <th className="px-6 py-3 border-b">Nama Kebijakan</th>
                <th className="px-6 py-3 border-b">Proses Penilaian</th>
                <th className="px-6 py-3 border-b">Enumerator</th>
                <th className="px-6 py-3 border-b">Tanggal Proses</th>
                <th className="px-6 py-3 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr
                  key={item.no}
                  className="hover:bg-blue-50 transition duration-150"
                >
                  <td className="px-6 py-4 border-b text-center">{item.no}</td>
                  <td className="px-6 py-4 border-b">{item.nama}</td>
                  <td className="px-6 py-4 border-b w-56">
                    <Progress value={item.progress} />
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    {item.enumerator}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    {item.tanggal}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    <button
                      onClick={() =>
                        router.push(
                          `/koordinator-utama/detail-kebijakan/${item.id}`
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-xs"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={
                    currentPage === 1
                      ? undefined
                      : () => setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""
                  }
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink>{currentPage}</PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : ""
                  }
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Page;
