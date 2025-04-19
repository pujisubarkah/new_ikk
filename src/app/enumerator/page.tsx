"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"

// Dummy data enumerator
const dummyEnumerator = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  nama: `Enumerator ${i + 1}`,
  nip: `19780${i + 1}321000${i + 1}`,
}))

export default function TabelEnumerator() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(dummyEnumerator.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = dummyEnumerator.slice(startIndex, startIndex + itemsPerPage)

  const router = useRouter()

  return (
    <Sidebar> {/* 👈 Ini dia si Sidebar pembungkus */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Daftar Enumerator</h2>

          <Button
            onClick={() => router.push("/enumerator/tambah")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Tambah Enumerator
          </Button>
        </div>

        <div className="overflow-auto rounded-lg border mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">No</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">NIP</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-sm text-gray-500">
                    Belum ada data enumerator.
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">{startIndex + index + 1}</td>
                    <td className="px-4 py-2">{item.nama}</td>
                    <td className="px-4 py-2">{item.nip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-600">
            Menampilkan {startIndex + 1} sampai {Math.min(startIndex + itemsPerPage, dummyEnumerator.length)} dari {dummyEnumerator.length} entri
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="text-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Sebelumnya
            </Button>
            <div className="text-sm text-gray-700 px-2 font-semibold">{currentPage}</div>
            <Button
              className="border border-gray-300 text-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}

