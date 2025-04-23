'use client'
import React, { useState } from 'react'
import { Progress } from "@/components/ui/progress"
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'




const tabs = [
  { key: 'masuk', label: 'Kebijakan Masuk' },
  { key: 'diproses', label: 'Kebijakan Diproses' },
]

const KebijakanTable = () => {
  const [activeTab, setActiveTab] = useState('masuk')
    const router = useRouter()

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
      </div>

      {/* Tab Cards */}
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
        {activeTab === 'masuk' && (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3">No</th>
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Enumerator</th>
                <th className="px-6 py-3">Tanggal Berlaku</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4">Kebijakan A</td>
                <td className="px-6 py-4">Admin</td>
                <td className="px-6 py-4">2025-04-23</td>
              </tr>
              <tr className="border-t">
                <td className="px-6 py-4">2</td>
                <td className="px-6 py-4">Kebijakan B</td>
                <td className="px-6 py-4">Admin</td>
                <td className="px-6 py-4">2025-04-24</td>
              </tr>
            </tbody>
          </table>
        )}

{activeTab === 'diproses' && (
  <table className="min-w-full text-sm text-left">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="px-6 py-3">No</th>
        <th className="px-6 py-3">Nama</th>
        <th className="px-6 py-3">Enumerator</th>
        <th className="px-6 py-3">Progress</th>
        <th className="px-6 py-3">Tanggal Proses</th>
        <th className="px-6 py-3">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-t">
        <td className="px-6 py-4">1</td>
        <td className="px-6 py-4">Kebijakan C</td>
        <td className="px-6 py-4">Verifikator</td>
        <td className="px-6 py-4">
          <Progress value={60} className="h-2 w-full" />
          <span className="text-xs text-gray-500">60%</span>
        </td>
        <td className="px-6 py-4">2025-04-22</td>
        <td className="px-6 py-4">
          <button
            onClick={() => router.push("/enum/kebijakan/detail")}
            className="text-[#16578D] hover:text-blue-600"
            title="Lihat Detail"
          >
            <FileText className="w-5 h-5" />
          </button>
        </td>
      </tr>
      <tr className="border-t">
        <td className="px-6 py-4">2</td>
        <td className="px-6 py-4">Kebijakan D</td>
        <td className="px-6 py-4">Verifikator</td>
        <td className="px-6 py-4">
          <Progress value={85} className="h-2 w-full" />
          <span className="text-xs text-gray-500">85%</span>
        </td>
        <td className="px-6 py-4">2025-04-21</td>
        <td className="px-6 py-4">
          <button
            onClick={() => router.push("/enum/kebijakan/detail")}
            className="text-[#16578D] hover:text-blue-600"
            title="Lihat Detail"
          >
            <FileText className="w-5 h-5" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
)}


      </div>
    </div>
  )
}

export default KebijakanTable
