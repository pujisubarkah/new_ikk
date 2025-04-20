'use client'

import { FaEdit } from 'react-icons/fa'
import { useState } from 'react'
import Header from '@/components/header'

const data = [
  { id: 1, nama: 'Dinas Komunikasi dan Informatika' },
  { id: 2, nama: 'Badan Kepegawaian Negara' },
  { id: 3, nama: 'Kementerian Pendidikan' },
  { id: 4, nama: 'Dinas Kesehatan' },
  { id: 5, nama: 'Kementerian Keuangan' },
]

export default function TabelInstansi() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = data.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen">
      {/* Konten utama sebagai kolom kanan */}
      <div className="flex-1 p-6 bg-gray-50">
        <Header />

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
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{index + 1}</td>
                    <td className="px-4 py-2 border">{item.nama}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => alert(`Edit ${item.nama}`)}
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
        </div>
      </div>
    </div>
  )
}
