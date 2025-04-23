'use client'

import { FaEdit, FaTrash } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/sidebar-admin'
import axios from 'axios'

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
      // axios.delete(`/api/wilayah/${id}`)
    }
  }

  const filteredData = wilayahData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar>
      
        <div className="flex-1 ml-64 p-6 mt-20">
      <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Daftar Wilayah Koordinasi</h1>
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => alert('Tambah Wilayah')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Tambah Wilayah
              </button>
              <input
                type="text"
                placeholder="Cari Wilayah..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1) // reset ke halaman pertama saat cari
                }}
                className="p-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Memuat data...</div>
            ) : (
              <>
                <table className="table-auto w-full border border-gray-300 rounded-lg shadow">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border">No</th>
                      <th className="px-4 py-2 border">Nama Wilayah</th>
                      <th className="px-4 py-2 border">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-2 border">{item.name}</td>
                        <td className="px-4 py-2 border text-center space-x-2">
                          <button
                            onClick={() => handleEdit(item.name)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item.name)}
                            className="text-red-600 hover:text-red-800"
                            title="Hapus"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredData.length > itemsPerPage && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-600 border border-blue-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {!loading && filteredData.length === 0 && (
              <div className="text-center py-4 text-gray-500">Tidak ada wilayah ditemukan.</div>
            )}
          </div>
        </div>
      </Sidebar>
    </div>
  )
}
