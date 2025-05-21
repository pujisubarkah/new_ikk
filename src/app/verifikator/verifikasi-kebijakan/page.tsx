'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import Sidebar from '@/components/sidebar-verif'
import axios from 'axios'

interface Agency {
  id: number;
  name: string;
  total: number;
  names: Record<string, number>;
}

interface MasukPolicy {
  agency_id_panrb: string;
  instansi: string;
  total_kebijakan: number;
}

interface PolicyData {
  agencies: Agency[];
  totalKebijakanMasuk: number;
}

const tabs = [
  { key: 'masuk', label: 'Kebijakan Masuk' },
  { key: 'proses', label: 'Kebijakan Proses' },
  { key: 'selesai', label: 'Kebijakan Selesai' },
]

const KebijakanTable = () => {
  const [activeTab, setActiveTab] = useState<'masuk' | 'proses' | 'selesai'>('masuk')
  const [data, setData] = useState<PolicyData[]>([])
  const [masukData, setMasukData] = useState<MasukPolicy[]>([]) // New state for masuk data
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalKebijakanMasuk: 0,
    totalProses: 0,
    totalDisetujui: 0,
    totalDitolak: 0, // Still here in case needed elsewhere
  })
  const router = useRouter()

  useEffect(() => {
    const koordinatorInstansiId = localStorage.getItem('id')
    if (koordinatorInstansiId) {
      fetchPolicies(koordinatorInstansiId, activeTab)
      fetchStats(koordinatorInstansiId)
    }
  }, [activeTab])

  const fetchPolicies = async (koordinatorInstansiId: string, tab: string) => {
    setLoading(true)
    try {
      if (tab === 'masuk') {
        // Handle masuk tab separately
        const verifikatorId = koordinatorInstansiId
        const response = await axios.get(`/api/verifikator/${verifikatorId}/masuk`)
        setMasukData(response.data)
      } else {
        // For other tabs, use the original endpoint
        const response = await axios.get(`/api/koordinator-instansi/agency`, {
          params: { koordinator_instansi_id: koordinatorInstansiId },
        })
        const result = response.data

        if (result.data) {
          const tabData = result.data.map((item: PolicyData) => {
            const agencyData = item.agencies.filter((agency: Agency) => {
              switch (tab) {
                case 'proses':
                  return agency.names['DISETUJUI'] > 0
                case 'selesai':
                  return agency.names['DITOLAK'] > 0
                default:
                  return true
              }
            })
            return { ...item, agencies: agencyData }
          })
          setData(tabData)
        }
      }
    } catch (error) {
      console.error('Error fetching policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async (koordinatorInstansiId: string) => {
    try {
      const response = await fetch(`/api/koordinator-instansi/agency?koordinator_instansi_id=${koordinatorInstansiId}`)
      const data = await response.json()

      const agencyData = data.data?.[0]
      if (agencyData) {
        setStats({
          totalProses: agencyData.totalProses,
          totalDisetujui: agencyData.totalDisetujui,
          totalDitolak: agencyData.totalDitolak,
          totalKebijakanMasuk: agencyData.totalKebijakanMasuk,
        })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <Sidebar>
      <main className="flex-1 p-8 md:p-20">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Di sini berubah dari "Kebijakan Diajukan" menjadi "Kebijakan Masuk" */}
          <SummaryCard title="Kebijakan Masuk" value={stats.totalKebijakanMasuk} color="blue-200" textColor="blue-800" />
          <SummaryCard title="Kebijakan Diproses" value={stats.totalProses} color="blue-100" textColor="blue-700" />
          <SummaryCard title="Kebijakan Selesai" value={stats.totalDisetujui} color="blue-50" textColor="blue-600" />
        </div>

        {/* Tabs */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Daftar Kebijakan</h2>
        <div className="flex space-x-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'masuk' | 'proses' | 'selesai')}
              className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading data...</p>
          ) : (
            <table className="table-auto w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">No</th>
                  <th className="px-4 py-2 border">Nama Instansi</th>
                  <th className="px-4 py-2 border">Total Kebijakan</th>
                  {activeTab !== 'selesai' && <th className="px-4 py-2 border">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'masuk' ? (
                  masukData.map((policy, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-center">{index + 1}</td>
                      <td className="px-4 py-2 border">{policy.instansi}</td>
                      <td className="px-4 py-2 border text-center">{policy.total_kebijakan}</td>
                      <td className="px-4 py-2 border text-center">
                        <button
                          onClick={() => router.push(`/verifikator/verifikasi-kebijakan/detail/${policy.agency_id_panrb}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Lihat Detail"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  data.flatMap((item, index) =>
                    item.agencies.map((agency, agencyIndex) => {
                      if (
                        (activeTab === 'proses' && agency.names['DISETUJUI'] > 0) ||
                        (activeTab === 'selesai' && agency.names['DITOLAK'] > 0)
                      ) {
                        return (
                          <tr key={`${index}-${agencyIndex}`} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border text-center">{agencyIndex + 1}</td>
                            <td className="px-4 py-2 border">{agency.name}</td>
                            <td className="px-4 py-2 border text-center">
                              {activeTab === 'proses' ? agency.names['DISETUJUI'] : agency.names['DITOLAK']}
                            </td>
                            {activeTab !== 'selesai' && (
                              <td className="px-4 py-2 border text-center">
                                <button
                                  onClick={() => router.push(`/detail/kebijakan/${agency.id}`)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Lihat Detail"
                                >
                                  <FileText className="w-5 h-5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        )
                      }
                      return null
                    })
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </Sidebar>
  )
}

interface SummaryCardProps {
  title: string;
  value: number;
  color: string;
  textColor: string;
}

const SummaryCard = ({ title, value, color, textColor }: SummaryCardProps) => (
  <div className={`bg-${color} text-${textColor} rounded-xl shadow p-4 text-center`}>
    <p className="text-sm font-medium">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
)

export default KebijakanTable