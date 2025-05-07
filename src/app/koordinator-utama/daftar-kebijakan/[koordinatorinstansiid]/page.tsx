"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar-koornas";
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
  id: string;
}

interface APIResponseItem {
  agencies: {
    nama_instansi: string;
    Total_kebijakan: number;
    policies: { tanggal_diajukan: string }[];
  };
  agency_id: string;
}

const ITEMS_PER_PAGE = 5;

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const koordinatorinstansiid = params?.koordinatorinstansiid || "Unknown";

  const [data, setData] = useState<Kebijakan[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/koordinator-instansi-agency?koordinator_instansi_id=${koordinatorinstansiid}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");

        const result: APIResponseItem[] = await response.json();
        const formattedData: Kebijakan[] = result.map((item, index) => {
          const policy = item.agencies?.policies?.[0];
          return {
            no: index + 1,
            instansi: item.agencies?.nama_instansi || "-",
            total: item.agencies?.Total_kebijakan || 0,
            tanggal: policy?.tanggal_diajukan?.split("T")[0] || "-",
            id: item.agency_id,
          };
        });

        setData(formattedData);
      } catch {
        // You can handle errors in this block, or just omit the error handling altogether.
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [koordinatorinstansiid]);

  const filteredData = data.filter((item) =>
    item.instansi.toLowerCase().includes(search.toLowerCase()) ||
    item.tanggal.includes(search)
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleBack = () => router.push("/koordinator-utama/daftar-kebijakan");

  return (
        <Sidebar>
        <div className="w-full px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Daftar Kebijakan - {decodeURIComponent(String(koordinatorinstansiid))}
          </h1>
          <input
            type="text"
            placeholder="Cari instansi atau tanggal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <button
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Kembali
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
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.no} className="hover:bg-blue-50 transition duration-150">
                    <td className="px-6 py-4 border-b text-center">{item.no}</td>
                    <td className="px-6 py-4 border-b">{item.instansi}</td>
                    <td className="px-6 py-4 border-b text-center">{item.total}</td>
                    <td className="px-6 py-4 border-b text-center">{item.tanggal}</td>
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
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      Tidak ada hasil yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.no} className="hover:bg-blue-50 transition duration-150">
                  <td className="px-6 py-4 border-b text-center">{item.no}</td>
                  <td className="px-6 py-4 border-b">{item.instansi}</td>
                  <td className="px-6 py-4 border-b text-center">{item.total}</td>
                  <td className="px-6 py-4 border-b text-center">{item.tanggal}</td>
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
      </Sidebar>
  );
};

export default Page;
