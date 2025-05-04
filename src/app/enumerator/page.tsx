"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { withRoleGuard } from "@/lib/withRoleGuard";

interface Enumerator {
  id: string;
  nama: string;
  nip: string;
  unit_kerja: string;
}

function EnumeratorPage() {
  const [enumerators, setEnumerators] = useState<Enumerator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const koorinstansiId = localStorage.getItem("id");
        if (!koorinstansiId) {
          throw new Error("Admin Instansi ID tidak ditemukan");
        }

        const response = await fetch(`/api/analis_instansi?koor_instansi_id=${koorinstansiId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.analis_instansi)) {
          throw new Error("Data enumerator tidak valid");
        }

        setEnumerators(data.analis_instansi); // Boleh kosong, itu sah
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Gagal mengambil data");
        setEnumerators([]); // Tetap kosongkan
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/enumerator/ubah/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah kamu yakin ingin menghapus enumerator ini?")) {
      // Tambahkan logika delete di sini
      console.log(`Hapus enumerator dengan ID: ${id}`);
    }
  };

  return (
    <Sidebar>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Daftar Analis Instansi</h2>
          <Button
            onClick={() => router.push("/enumerator/tambah")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Tambah Analis Instansi
          </Button>
        </div>

        
          <div className="overflow-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">No</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit Kerja</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">NIP</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enumerators.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-sm text-gray-500">
                      Tidak ada data enumerator
                    </td>
                  </tr>
                ) : (
                  enumerators.map((enumerator, index) => (
                    <tr key={enumerator.id}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{enumerator.nama}</td>
                      <td className="px-4 py-2">{enumerator.unit_kerja || '-'}</td>
                      <td className="px-4 py-2">{enumerator.nip}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white"
                          onClick={() => handleEdit(enumerator.id)}
                        >
                          Ubah
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleDelete(enumerator.id)}
                        >
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
