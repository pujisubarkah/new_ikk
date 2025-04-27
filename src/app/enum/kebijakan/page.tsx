'use client'
import React, { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Sidebar from "@/components/sidebar-enum"

const tabs = [
  { key: 'masuk', label: 'Kebijakan Masuk' },
  { key: 'diproses', label: 'Kebijakan Diproses' },
]

const KebijakanTable = () => {
  const [activeTab, setActiveTab] = useState('masuk')
  interface Policy {
    id: string;
    name: string;
    enumerator: string;
    status_kebijakan: string;
    tanggal_berlaku?: string;
    tanggal_proses?: string;
    progress_pengisian?: number;
  }
  
  const [policies, setPolicies] = useState<Policy[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const enumeratorId = localStorage.getItem('id')
        if (!enumeratorId) {
          console.error('Enumerator ID not found in localStorage')
          return
        }

        const response = await fetch(`/api/policies/enumerator?enumerator_id=${enumeratorId}`)
        const data = await response.json()
        setPolicies(data)
      } catch (error) {
        console.error('Failed to fetch policies:', error)
      }
    }

    fetchPolicies()
  }, [])

  const masukPolicies = policies.filter(policy => policy.status_kebijakan === 'MASUK')
  const diprosesPolicies = policies.filter(policy => policy.status_kebijakan === 'PROSES')

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar children={undefined} />

      {/* Main Content */}
      <div className="flex-1 p-20 ml-60">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-blue-100 text-blue-800">
            <CardHeader>
              <p className="text-sm font-medium">Kebijakan Masuk</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold mt-1">{masukPolicies.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-100 text-yellow-800">
            <CardHeader>
              <p className="text-sm font-medium">Kebijakan Diproses</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold mt-1">{diprosesPolicies.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-100 text-green-800">
            <CardHeader>
              <p className="text-sm font-medium">Kebijakan Selesai</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold mt-1">0</p> {/* Bisa update kalau ada data selesai */}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="flex space-x-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="cursor-pointer p-3 rounded-lg transition-all">
                <p className="text-sm font-medium">{tab.label}</p>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content Masuk */}
          <div hidden={activeTab !== 'masuk'}>
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
                {masukPolicies.map((policy, index) => (
                  <tr key={policy.id} className="border-t">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{policy.name}</td>
                    <td className="px-6 py-4">{policy.enumerator}</td>
                    <td className="px-6 py-4">{policy.tanggal_berlaku ? new Date(policy.tanggal_berlaku).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tab Content Diproses */}
          <div hidden={activeTab !== 'diproses'}>
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
                {diprosesPolicies.map((policy, index) => (
                  <tr key={policy.id} className="border-t">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{policy.name}</td>
                    <td className="px-6 py-4">{policy.enumerator}</td>
                    <td className="px-6 py-4">
                      <Progress value={policy.progress_pengisian} className="h-2 w-full" />
                      <span className="text-xs text-gray-500">{policy.progress_pengisian}%</span>
                    </td>
                    <td className="px-6 py-4">{policy.tanggal_proses ? new Date(policy.tanggal_proses).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => router.push(`/enum/kebijakan/detail?id=${policy.id}`)}
                        className="text-[#16578D] hover:text-blue-600"
                        title="Lihat Detail"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default KebijakanTable
