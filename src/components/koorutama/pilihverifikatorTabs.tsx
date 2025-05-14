"use client";
import React, { useState } from "react";
import AssignVerifikatorModal from "./AssignVerifikatorModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface VerifikatorData {
  no: number;
  instansi: string;
  total: number;
  validator: string;
  id: string;
}

interface Props {
  data: VerifikatorData[];
  search: string;
  currentPage: number;
  totalPages: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (page: number) => void;
}

export default function PilihVerifikatorTab({
  data,
  search,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const ITEMS_PER_PAGE = 5;

  const filteredData = data.filter((item) =>
    item.instansi.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstansi, setSelectedInstansi] = useState<{
    id: string;
    nama: string;
  } | null>(null);

  const handleOpenModal = (instansi: { id: string; nama: string }) => {
    setSelectedInstansi(instansi);
    setIsModalOpen(true);
  };

  const handleAssignSuccess = () => {
    // Refresh data atau tampilkan notifikasi
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-100 text-gray-800 font-semibold">
            <tr>
              <th className="px-6 py-3 border-b">No</th>
              <th className="px-6 py-3 border-b">Nama Instansi</th>
              <th className="px-6 py-3 border-b text-center">Total Menunggu Validasi</th>
                <th className="px-6 py-3 border-b text-center">verifikator</th>
              <th className="px-6 py-3 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50 transition duration-150">
                  <td className="px-6 py-4 border-b text-center">{item.no}</td>
                  <td className="px-6 py-4 border-b">{item.instansi}</td>
                  <td className="px-6 py-4 border-b text-center">{item.total}</td>
                  <td className="px-6 py-4 border-b text-center">{item.validator}</td>
                  <td className="px-6 py-4 border-b text-center">
                    <button
                      onClick={() => handleOpenModal({ id: item.id, nama: item.instansi })}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-xs"
                    >
                      Pilih Verifikator
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Tidak ada hasil ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination>
                 <PaginationPrevious
                   onClick={currentPage === 1 ? undefined : () => onPageChange(currentPage - 1)}
                   className={currentPage === 1 ? "cursor-not-allowed text-gray-400" : ""}
                 >
                   Previous
                 </PaginationPrevious>
     
                 <PaginationContent>
                   {Array.from({ length: totalPages }, (_, index) => (
                     <PaginationItem key={index}>
                       <PaginationLink
                         isActive={currentPage === index + 1}
                         onClick={() => onPageChange(index + 1)}
                       >
                         {index + 1}
                       </PaginationLink>
                     </PaginationItem>
                   ))}
                 </PaginationContent>
     
                 <PaginationNext
                   onClick={currentPage === totalPages ? undefined : () => onPageChange(currentPage + 1)}
                   className={currentPage === totalPages ? "cursor-not-allowed text-gray-400" : ""}
                 >
                   Next
                 </PaginationNext>
               </Pagination>

      {/* Modal */}
      {isModalOpen && selectedInstansi && (
        <AssignVerifikatorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          instansi={selectedInstansi}
          onAssignSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
}
