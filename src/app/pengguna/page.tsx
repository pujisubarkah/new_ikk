'use client'

import { FaEdit, FaTrash } from 'react-icons/fa'
import { useState } from 'react'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar-admin'

const data = [
  {
    id: 1,
    nama: 'Dinas Komunikasi dan Informatika',
    nip: '123456789',
    instansi: 'Pemprov Jawa Barat',
    wilayah: 'Wilayah I',
    status: 'Aktif',
  },
  {
    id: 2,
    nama: 'Badan Kepegawaian Negara',
    nip: '987654321',
    instansi: 'Pusat',
    wilayah: 'Wilayah II',
    status: 'Nonaktif',
  },
  {
    id: 3,
    nama: 'Kementerian Pendidikan',
    nip: '456789123',
    instansi: 'Kementerian Pusat',
    wilayah: 'Wilayah III',
    status: 'Aktif',
  },
  {
    id: 4,
    nama: 'Dinas Kesehatan',
    nip: '112233445',
    instansi: 'Pemprov Kalimantan',
    wilayah: 'Wilayah IV',
    status: 'Aktif',
  },
  {
    id: 5,
    nama: 'Kementerian Keuangan',
    nip: '998877665',
    instansi: 'Pusat',
    wilayah: 'Wilayah V',
    status: 'Nonaktif',
  },
]

const tabs = ['Koordinator Utama', 'Koordinator Instansi', 'Admin Instansi', 'Enumerator']

export default function TabelInstansi() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Koordinator Utama')

  const handleEdit = (nama: string) => {
    alert(`Edit ${nama}`)
  }

  const handleDelete = (nama: string) => {
    const konfirmasi = confirm(`Yakin ingin menghapus ${nama}?`)
    if (konfirmasi) {
      alert(`Berhasil menghapus ${nama}`)
      // Implementasi hapus bisa ditambahkan di sini
    }
  }

  // Dummy filter berdasarkan tab (nanti ganti sesuai field role kalau ada)
  const filteredData = data
    .filter(item => item.nama.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(item => {
      if (activeTab === 'Koordinator Utama') return item.id === 1
      if (activeTab === 'Koordinator Instansi') return item.id === 2
      if (activeTab === 'Admin Instansi') return item.id === 3
      if (activeTab === 'Enumerator') return item.id === 4 || item.id === 5
      return true
    })

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        {/* Add any child components or content here */}
        <></>
      </Sidebar>

      <div className="flex-1 p-6 bg-gray-50">
        <Header />

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Data Pengguna</h1>
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => alert('Tambah Instansi')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Tambah Pengguna
              </button>
              <input
                type="text"
                placeholder="Cari Nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">No</th>
                  <th className="px-4 py-2 border">Nama</th>
                  <th className="px-4 py-2 border">NIP</th>
                  <th className="px-4 py-2 border">Nama Instansi</th>
                  <th className="px-4 py-2 border">Wilayah Koordinasi</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{index + 1}</td>
                    <td className="px-4 py-2 border">{item.nama}</td>
                    <td className="px-4 py-2 border text-center">{item.nip}</td>
                    <td className="px-4 py-2 border">{item.instansi}</td>
                    <td className="px-4 py-2 border text-center">{item.wilayah}</td>
                    <td className="px-4 py-2 border text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'Aktif'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border text-center space-x-2">
                      <button
                        onClick={() => handleEdit(item.nama)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.nama)}
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
              <div className="text-center py-4 text-gray-500">Data tidak ditemukan.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
