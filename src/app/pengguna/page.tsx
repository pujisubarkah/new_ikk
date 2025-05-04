'use client';

import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/sidebar-admin';
import { withRoleGuard } from '@/lib/withRoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

const tabs = [
  'Koordinator Nasional',
  'Tim Verifikator',
  'Koordinator Instansi',
  'Analis Instansi',
];

const USERS_PER_PAGE = 20;

interface Instansi {
  agency_name: string;
}

interface User {
  instansi: Instansi | null;
  active_year: string;
  coordinator_type_name: string;
  agency_name: string;
  id: number;
  name: string;
  username: string;
  work_unit: string;
  status: string;
}

function TabelInstansi() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Koordinator Nasional');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<User[]>([]);

  const getRoleIdFromTab = (tab: string): number => {
    const roleMap: Record<string, number> = {
      'Koordinator Nasional': 2,
      'Tim Verifikator': 3,
      'Koordinator Instansi': 4,
      'Analis Instansi': 5,
    };
    return roleMap[tab] || 0;
  };

  const fetchData = async () => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const roleId = getRoleIdFromTab(activeTab);
      const response = await axios.get(`/api/users?role_id=${roleId}`);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

 
  
    const handleEdit = (id:number, name:string) => {
      // Menampilkan toast pemberitahuan
      toast.info(`Mengarahkan ke halaman edit ${name}...`);
    
      // Mengarahkan ke halaman edit pengguna dengan id
      router.push(`/pengguna/edit/${id}`);
    };

  const handleDelete = async (id: number, name: string) => {
    const deleteToast = toast.loading(`Sedang menghapus ${name}...`)
    
    try {
      // Menggunakan try-catch untuk menangkap error dengan lebih baik
      const response = await axios.delete(`/api/users/${id}`)
      
      if (response.status === 200) {
        toast.success(`Pengguna ${name} berhasil dihapus`, {
          id: deleteToast
        })
        fetchData() // Refresh data
      } else {
        throw new Error(response.data?.message || 'Gagal menghapus pengguna')
      }
    } catch (error: unknown) {
        console.error('Error deleting user:', error);
        
        // Menampilkan pesan error yang lebih spesifik
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : error instanceof Error
            ? error.message
            : 'Terjadi kesalahan saat menghapus pengguna';
        
        toast.error(errorMessage, {
          id: deleteToast,
        });
      }
  }
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instansi?.agency_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.active_year?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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
                   <TableHead className="text-center">Tahun Aktif</TableHead>
                   <TableHead className="text-center">Status</TableHead>
                   <TableHead className="text-center">Aksi</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
               {loading ? (
     <TableRow>
       <TableCell colSpan={7} className="text-center">
         Memuat data...
       </TableCell>
     </TableRow>
   ) : (
     paginatedData.map((item, index) => (
                   <TableRow key={item.id}>
                     <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                     <TableCell>{item.name}</TableCell>
                     <TableCell className="text-center">{item.username}</TableCell>
                     <TableCell className="text-center space-x-3">{item.instansi?.agency_name ?? '-'}</TableCell>
                     <TableCell className="text-center space-x-3">{item.active_year ?? '-'}</TableCell>
                     <TableCell className="text-center">
                     <span
                       className={`px-2 py-1 text-xs font-semibold rounded-full ${
                         item.status?.toLowerCase() === 'aktif'
                           ? 'bg-green-200 text-green-800'
                           : 'bg-red-200 text-red-800'
                       }`}
                     >
                       {item.status || 'Tidak Diketahui'}
                     </span>
                     </TableCell>
                     <TableCell className="text-center space-x-2 w-40 flex justify-center items-center">
                       <Button
                       onClick={() => handleEdit(item.id, item.name)}
                       className="flex justify-center items-center bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2 px-4 transition duration-200"
                       >
                       <FaEdit />
                       </Button>
                       <Button
                       onClick={() => handleDelete(item.id, item.name)}
                       className="flex justify-center items-center bg-red-600 text-white hover:bg-red-700 rounded-md py-2 px-4 transition duration-200"
                       >
                       <FaTrash />
                       </Button>
                     </TableCell>
                   </TableRow>
     ))
   )}
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
  );
}

const ProtectedPage = withRoleGuard(TabelInstansi, [1]);

export default function Page() {
  return <ProtectedPage />;
}
