'use client'

import { FaEdit, FaTrash } from 'react-icons/fa'
import { useState } from 'react'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar-admin'

const wilayahData = [
  { id: 1, wilayah: 'Wilayah I' },
  { id: 2, wilayah: 'Wilayah II' },
  { id: 3, wilayah: 'Wilayah III' },
  { id: 4, wilayah: 'Wilayah IV' },
  { id: 5, wilayah: 'Wilayah V' },
]

export default function DaftarWilayah() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleEdit = (wilayah: string) => {
    alert(`Edit data untuk ${wilayah}`)
  }

  const handleDelete = (wilayah: string) => {
    const konfirmasi = confirm(`Yakin ingin menghapus ${wilayah}?`)
    if (konfirmasi) {
      alert(`Berhasil menghapus ${wilayah}`)
      // Implementasi hapus bisa ditambahkan di sini
    }
  }

  const filteredData = wilayahData.filter(item =>
    item.wilayah.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        {/* Add any valid children content here */}
       <><></></>
      </Sidebar>

      <div className="flex-1 p-6 bg-gray-50">
        <Header />

        <div className="mt-6">
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
                  <th className="px-4 py-2 border">Nama Wilayah</th>
                  <th className="px-4 py-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{index + 1}</td>
                    <td className="px-4 py-2 border">{item.wilayah}</td>
                    <td className="px-4 py-2 border text-center space-x-2">
                      <button
                        onClick={() => handleEdit(item.wilayah)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.wilayah)}
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

            {filteredData.length === 0 && (
              <div className="text-center py-4 text-gray-500">Tidak ada wilayah ditemukan.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
