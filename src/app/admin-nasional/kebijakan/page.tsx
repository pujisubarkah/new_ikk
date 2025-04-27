'use client'

import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import Sidebar from '@/components/sidebar-admin'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Pagination } from '@/components/ui/pagination'  // Ganti dengan path yang sesuai

export default function TabelInstansi() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  interface Instansi {
    instansi_id: { instansi_id: string };
    instansi_name: string;
  }
  
  const [instansiData, setInstansiData] = useState<Instansi[]>([]) // State untuk menyimpan data instansi
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25 // Menampilkan 5 data per halaman

  // Fetch data instansi saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/policies/list_instansi')
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await res.json()
        setInstansiData(data) // Update state dengan data yang diterima
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter data berdasarkan pencarian
  const filteredData = instansiData.filter(item =>
    item.instansi_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Mendapatkan data untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  // Fungsi untuk menangani perubahan halaman
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

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

  if (loading) {
    return <div>Loading...</div> // Tampilkan loading spinner atau pesan
  }

  if (error) {
    return <div>Error: {error}</div> // Tampilkan error jika ada
  }

  // Menghitung jumlah halaman
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <Sidebar>
      <div className="flex-1 p-6">
        <div className="max-w-20xl bg-white p-6 rounded-lg shadow-md">
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

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left">No</th>
                  <th className="px-4 py-2 border text-left">Nama Instansi</th>
                  <th className="px-4 py-2 border text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.instansi_id.instansi_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{item.instansi_name}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">
                        Reset Populasi
                      </button>
                      <button className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded">
                        Reset Verifikasi
                      </button>
                      <button
                        onClick={() => handleLihat(item.instansi_id.instansi_id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

         {/* Pagination - Komponen Pagination */}
         <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          </div>
        </div>
      </div>
    </Sidebar>
  )
}
