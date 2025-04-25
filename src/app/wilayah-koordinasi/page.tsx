'use client'

import { FaEdit, FaTrash } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/sidebar-admin'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function DaftarWilayah() {
  const [wilayahData, setWilayahData] = useState<{ id: number; name: string }[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  useEffect(() => {
    const fetchWilayah = async () => {
      try {
        const response = await axios.get('/api/wilayah')
        setWilayahData(response.data)
      } catch (error) {
        console.error('Gagal mengambil data wilayah:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWilayah()
  }, [])

  const handleEdit = (name: string) => {
    alert(`Edit data untuk ${name}`)
  }

  const handleDelete = (name: string) => {
    const konfirmasi = confirm(`Yakin ingin menghapus ${name}?`)
    if (konfirmasi) {
      alert(`Berhasil menghapus ${name}`)
    }
  }

  const filteredData = wilayahData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const USERS_PER_PAGE = 20

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / USERS_PER_PAGE)
  const startIndex = (currentPage - 1) * USERS_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, startIndex + USERS_PER_PAGE)

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  return (
    <Sidebar>
      <div className="w-full px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Daftar Wilayah Koordinasi</h1>
          <div className="flex space-x-4 items-center">
            <Button onClick={() => alert('Tambah Wilayah')}>Tambah Wilayah</Button>
            <Input
              placeholder="Cari Wilayah..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Memuat data...</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full border border-gray-200 rounded-md overflow-hidden">
                <thead className="bg-gray-100 text-sm font-semibold">
                  <tr>
                    <th className="px-4 py-3 border">No</th>
                    <th className="px-4 py-3 border text-left">Nama Wilayah</th>
                    <th className="px-4 py-3 border text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-2 border">{item.name}</td>
                        <td className="px-4 py-2 border text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                          onClick={() => handleEdit(item.name)}
                          className="text-blue-600 hover:text-blue-800"
                          >
                          <FaEdit />
                          </Button>
                          <Button
                          onClick={() => handleDelete(item.name)}
                          className="text-red-600 hover:text-red-800"
                          >
                          <FaTrash />
                          </Button>
                        </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
                        {filteredData.length > USERS_PER_PAGE && (
                          <div className="mt-6 flex justify-between items-center text-sm">
                            <span>
                              Halaman {currentPage} dari {totalPages}
                            </span>
                            <div className="space-x-2">
                              <Button
                                className="border border-gray-300"
                                disabled={currentPage === 1}
                                onClick={handlePrevPage}
                              >
                                Sebelumnya
                              </Button>
                              <Button
                                disabled={currentPage === totalPages}
                                onClick={handleNextPage}
                              >
                                Berikutnya
                              </Button>
                            </div>
                          </div>
                        )}
            </div>
          )}

          {!loading && filteredData.length === 0 && (
            <div className="text-center py-4 text-gray-500">Tidak ada wilayah ditemukan.</div>
          )}
        </div>
      </div>
    </Sidebar>
  )
}
