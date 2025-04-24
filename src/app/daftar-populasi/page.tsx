'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import Sidebar from '@/components/sidebar-inst'

import {
  Pagination, PaginationContent, PaginationItem,
  PaginationPrevious, PaginationNext
} from "@/components/ui/pagination"

const tabs = [
  { key: 'masuk', label: 'Kebijakan Masuk' },
  { key: 'proses', label: 'Kebijakan Proses' },
  { key: 'selesai', label: 'Kebijakan Selesai' },
]

const KebijakanTable = () => {
  const [activeTab, setActiveTab] = useState('masuk')
  const router = useRouter()

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <Sidebar>
        <></>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 p-20">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-200 text-blue-800 rounded-xl shadow p-4 text-center">
            <p className="text-sm font-medium">Kebijakan Masuk</p>
            <p className="text-3xl font-bold mt-1">12</p>
          </div>
          <div className="bg-blue-100 text-blue-700 rounded-xl shadow p-4 text-center">
            <p className="text-sm font-medium">Kebijakan Diproses</p>
            <p className="text-3xl font-bold mt-1">8</p>
          </div>
          <div className="bg-blue-50 text-blue-600 rounded-xl shadow p-4 text-center">
            <p className="text-sm font-medium">Kebijakan Selesai</p>
            <p className="text-3xl font-bold mt-1">5</p>
          </div>
          <div className="bg-blue-300 text-blue-900 rounded-xl shadow p-4 text-center">
            <p className="text-sm font-medium">Kebijakan Ditolak</p>
            <p className="text-3xl font-bold mt-1">2</p>
          </div>
        </div>

        {/* Title for Tabs */}
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Daftar Populasi</h2>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer w-48 text-center p-3 rounded-lg shadow transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-blue-300 text-blue-600 hover:bg-blue-100'
              }`}
            >
              <p className="text-sm font-medium">{tab.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-xl mb-6">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-100 text-blue-700">
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
                      className="text-blue-600 hover:text-blue-800"
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
                      className="text-blue-600 hover:text-blue-800"
                      title="Lihat Detail"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  </td>
                )}
              </tr>
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4">
            <Pagination>
              <div className="justify-end flex w-full">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <a
                      href="#"
                      className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700"
                    >
                      1
                    </a>
                  </PaginationItem>
                  <PaginationItem>
                    <a
                      href="#"
                      className="px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-100 text-blue-700"
                    >
                      2
                    </a>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </div>
            </Pagination>
          </div>
        </div>
      </main>
    </div>
  )
}

export default KebijakanTable

