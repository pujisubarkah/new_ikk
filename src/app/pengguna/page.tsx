'use client'

import { FaEdit, FaTrash } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar-admin'

const tabs = ['Koordinator Utama', 'Koordinator Instansi', 'Admin Instansi', 'Enumerator']

export default function TabelInstansi() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Koordinator Utama')

  interface User {
    id: number
    name: string
    username: string
    work_unit: string
    agency_id: string
    status: string
  }

  const [data, setData] = useState<User[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/users') // Ganti sesuai endpoint kamu
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleEdit = (name: string) => {
    alert(`Edit ${name}`)
  }

  const handleDelete = (name: string) => {
    const konfirmasi = confirm(`Yakin ingin menghapus ${name}?`)
    if (konfirmasi) {
      alert(`Berhasil menghapus ${name}`)
      // Tambahkan logika delete di sini
    }
  }

  const filteredData = data
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((item) => {
      if (activeTab === 'Koordinator Utama') return item.status === 'Koordinator Utama'
      if (activeTab === 'Koordinator Instansi') return item.status === 'Koordinator Instansi'
      if (activeTab === 'Admin Instansi') return item.status === 'Admin Instansi'
      if (activeTab === 'Enumerator') return item.status === 'Enumerator'
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
                onClick={() => alert('Tambah Pengguna')}
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
                  <th className="px-4 py-2 border">Unit Kerja</th>
                  <th className="px-4 py-2 border">ID Instansi</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{index + 1}</td>
                    <td className="px-4 py-2 border">{item.name}</td>
                    <td className="px-4 py-2 border text-center">{item.username}</td>
                    <td className="px-4 py-2 border">{item.work_unit}</td>
                    <td className="px-4 py-2 border text-center">{item.agency_id}</td>
                    <td className="px-4 py-2 border text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status.toLowerCase() === 'aktif'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
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

            {filteredData.length === 0 && (
              <div className="text-center py-4 text-gray-500">Data tidak ditemukan.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
