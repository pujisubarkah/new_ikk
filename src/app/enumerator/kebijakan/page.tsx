'use client'
import React, { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar-enum"

// Define the Policy interface with strict status types
interface Policy {
  id: string;
  name: string;
  enumerator: string;
  status_kebijakan: 'MASUK' | 'PROSES';
  tanggal_berlaku?: string;
  tanggal_proses?: string;
  progress_pengisian?: number;
}

const tabs = [
  { key: 'masuk', label: 'Kebijakan Masuk' },
  { key: 'diproses', label: 'Kebijakan Diproses' },
]

export default function KebijakanTable() {
  const [activeTab, setActiveTab] = useState('masuk')
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true)
        const enumeratorId = typeof window !== 'undefined' ? localStorage.getItem('id') : null;
        if (!enumeratorId) throw new Error("ID Enumerator tidak ditemukan di localStorage");

        const masukRes = await fetch(`/api/policies/${enumeratorId}/masuk`)
        const prosesRes = await fetch(`/api/policies/${enumeratorId}/proses`)
        const masukData: { data: MasukPolicy[] } = await masukRes.json()
        const prosesData: { data: ProsesPolicy[] } = await prosesRes.json()

        interface MasukPolicy {
          id: string;
          nama_kebijakan: string;
          enumerator: string;
          tanggal_berlaku?: string;
        }

        interface ProsesPolicy {
          id: string;
          nama_kebijakan: string;
          enumerator: string;
          progress: string;
        }

        // Explicitly type the mapped objects to match Policy interface
        const masukPolicies: Policy[] = (masukData.data || []).map((item) => ({
          id: item.id,
          name: item.nama_kebijakan,
          enumerator: item.enumerator,
          tanggal_berlaku: item.tanggal_berlaku,
          status_kebijakan: 'MASUK' as const // Explicitly type as 'MASUK'
        }))
        
        const prosesPolicies: Policy[] = (prosesData.data || []).map((item) => ({
          id: item.id,
          name: item.nama_kebijakan,
          enumerator: item.enumerator,
          progress_pengisian: Number(item.progress),
          status_kebijakan: 'PROSES' as const, // Explicitly type as 'PROSES'
          tanggal_proses: new Date().toISOString()
        }))
        
        setPolicies([...masukPolicies, ...prosesPolicies])
      } catch (err) {
        console.error('Error fetching policies:', err)
        setError('Gagal memuat data')
        setPolicies([])
      } finally {
        setLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  const filteredPolicies = policies.filter(policy =>
    activeTab === 'masuk' ? policy.status_kebijakan === 'MASUK' : policy.status_kebijakan === 'PROSES'
  )

  const countMasuk = policies.filter(p => p.status_kebijakan === 'MASUK').length
  const countDiproses = policies.filter(p => p.status_kebijakan === 'PROSES' && (p.progress_pengisian || 0) < 100).length
  const countSelesai = policies.filter(p => p.status_kebijakan === 'PROSES' && (p.progress_pengisian || 0) === 100).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }
  
  return (
    <Sidebar>
      <div className="w-full px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200 shadow-sm">
            <CardHeader className="pb-3">
              <p className="text-base font-medium text-blue-800">Kebijakan Masuk</p>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-900">{countMasuk}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200 shadow-sm">
            <CardHeader className="pb-3">
              <p className="text-base font-medium text-yellow-800">Kebijakan Diproses</p>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-900">{countDiproses}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200 shadow-sm">
            <CardHeader className="pb-3">
              <p className="text-base font-medium text-green-800">Kebijakan Selesai</p>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-900">{countSelesai}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="space-x-2 mb-6 bg-white border border-blue-600 p-1 rounded-lg inline-flex">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'
                }`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {tabs.map(tab => (
            <TabsContent key={tab.key} value={tab.key}>
              <div className="overflow-auto bg-white shadow-md rounded-xl">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">No</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Nama Kebijakan</th>
                      {tab.key === 'masuk' && (
                        <>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Analis Instansi</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Tanggal Berlaku</th>
                        </>
                      )}
                      {tab.key === 'diproses' && (
                        <>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Analis Instansi</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Progress</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Tanggal Proses</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Aksi</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPolicies.map((policy, index) => (
                      <tr key={policy.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border">{index + 1}</td>
                        <td className="px-4 py-3 border">{policy.name}</td>
                        {tab.key === 'masuk' && (
                          <>
                            <td className="px-4 py-3 border">{policy.enumerator}</td>
                            <td className="px-4 py-3 border">{policy.tanggal_berlaku ? new Date(policy.tanggal_berlaku).toLocaleDateString('id-ID') : '-'}</td>
                          </>
                        )}
                        {tab.key === 'diproses' && (
                          <>
                            <td className="px-4 py-3 border">{policy.enumerator}</td>
                            <td className="px-4 py-3 border">
                              <Progress value={policy.progress_pengisian || 0} className="h-2" />
                              <span className="text-xs text-gray-500 mt-1 block text-center">{policy.progress_pengisian || 0}%</span>
                            </td>
                            <td className="px-4 py-3 border">{policy.tanggal_proses ? new Date(policy.tanggal_proses).toLocaleDateString('id-ID') : '-'}</td>
                            <td className="px-4 py-3 border">
                              <Button
                                variant="primary"
                                onClick={() => router.push(`/enumerator/kebijakan/detail/${policy.id}`)}
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Detail
                              </Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {filteredPolicies.length === 0 && (
                      <tr>
                        <td colSpan={tab.key === 'masuk' ? 4 : 6} className="px-4 py-6 text-center text-gray-500 border">
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Sidebar>
  )
}
