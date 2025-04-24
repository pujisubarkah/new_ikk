'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationPrevious, PaginationNext
} from "@/components/ui/pagination"
import Sidebar from '@/components/sidebar-admin'

const dataDummy = [
  { id: 1, nama: 'Kebijakan A', enumerator: 'Budi', progress: 80, status: 'Aktif' },
  { id: 2, nama: 'Kebijakan B', enumerator: 'Ani', progress: 50, status: 'Proses' },
  { id: 3, nama: 'Kebijakan C', enumerator: 'Citra', progress: 100, status: 'Selesai' },
]

export default function InstansiKebijakan() {
  const [page, setPage] = useState(1)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar>
        <></>

      </Sidebar>

      {/* Konten utama */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">📋 Daftar Kebijakan</h1>
        
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
              {dataDummy.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.enumerator}</TableCell>
                  <TableCell>
                    <Progress value={item.progress} className="w-40" />
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      item.status === 'Aktif' ? 'bg-green-200 text-green-800' :
                      item.status === 'Proses' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-gray-300 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button className="text-blue-600 border border-blue-600 hover:bg-blue-50">Ubah</Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white">Hapus</Button>
                    <Button className="text-purple-600 border border-purple-600 hover:bg-purple-50">Pindah</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination>
            <div className="space-x-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 py-1 text-sm border rounded bg-gray-100">{page}</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={() => setPage((p) => p + 1)} />
                </PaginationItem>
              </PaginationContent>
            </div>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

