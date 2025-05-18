"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar-koorins";
import { withRoleGuard } from "@/lib/withRoleGuard";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";

interface Enumerator {
  status: string;
  id: number;
  nama: string;
  nip: string;
  unit_kerja: string;
}

function EnumeratorPage() {
  const [enumerators, setEnumerators] = useState<Enumerator[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const koorinstansiId = localStorage.getItem("id");
      if (!koorinstansiId) {
        console.error("Admin Instansi ID tidak ditemukan");
        return;
      }

      const response = await fetch(`/api/analis_instansi?koor_instansi_id=${koorinstansiId}`);
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data.analis_instansi)) {
        setEnumerators(data.analis_instansi);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/koordinator-instansi/enumerator/ubah/${id}`);
  };

  const handleDelete = async (id: number, name: string) => {
    const deleteToast = toast.loading(`Sedang menghapus ${name}...`);

    try {
      const response = await axios.delete(`/api/users/${id}`);

      if (response.status === 200) {
        toast.success(`Pengguna ${name} berhasil dihapus`, { id: deleteToast });
        fetchData();
      } else {
        throw new Error(response.data?.message || 'Gagal menghapus pengguna');
      }
    } catch (error: unknown) {
      console.error('Error deleting user:', error);

      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menghapus pengguna';

      toast.error(errorMessage, { id: deleteToast });
    }
  };

  return (
    <Sidebar>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Daftar Analis Instansi</h2>
          <Button
            onClick={() => router.push("/koordinator-instansi/enumerator/tambah")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Tambah Analis Instansi
          </Button>
        </div>

        <div className="overflow-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-300 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Unit Kerja</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">NIP</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {enumerators.filter(enumerator => enumerator.status === 'aktif').length === 0 ? (
                <tr>
                <td colSpan={5} className="text-center py-8 text-sm text-gray-500">
                Tidak ada data analis instansi dengan status aktif
                </td>
                </tr>
                ) : (
                enumerators
                .filter(enumerator => enumerator.status === 'aktif')
                .map((enumerator, index) => (
                <tr key={enumerator.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{enumerator.nama}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{enumerator.unit_kerja || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{enumerator.nip}</td>
                <td className="px-6 py-4 space-x-2 flex items-center">
                  <Button
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md shadow-sm"
                  onClick={() => handleEdit(enumerator.id.toString())}
                  >
                  <FaEdit className="text-white" />
                  Ubah
                  </Button>
                  <Button
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-sm"
                  onClick={() => handleDelete(enumerator.id, enumerator.nama)}
                  >
                  <FaTrash className="text-white" />
                  Hapus
                  </Button>
                </td>
                </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </Sidebar>
  );
}

const ProtectedPage = withRoleGuard(EnumeratorPage, [4]);

export default function Page() {
  return <ProtectedPage />;
}
