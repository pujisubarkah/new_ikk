'use client'

import { FaEdit } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar-admin'

export default function TabelInstansi() {
  const [searchQuery, setSearchQuery] = useState('')
  interface Instansi {
    id: number
    name: string
  }

  const [instansiData, setInstansiData] = useState<Instansi[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20 // Update jumlah data per halaman menjadi 20

  useEffect(() => {
    // Fungsi untuk mengambil data dari API
    const fetchInstansiData = async () => {
      try {
        const response = await axios.get('/api/instansi')
        setInstansiData(response.data) // Mengambil data instansi dari API
      } catch (error) {
        console.error('Error fetching instansi data:', error)
      }
    }

    fetchInstansiData()
  }, []) // Menjalankan sekali saat komponen pertama kali dirender

  const filteredData = instansiData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar sebagai kolom kiri */}
      <Sidebar>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Daftar Instansi</h1>
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => alert('Tambah Instansi')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Tambah Instansi
              </button>
              <input
                type="text"
                placeholder="Cari Instansi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">No</th>
                  <th className="px-4 py-2 border">Nama Instansi</th>
                  <th className="px-4 py-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{index + 1}</td>
                    <td className="px-4 py-2 border">{item.name}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => alert(`Edit ${item.name}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </Sidebar>
    </div>
  )
}


