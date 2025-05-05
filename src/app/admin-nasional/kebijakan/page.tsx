'use client'

import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import Sidebar from '@/components/sidebar-admin'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FaEye } from 'react-icons/fa'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"

export default function TabelInstansi() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  
  interface Instansi {
    instansi_year: { instansi_year: string } | null
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
    item.instansi_name?.toLowerCase().includes(searchTerm.toLowerCase())
    || (item.instansi_year?.instansi_year ?? '').toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Cari Instansi / Tahun..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
              <TableHead className="text-gray-600">No</TableHead>
              <TableHead className="text-gray-600">Nama Instansi</TableHead>
              <TableHead className="text-center text-gray-600">Tahun Penilaian</TableHead>
              <TableHead className="text-center text-gray-600">Aksi</TableHead>
              </TableRow>
            </TableHeader>
              {loading && <div className="text-center py-4">Memuat data...</div>}
              {error && <div className="text-center text-red-500 py-4">{error}</div>}
              <TableBody>
              {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <TableRow 
                key={item.instansi_id.instansi_id}
                className="hover:bg-gray-50">
                <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                <TableCell>{item.instansi_name}</TableCell>
                <TableCell className='text-center'>{item.instansi_year?.instansi_year || '-'}</TableCell>
                <TableCell>
                  {/*}
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs shadow">
                Reset Populasi
                </button>
                <button className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded text-xs shadow">
                Reset Verifikasi
                </button>
                */}
                <div className="flex justify-center">
                  <button
                  onClick={() => handleLihat(item.instansi_id.instansi_id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-1 rounded text-xs shadow flex items-center justify-center space-x-2"
                  >
                  <FaEye />
                  <span>Lihat</span>
                  </button>
                </div>
                </TableCell>
                </TableRow>
              ))
              ) : (
                <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  Tidak ada data tersedia.
                </TableCell>
              </TableRow>
              )}
              </TableBody>
              </Table>
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
            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
              const page = Math.max(1, currentPage - 2) + index;
              if (page > totalPages) return null;
              return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {page}
              </button>
              );
            })}
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
