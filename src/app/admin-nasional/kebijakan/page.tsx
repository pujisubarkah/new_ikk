'use client'

import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import Sidebar from '@/components/sidebar-admin'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function TabelInstansi() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  
  interface Instansi {
    instansi_id: { instansi_id: string };
    instansi_name: string;
  }

  const [instansiData, setInstansiData] = useState<Instansi[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/policies/list_instansi')
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await res.json()
        setInstansiData(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredData = instansiData.filter(item =>
    item.instansi_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleUnduhExcel = () => {
    const aoaData = [['No', 'Nama Instansi'], ...filteredData.map((item, index) => [index + 1, item.instansi_name])]
    const worksheet = XLSX.utils.aoa_to_sheet(aoaData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Instansi')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(data, 'data_instansi.xlsx')
  }

  const handleLihat = (id: string) => {
    router.push(`/admin-nasional/kebijakan/instansi/${id}`)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <Sidebar>
      <div className="w-full px-6 py-8">
      <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Daftar Instansi</h1>
            <button
              onClick={handleUnduhExcel}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Unduh Data
            </button>
          </div>

          {/* Pencarian */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari Instansi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left">No</th>
                  <th className="px-4 py-2 border text-left">Nama Instansi</th>
                  <th className="px-4 py-2 border text-left">Aksi</th>
                </tr>
              </thead>
              {loading && <div className="text-center py-4">Memuat data...</div>}
          {error && <div className="text-center text-red-500 py-4">{error}</div>}
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.instansi_id.instansi_id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{indexOfFirstItem + index + 1}</td>
                      <td className="px-4 py-2 border">{item.instansi_name}</td>
                        <td className="px-4 py-2 border space-x-1 text-sm">
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                          Reset Populasi
                        </button>
                        <button className="bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 rounded text-xs">
                          Reset Verifikasi
                        </button>
                        <button
                          onClick={() => handleLihat(item.instansi_id.instansi_id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Lihat
                        </button>
                        </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      Data tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

        </div>
    </Sidebar>
  )
}
