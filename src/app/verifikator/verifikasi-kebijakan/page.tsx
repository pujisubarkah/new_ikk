'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaCheckCircle } from 'react-icons/fa'
import Sidebar from '@/components/sidebar-verif'
import axios from 'axios'

// Interfaces
interface MasukPolicy {
  agency_id_panrb: string
  instansi: string
  total_kebijakan: number
}

interface PolicyInProses {
  id: string
  nama_kebijakan: string
  sektor: string
  policy_status: string
  file_url: string
}

interface SelesaiPolicy {
  agency_id: number
  instansi: string
  nilai_self_assessment: number
  nilai_verifikator: number
  kebijakan: {
    nama_kebijakan: string
    nilai_self_assessment: number
    nilai_verifikator: number
  }[]
}

// Tabs
const tabs = [
  { key: 'masuk', label: 'Kebijakan Masuk' },
  { key: 'proses', label: 'Kebijakan Proses' },
  { key: 'selesai', label: 'Kebijakan Selesai' },
]

export default function KebijakanTable() {
  const [activeTab, setActiveTab] = useState<'masuk' | 'proses' | 'selesai'>('masuk')
  const [masukData, setMasukData] = useState<MasukPolicy[]>([])
  const [prosesData, setProsesData] = useState<PolicyInProses[]>([])
  const [selesaiData, setSelesaiData] = useState<SelesaiPolicy[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTabFromUrl = searchParams ? (searchParams.get('tab') as 'masuk' | 'proses' | 'selesai' | null) : null

  // Set activeTab jika ada query param ?tab=...
  useEffect(() => {
    if (initialTabFromUrl && ['masuk', 'proses', 'selesai'].includes(initialTabFromUrl)) {
      setActiveTab(initialTabFromUrl)
    }
  }, [initialTabFromUrl])

  // Fetch data berdasarkan tab aktif
  useEffect(() => {
    const koordinatorInstansiId = localStorage.getItem('id')
    if (koordinatorInstansiId) {
      fetchData(koordinatorInstansiId, activeTab)
    }
  }, [activeTab])

  const fetchData = async (koordinatorInstansiId: string, tab: string) => {
    setLoading(true)
    try {
      if (tab === 'masuk') {
        const response = await axios.get(`/api/verifikator/${koordinatorInstansiId}/masuk`)
        setMasukData(response.data)
      } else if (tab === 'proses') {
        const response = await axios.get(`/api/verifikator/${koordinatorInstansiId}/proses`)
        setProsesData(response.data?.data || [])
      } else if (tab === 'selesai') {
        const response = await axios.get(`/api/verifikator/${koordinatorInstansiId}/selesai`)
        setSelesaiData(response.data)
      }
    } catch (error) {
      console.error(`Error fetching ${tab} data:`, error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sidebar>
      <div className="w-full px-4 md:px-8 py-6 md:py-10 bg-gray-50 min-h-screen">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <SummaryCard title="Kebijakan Masuk" value={masukData.length} color="blue" textColor="white" />
            <SummaryCard title="Kebijakan Diproses" value={prosesData.length} color="amber" textColor="white" />
            <SummaryCard title="Kebijakan Selesai" value={selesaiData.reduce((acc, curr) => acc + curr.kebijakan.length, 0)} color="green" textColor="white" />
          </div>

          {/* Tabs Navigation */}
          <div className="flex space-x-2 md:space-x-4 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'masuk' | 'proses' | 'selesai')}
                className={`px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-white text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table Section */}
          <h2 className="text-xl md:text-2xl font-bold mb-4">Daftar Kebijakan</h2>
          <div className="overflow-x-auto rounded-lg border mt-4 bg-white shadow-sm">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {/* Tab: Masuk */}
                {activeTab === 'masuk' && (
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-blue-100 text-gray-800 font-semibold">
                      <tr>
                        <th className="px-6 py-3 border-b">No</th>
                        <th className="px-6 py-3 border-b">Nama Instansi</th>
                        <th className="px-6 py-3 border-b">Total Kebijakan</th>
                       
                      </tr>
                    </thead>
                    <tbody>
                      {masukData.length > 0 ? (
                        masukData.map((policy, index) => (
                          <tr key={policy.agency_id_panrb || index} className="hover:bg-blue-50 transition duration-150">
                            <td className="px-6 py-4 border-b text-center">{index + 1}</td>
                            <td className="px-6 py-4 border-b">{policy.instansi}</td>
                            <td className="px-6 py-4 border-b text-center">{policy.total_kebijakan}</td>
                      
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-4 text-gray-500">
                            Tidak ada kebijakan masuk saat ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* Tab: Proses */}
                {activeTab === 'proses' && (
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-blue-100 text-gray-800 font-semibold">
                      <tr>
                        <th className="px-6 py-3 border-b">No</th>
                        <th className="px-6 py-3 border-b">Nama Kebijakan</th>
                        <th className="px-6 py-3 border-b">Sektor</th>
                        <th className="px-6 py-3 border-b">File</th>
                        <th className="px-6 py-3 border-b">Status</th>
                        <th className="px-6 py-3 border-b text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prosesData.length > 0 ? (
                        prosesData.map((item, index) => (
                          <tr key={item.id} className="hover:bg-blue-50 transition duration-150">
                            <td className="px-6 py-4 border-b text-center">{index + 1}</td>
                            <td className="px-6 py-4 border-b">{item.nama_kebijakan}</td>
                            <td className="px-6 py-4 border-b">{item.sektor}</td>
                            <td className="px-6 py-4 border-b">
                              <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                Lihat File
                              </a>
                            </td>
                            <td className="px-6 py-4 border-b">
                              {item.policy_status === "MENUNGGU_VALIDASI_KU" ? "Menunggu Validasi" : item.policy_status}
                            </td>
                            <td className="px-6 py-4 border-b text-center">
                              <button
                                onClick={() => router.push(`/verifikator/verifikasi/${item.id}`)}
                                className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs mx-auto"
                              >
                                <FaCheckCircle /> Verifikasi
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-4 text-gray-500">
                            Tidak ada kebijakan dalam proses saat ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* Tab: Selesai */}
                {activeTab === 'selesai' && (
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">No</th>
                        <th className="p-3 text-left">Nama Instansi</th>
                        <th className="p-3 text-left">Nama Kebijakan</th>
                        <th className="p-3 text-left">Nilai Self Assessment</th>
                        <th className="p-3 text-left">Total SA per Instansi</th>
                        <th className="p-3 text-left">Nilai Verifikator</th>
                        <th className="p-3 text-left">Total Verifikator per Instansi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selesaiData.length > 0 ? (
                        selesaiData.map((instansiItem, instansiIndex) => {
                          const totalSA = instansiItem.nilai_self_assessment || 0
                          const totalVerif = instansiItem.nilai_verifikator || 0
                          return instansiItem.kebijakan.map((policy, policyIndex) => (
                            <tr key={`${instansiIndex}-${policyIndex}`} className="border-t hover:bg-gray-50">
                              {policyIndex === 0 ? (
                                <>
                                  <td rowSpan={instansiItem.kebijakan.length} className="p-3 align-top">
                                    {instansiIndex + 1}
                                  </td>
                                  <td rowSpan={instansiItem.kebijakan.length} className="p-3 align-top font-medium">
                                    {instansiItem.instansi}
                                  </td>
                                </>
                              ) : null}
                              <td className="p-3">{policy.nama_kebijakan}</td>
                              <td className="p-3 text-center">{policy.nilai_self_assessment}</td>
                              {policyIndex === 0 ? (
                                <td rowSpan={instansiItem.kebijakan.length} className="p-3 text-center align-top">
                                  {totalSA}
                                </td>
                              ) : null}
                              <td className="p-3 text-center">{policy.nilai_verifikator}</td>
                              {policyIndex === 0 ? (
                                <td rowSpan={instansiItem.kebijakan.length} className="p-3 text-center align-top">
                                  {totalVerif}
                                </td>
                              ) : null}
                            </tr>
                          ))
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-gray-500">
                            Tidak ada data untuk tab ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  )
}

// Component Summary Card
interface SummaryCardProps {
  title: string
  value: number
  color: string
  textColor: string
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, color, textColor }) => {
  const getBgGradient = () => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-700'
      case 'amber': return 'from-yellow-500 to-yellow-700'
      case 'green': return 'from-green-500 to-green-700'
      case 'red': return 'from-red-500 to-red-700'
      default: return 'from-gray-500 to-gray-700'
    }
  }

  return (
    <div className={`bg-gradient-to-br ${getBgGradient()} text-${textColor} rounded-xl shadow-lg p-4 md:p-6 transform transition-transform hover:scale-105 hover:shadow-xl`}>
      <p className="text-sm font-medium uppercase tracking-wide">{title}</p>
      <p className="text-3xl md:text-4xl font-extrabold mt-2">{value}</p>
    </div>
  )
}