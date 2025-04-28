'use client'

import { FaEdit, FaTrash } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Sidebar from '@/components/sidebar-admin'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const tabs = ['Koordinator Utama', 'Koordinator Instansi', 'Admin Instansi', 'Enumerator']

const USERS_PER_PAGE = 20

function TabelInstansi() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Koordinator Utama')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  interface User {
    coordinator_type_name: string
    agency_name: string
    id: number
    name: string
    username: string
    work_unit: string
    status: string
  }

  const [data, setData] = useState<User[]>([])

  const getRoleIdFromTab = (tab: string): number => {
    const roleMap: Record<string, number> = {
      'Koordinator Utama': 2,
      'Koordinator Instansi': 3,
      'Admin Instansi': 4,
      'Enumerator': 5
    }
    return roleMap[tab] || 0
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      setCurrentPage(1) // Reset page saat ganti tab
      try {
        const roleId = getRoleIdFromTab(activeTab)
        const response = await axios.get(`/api/users?role_id=${roleId}`)
        setData(response.data)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Gagal mengambil data pengguna.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activeTab])

  const handleEdit = (name: string) => {
    alert(`Edit ${name}`)
  }

  const handleDelete = (name: string) => {
    const konfirmasi = confirm(`Yakin ingin menghapus ${name}?`)
    if (konfirmasi) {
      alert(`Berhasil menghapus ${name}`)
    }
  }

  // Filter nama
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / USERS_PER_PAGE)
  const startIndex = (currentPage - 1) * USERS_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, startIndex + USERS_PER_PAGE)

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  return (
      <Sidebar>
      <div className="w-full px-6 py-8">
      <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Data Pengguna</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <Button onClick={() => router.push('/pengguna/add')}>Tambah Pengguna</Button>
              <Input
                type="text"
                placeholder="Cari Nama..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1) // reset ke halaman pertama saat mencari
                }}
                className="w-60"
              />
            </div>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={(val) => setActiveTab(val)} className="mb-4">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-center">NIP</TableHead>
                  <TableHead className="text-center">Nama Instansi</TableHead>
                  <TableHead className="text-center">Wilayah Kerja</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              {loading && <div className="text-center py-4">Memuat data...</div>}
          {error && <div className="text-center text-red-500 py-4">{error}</div>}
              <TableBody>
                {paginatedData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-center">{item.username}</TableCell>
                    <TableCell className="text-center space-x-3">{item.agency_name ?? '-'}</TableCell>
                    <TableCell className="text-center space-x-3">{item.coordinator_type_name ?? '-'}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status.toLowerCase() === 'aktif'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center space-x-25">
                      <Button
                        onClick={() => handleEdit(item.name)}
                        className="text-blue-600 hover:text-blue-800 variant-ghost"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {!loading && paginatedData.length === 0 && (
              <div className="text-center py-4 text-gray-500">Data tidak ditemukan.</div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredData.length > USERS_PER_PAGE && (
            <div className="mt-6 flex justify-between items-center text-sm">
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
              <div className="space-x-2">
                <Button
                  className="border border-gray-300"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                >
                  Sebelumnya
                </Button>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          )}
        </div>
      </Sidebar>
  )
}

const ProtectedPage = withRoleGuard(TabelInstansi, [1])
export default function Page() {
  return <ProtectedPage />
}
