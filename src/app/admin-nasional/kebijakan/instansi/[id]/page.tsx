"use client";

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import Sidebar from '@/components/sidebar-admin'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { usePathname } from 'next/navigation'

function InstansiKebijakan() {
  const [page, setPage] = useState(1)
  interface Policy {
    id: string;
    name: string;
    enumerator: string;
    progress_pengisian: number;
    status_kebijakan: string;
  }

  const [data, setData] = useState<Policy[]>([])
  const [paginatedData, setPaginatedData] = useState<Policy[]>([]) // State untuk data yang dipaginasi
  const pathname = usePathname()
  const id = pathname ? pathname.split('/').pop() : null

  useEffect(() => {
    if (id) {
      console.log('Fetching data for agency_id:', id)
      const fetchData = async () => {
        const response = await fetch(`/api/policies/instansi?agency_id=${id}`)
        const result = await response.json()
        console.log('Fetched data:', result)
        setData(result)
      }
      fetchData()
    } else {
      console.log('No agency_id found in URL path')
    }
  }, [id])

  // Mengatur data yang akan dipaginasi
  useEffect(() => {
    const start = (page - 1) * 25
    const end = start + 25
    setPaginatedData(data.slice(start, end))
  }, [data, page])

  // Menghitung total halaman
  const totalPages = Math.ceil(data.length / 25)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar>
        <></>
      </Sidebar>

      {/* Konten utama */}
      <div className="flex-1 p-20">
        {/* Judul */}
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">📋 Daftar Kebijakan</h1>

        {/* Tabel Kebijakan */}
        <div className="rounded-xl shadow-md border bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="text-gray-600">No</TableHead>
                <TableHead className="text-gray-600">Nama Kebijakan</TableHead>
                <TableHead className="text-gray-600">Enumerator</TableHead>
                <TableHead className="text-gray-600">Proses</TableHead>
                <TableHead className="text-gray-600">Status</TableHead>
                <TableHead className="text-gray-600">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{(page - 1) * 25 + index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.enumerator}</TableCell>
                  <TableCell>
                    <Progress value={item.progress_pengisian} className="w-40" />
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      item.status_kebijakan === 'DISETUJUI' ? 'bg-green-200 text-green-800' :
                      item.status_kebijakan === 'PROSES' ? 'bg-yellow-200 text-yellow-800' :
                      item.status_kebijakan === 'DITOLAK' ? 'bg-red-200 text-red-800' :
                      'bg-gray-300 text-gray-800'
                    }`}>
                      {item.status_kebijakan}
                    </span>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2 px-4 transition duration-200">
                      Ubah
                    </Button>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2 px-4 transition duration-200">
                      Hapus
                    </Button>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2 px-4 transition duration-200">
                      Pindah
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages} // Menyediakan total halaman untuk pagination
            onPageChange={(newPage) => setPage(newPage)} // Perubahan halaman
          />
        </div>
      </div>
    </div>
  )
}

// Protected page with role guard
const ProtectedPage = withRoleGuard(InstansiKebijakan, [1])

// Main page export
export default function Page() {
  return <ProtectedPage />
}
