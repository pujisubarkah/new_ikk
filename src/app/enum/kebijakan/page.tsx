'use client'
import React, { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Sidebar from "@/components/sidebar-enum"

interface Policy {
  id: string;
  name: string;
  enumerator: string;
  status_kebijakan: string;
  tanggal_berlaku?: string;
  tanggal_proses?: string;
  progress_pengisian?: number;
}

const tabs = [
  { key: 'masuk', label: 'Kebijakan Masuk' },
  { key: 'diproses', label: 'Kebijakan Diproses' },
]

const KebijakanTable = () => {
  const [activeTab, setActiveTab] = useState('masuk')
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true)
        const enumeratorId = localStorage.getItem('id')
        if (!enumeratorId) {
          throw new Error('Enumerator ID not found in localStorage')
        }

        const response = await fetch(`/api/policies/enumerator?enumerator_id=${enumeratorId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch policies')
        }
        
        const data = await response.json()
        setPolicies(data)
      } catch (err) {
        console.error('Failed to fetch policies:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  const filteredPolicies = policies.filter(policy => 
    activeTab === 'masuk' 
      ? policy.status_kebijakan === 'MASUK' 
      : policy.status_kebijakan === 'PROSES'
  )

  if (loading) {
    return (
      <div className="flex">
        <Sidebar>
          <div>Content goes here</div>
        </Sidebar>
        <div className="flex-1 p-20 ml-60 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar>
          <div>Content goes here</div>
        </Sidebar>
        <div className="flex-1 p-20 ml-60 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar>
        <div>Content goes here</div>
      </Sidebar>
      
      <div className="flex-1 p-4 md:p-8 lg:p-12 ml-0 md:ml-60">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-blue-800">Kebijakan Masuk</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-900">
                {policies.filter(p => p.status_kebijakan === 'MASUK').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-yellow-800">Kebijakan Diproses</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-900">
                {policies.filter(p => p.status_kebijakan === 'PROSES').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-green-800">Kebijakan Selesai</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-900">
                {policies.filter(p => p.status_kebijakan === 'SELESAI').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.key} 
                value={tab.key}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="masuk">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enumerator</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Berlaku</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPolicies.map((policy, index) => (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.enumerator}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {policy.tanggal_berlaku ? new Date(policy.tanggal_berlaku).toLocaleDateString('id-ID') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="diproses">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enumerator</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Proses</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPolicies.map((policy, index) => (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.enumerator}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Progress 
                          value={policy.progress_pengisian || 0} 
                          className="h-2 w-full bg-gray-200"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">
                          {policy.progress_pengisian || 0}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {policy.tanggal_proses ? new Date(policy.tanggal_proses).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => router.push(`/enum/kebijakan/detail?id=${policy.id}`)}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                          title="Lihat Detail"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default KebijakanTable
