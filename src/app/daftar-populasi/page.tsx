'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'

const tabs = [
  { key: 'masuk', label: 'Kebijakan Masuk' },
  { key: 'proses', label: 'Kebijakan Proses' },
  { key: 'selesai', label: 'Kebijakan Selesai' },
]

const KebijakanTable = () => {
  const [activeTab, setActiveTab] = useState('masuk')
  const router = useRouter()

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 text-blue-800 rounded-xl shadow p-4 text-center">
          <p className="text-sm font-medium">Kebijakan Masuk</p>
          <p className="text-3xl font-bold mt-1">12</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 rounded-xl shadow p-4 text-center">
          <p className="text-sm font-medium">Kebijakan Diproses</p>
          <p className="text-3xl font-bold mt-1">8</p>
        </div>
        <div className="bg-green-100 text-green-800 rounded-xl shadow p-4 text-center">
          <p className="text-sm font-medium">Kebijakan Selesai</p>
          <p className="text-3xl font-bold mt-1">5</p>
        </div>
        <div className="bg-red-100 text-red-800 rounded-xl shadow p-4 text-center">
          <p className="text-sm font-medium">Kebijakan Ditolak</p>
          <p className="text-3xl font-bold mt-1">2</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`cursor-pointer w-48 text-center p-3 rounded-lg shadow transition-all ${
              activeTab === tab.key
                ? 'bg-[#16578D] text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <p className="text-sm font-medium">{tab.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">No</th>
              <th className="px-6 py-3">Nama Instansi</th>
              <th className="px-6 py-3">Total Kebijakan</th>
              <th className="px-6 py-3">Tanggal Diajukan</th>
              {activeTab !== 'selesai' && <th className="px-6 py-3">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-6 py-4">1</td>
              <td className="px-6 py-4">Dinas Kesehatan</td>
              <td className="px-6 py-4">3</td>
              <td className="px-6 py-4">2025-04-23</td>
              {activeTab !== 'selesai' && (
                <td className="px-6 py-4">
                  <button
                    onClick={() => router.push('/detail/kebijakan/1')}
                    className="text-[#16578D] hover:text-blue-600"
                    title="Lihat Detail"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                </td>
              )}
            </tr>
            <tr className="border-t">
              <td className="px-6 py-4">2</td>
              <td className="px-6 py-4">Dinas Pendidikan</td>
              <td className="px-6 py-4">5</td>
              <td className="px-6 py-4">2025-04-22</td>
              {activeTab !== 'selesai' && (
                <td className="px-6 py-4">
                  <button
                    onClick={() => router.push('/detail/kebijakan/2')}
                    className="text-[#16578D] hover:text-blue-600"
                    title="Lihat Detail"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default KebijakanTable
