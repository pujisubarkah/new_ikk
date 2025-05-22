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

interface SelesaiPolicy {
  agency_id: number;
  instansi: string;
  nilai_self_assessment: number;
  nilai_verifikator: number;
  kebijakan: {
    nama_kebijakan: string;
    nilai_self_assessment: number;
    nilai_verifikator: number;
  }[];
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
  // const [data, setData] = useState<PolicyData[]>([])
  const [masukData, setMasukData] = useState<MasukPolicy[]>([]) 
  const [prosesData, setProsesData] = useState<Agency[]>([])
  const [selesaiData, setSelesaiData] = useState<SelesaiPolicy[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalKebijakanMasuk: 0,
    totalProses: 0,
    totalDisetujui: 0,
    totalDitolak: 0,
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
        const response = await axios.get(`/api/verifikator/${koordinatorInstansiId}/masuk`)
        setMasukData(response.data)
      } else if (tab === 'proses') {
        const response = await axios.get(`/api/verifikator/${koordinatorInstansiId}/proses`)
        setProsesData(response.data)
      } else if (tab === 'selesai') {
        const response = await axios.get(`/api/verifikator/${koordinatorInstansiId}/selesai`)
        setSelesaiData(response.data)
      } else {
        // Unused code for fetching agency data removed to resolve unused variable error
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
      <div className="w-full px-4 md:px-8 py-6 md:py-10 bg-gray-50 min-h-screen">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <SummaryCard title="Kebijakan Masuk" value={stats.totalKebijakanMasuk} color="blue" textColor="white" />
            <SummaryCard title="Kebijakan Diproses" value={stats.totalProses} color="amber" textColor="white" />
            <SummaryCard title="Kebijakan Selesai" value={stats.totalDisetujui} color="green" textColor="white" />
          </div>

          {/* Tabs */}
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

          {/* Table */}
          <h2 className="text-xl md:text-2xl font-bold mb-4">Daftar Kebijakan</h2>
          <div className="overflow-x-auto rounded-lg border mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {activeTab === 'masuk' && (
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">No</th>
                        <th className="p-3 text-left">Nama Instansi</th>
                        <th className="p-3 text-left">Total Kebijakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masukData.length > 0 ? (
                        masukData.map((policy, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{policy.instansi}</td>
                            <td className="p-3 text-center">{policy.total_kebijakan}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-gray-500">
                            Tidak ada kebijakan masuk saat ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {activeTab === 'proses' && (
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">No</th>
                        <th className="p-3 text-left">Nama Instansi</th>
                        <th className="p-3 text-left">Total Kebijakan</th>
                        <th className="p-3 text-left">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prosesData.length > 0 ? (
                        prosesData.map((agency, index) => (
                          <tr key={agency.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{agency.name}</td>
                            <td className="p-3 text-center">{agency.total}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => router.push(`/detail/kebijakan/${agency.id}`)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Lihat Detail"
                              >
                                <FileText className="w-5 h-5 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-gray-500">
                            Tidak ada data untuk tab ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

              {activeTab === 'selesai' && (
  <table className="w-full table-auto">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-3 text-left">No</th>
        <th className="p-3 text-left">Nama Instansi</th>
        <th className="p-3 text-left">Nama Kebijakan</th>
        <th className="p-3 text-left">Nilai Self Assessment</th>
        <th className="p-3 text-left">Total Nilai SA per Instansi</th>
        <th className="p-3 text-left">Nilai Verifikator</th>
        <th className="p-3 text-left">Total Nilai Verifikator per Instansi</th>
      </tr>
    </thead>
    <tbody>
      {selesaiData.length > 0 ? (
        selesaiData.map((instansiItem, instansiIndex) => {
          const totalSA = instansiItem.nilai_self_assessment || 0
          const totalVerif = instansiItem.nilai_verifikator || 0

          return instansiItem.kebijakan.map((policy, policyIndex) => (
            <tr key={`${instansiIndex}-${policyIndex}`} className="border-t hover:bg-gray-50">
              {/* Hanya tampilkan nama instansi di baris pertama */}
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

// -- STYLE UNTUK SUMMARY CARD --
interface SummaryCardProps {
  title: string;
  value: number;
  color: string;
  textColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, color, textColor }) => {
  const getBgGradient = () => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-700'
      case 'yellow': return 'from-yellow-500 to-yellow-700'
      case 'green': return 'from-green-500 to-green-700'
      case 'red': return 'from-red-500 to-red-700'
      case 'purple': return 'from-purple-500 to-purple-700'
      default: return 'from-gray-500 to-gray-700'
    }
  }

  return (
    <div
      className={`bg-gradient-to-br ${getBgGradient()} text-${textColor} rounded-xl shadow-lg p-4 md:p-6 transform transition-transform hover:scale-105 hover:shadow-xl`}
    >
      <p className="text-sm font-medium uppercase tracking-wide">{title}</p>
      <p className="text-3xl md:text-4xl font-extrabold mt-2">{value}</p>
    </div>
  )
}

export default KebijakanTable
