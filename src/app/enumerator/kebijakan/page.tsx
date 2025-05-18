'use client';

import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/sidebar-enum';
import { toast } from 'sonner';

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
];

export default function KebijakanTable() {
  const [activeTab, setActiveTab] = useState('masuk');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const enumeratorId = typeof window !== 'undefined' ? localStorage.getItem('id') : null;

        if (!enumeratorId) throw new Error("ID Enumerator tidak ditemukan di localStorage");

        const masukRes = await fetch(`/api/policies/${enumeratorId}/masuk`);
        const prosesRes = await fetch(`/api/policies/${enumeratorId}/proses`);

        const masukData = await masukRes.json();
        const prosesData = await prosesRes.json();

        // Type definitions
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

        const masukPolicies: Policy[] = (masukData.data || []).map((item: MasukPolicy) => ({
          id: item.id,
          name: item.nama_kebijakan,
          enumerator: item.enumerator,
          tanggal_berlaku: item.tanggal_berlaku,
          status_kebijakan: 'MASUK',
        }));

        const prosesPolicies: Policy[] = (prosesData.data || []).map((item: ProsesPolicy) => ({
          id: item.id,
          name: item.nama_kebijakan,
          enumerator: item.enumerator,
          progress_pengisian: Number(item.progress),
          status_kebijakan: 'PROSES',
          tanggal_proses: new Date().toISOString(),
        }));

        setPolicies([...masukPolicies, ...prosesPolicies]);
      } catch (err) {
        console.error('Error fetching policies:', err);
        toast.error('Gagal Memuat Data', {
          description: 'Terjadi kesalahan saat memuat kebijakan. Silakan coba lagi.',
        });
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const filteredPolicies = policies.filter(policy =>
    activeTab === 'masuk'
      ? policy.status_kebijakan === 'MASUK'
      : policy.status_kebijakan === 'PROSES'
  );

  const countMasuk = policies.filter(p => p.status_kebijakan === 'MASUK').length;
  const countDiproses = policies.filter(p => p.status_kebijakan === 'PROSES' && (p.progress_pengisian || 0) < 100).length;
  const countSelesai = policies.filter(p => p.status_kebijakan === 'PROSES' && (p.progress_pengisian || 0) === 100).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
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

        {/* Tabs Navigation (Custom Style Sesuai DashboardPage) */}
        <div className="flex space-x-2 md:space-x-4 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          {filteredPolicies.length > 0 ? (
            <div className="overflow-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Nama Kebijakan</th>
                    {activeTab === 'masuk' && (
                      <>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Analis Instansi</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Tanggal Berlaku</th>
                      </>
                    )}
                    {activeTab === 'diproses' && (
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
                      {activeTab === 'masuk' && (
                        <>
                          <td className="px-4 py-3 border">{policy.enumerator}</td>
                          <td className="px-4 py-3 border">
                            {policy.tanggal_berlaku ? new Date(policy.tanggal_berlaku).toLocaleDateString('id-ID') : '-'}
                          </td>
                        </>
                      )}
                      {activeTab === 'diproses' && (
                        <>
                          <td className="px-4 py-3 border">{policy.enumerator}</td>
                          <td className="px-4 py-3 border">
                            <Progress value={policy.progress_pengisian || 0} className="h-2" />
                            <span className="text-xs text-gray-500 mt-1 block text-center">
                              {policy.progress_pengisian || 0}%
                            </span>
                          </td>
                          <td className="px-4 py-3 border">
                            {policy.tanggal_proses ? new Date(policy.tanggal_proses).toLocaleDateString('id-ID') : '-'}
                          </td>
                          <td className="px-4 py-3 border">
                            <Button
                              variant="secondary"
                              onClick={() => router.push(`/enumerator/kebijakan/detail/${policy.id}`)}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50 flex items-center"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Detail
                            </Button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">Tidak ada data</div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
