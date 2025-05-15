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
    agency_name: string
    agency_id: string
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

  interface InstansiPanrb {
    agency_id: string
    agency_name: string
    instansi_kategori: {
      id: number
      kat_instansi: string
    }
  }

  const [instansiData, setInstansiData] = useState<Instansi[]>([])
  const [instansiDataPanrb, setInstansiDataPanrb] = useState<InstansiPanrb[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [selectedAgencyId, setSelectedAgencyId] = useState('')
  const [activeYear, setActiveYear] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const fetchInstansiData = async () => {
    try {
      const response = await axios.get('/api/instansi')
      setInstansiData(response.data)
      fetchInstansiDataPanrb() // Call this function to fetch instansi data
    } catch (error) {
      console.error('Error fetching instansi data:', error)
    }
  }

  useEffect(() => {
    fetchInstansiData()
  }, [])

  const fetchInstansiDataPanrb = async () => {
    try {
      const response = await axios.get('/api/instansi/panrb')
      setInstansiDataPanrb(response.data)
    } catch (error) {
      console.error('Error fetching instansi data:', error)
      return []
    }
  }

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
              onClick={() => setShowPopup(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Tambah Instansi
            </button>

            {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Tambah Instansi</h2>
                <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                  await axios.post('/api/instansi', {
                    agency_id_panrb: selectedAgencyId,
                    active_year: activeYear,
                  });
                  alert('Instansi berhasil ditambahkan');
                  setShowPopup(false);
                  setSelectedAgencyId('');
                  setActiveYear('');
                  fetchInstansiData(); // Refresh data
                  } catch (error) {
                  console.error('Error adding instansi:', error);
                  alert('Gagal menambahkan instansi');
                  }
                }}
                >
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                  Nama Instansi
                  </label>
                  <select
                  value={selectedAgencyId}
                  onChange={(e) => setSelectedAgencyId(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                  >
                  <option value="">Pilih Instansi</option>
                  {instansiDataPanrb.map((item) => (
                    <option
                    key={item.agency_id}
                    value={item.agency_id}
                    >
                    {item.agency_name}
                    </option>
                  ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                  Tahun Penilaian
                  </label>
                  <input
                  type="number"
                  value={activeYear}
                  onChange={(e) => setActiveYear(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                  Batal
                  </button>
                  <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                  Simpan
                  </button>
                </div>
                </form>
              </div>
              </div>
            )}
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
