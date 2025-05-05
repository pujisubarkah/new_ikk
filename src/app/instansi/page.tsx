'use client'

import { FaEdit } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '@/components/sidebar-admin'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { withRoleGuard } from '@/lib/withRoleGuard'
import { Button } from '@/components/ui/button'

function TabelInstansi() {
  const [searchQuery, setSearchQuery] = useState('')
  
  interface Instansi {
    instansi: {
      agency_name: string
      agency_id: number
      instansi_kategori: {
        id: number
        kat_instansi: string
      }
    }
    id: number
    active_year: number
  }

  const [instansiData, setInstansiData] = useState<Instansi[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    const fetchInstansiData = async () => {
      try {
        const response = await axios.get('/api/instansi')
        setInstansiData(response.data)
      } catch (error) {
        console.error('Error fetching instansi data:', error)
      }
    }

    fetchInstansiData()
  }, [])

  const filteredData = instansiData.filter(item =>
    item.instansi?.agency_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.active_year?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  )
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

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
          <h1 className="text-2xl font-bold">Daftar Instansi</h1>
          <div className="flex space-x-4 items-center">
            <button
              onClick={() => alert('Tambah Instansi')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Tambah Instansi
            </button>
            <input
              type="text"
              placeholder="Cari Instansi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border">
        <Table>
               <TableHeader>
                 <TableRow>
                 <TableHead className="text-center">No</TableHead>
                <TableHead className="text-left">Nama Instansi</TableHead>
                <TableHead className="text-center">Tahun Penilaian</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
               </TableHeader>
               <TableBody>
                {currentItems
                .sort((a, b) => b.active_year - a.active_year) // Sort by active_year descending
                .map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-left">{item.instansi?.agency_name || 'NA'}</TableCell>
                    <TableCell className="text-center">{item.active_year}</TableCell>
                    <TableCell className="text-center">
                    <Button
                    onClick={() => alert(`Edit ${item.instansi?.agency_name ?? 'NA'}`)}
                    className="flex justify-center items-center bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2 px-4 transition duration-200"
                       >
                    <FaEdit />
                    </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>

        {/* Pagination Controls */}
        {filteredData.length > itemsPerPage && (
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
