"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import Sidebar from "@/components/sidebar"
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa"

// Dummy data
const initialData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  nama: `Kebijakan ${i + 1}`,
  sektor: "Umum",
  tanggal: "2025-04-18",
  file: "-",
  status: "Aktif",
}))

function countByStatus(status: string): number {
  return initialData.filter((item) => item.status === status).length;
}

export default function KebijakanTable() {
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState(initialData)
  const itemsPerPage = 5

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = data.slice(startIndex, startIndex + itemsPerPage)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newPolicy = {
      id: data.length + 1,
      nama: formData.get('nama') as string || "",
      sektor: formData.get('sektor') as string || "",
      tanggal: formData.get('tanggal') as string || "",
      file: formData.get('dokumen') instanceof File ? (formData.get('dokumen') as File).name : '-',
      status: "Aktif",
    }
    setData([...data, newPolicy])
    setOpen(false)
  }

  return (
    <Sidebar>
      <div className="p-6">
         {/* Komponen Indikator Status */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
  <div className="flex items-center justify-between bg-yellow-100 border border-yellow-300 p-4 rounded-lg shadow-sm">
    <div className="text-yellow-700 font-semibold">Diajukan</div>
    <div className="flex items-center gap-2 text-yellow-600 font-bold text-xl">
      <FaHourglassHalf />
      {countByStatus("Diajukan")}
    </div>
  </div>
  <div className="flex items-center justify-between bg-green-100 border border-green-300 p-4 rounded-lg shadow-sm">
    <div className="text-green-700 font-semibold">Disetujui</div>
    <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
      <FaCheckCircle />
      {countByStatus("Disetujui")}
    </div>
  </div>
  <div className="flex items-center justify-between bg-red-100 border border-red-300 p-4 rounded-lg shadow-sm">
    <div className="text-red-700 font-semibold">Ditolak</div>
    <div className="flex items-center gap-2 text-red-600 font-bold text-xl">
      <FaTimesCircle />
      {countByStatus("Ditolak")}
    </div>
  </div>
</div>


        {/* Judul + tombol sejajar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Daftar Kebijakan</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                + Tambah Populasi
              </Button>
            </DialogTrigger>

            <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 sm:max-w-lg w-full">
                <DialogTitle className="text-xl font-semibold mb-4">Tambah Kebijakan</DialogTitle>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nama">Nama Kebijakan</Label>
                    <Input id="nama" name="nama" placeholder="Masukkan nama kebijakan" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sektor">Sektor Kebijakan</Label>
                    <Input id="sektor" name="sektor" placeholder="Contoh: Pendidikan, Kesehatan" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tanggal">Tanggal Berlaku</Label>
                    <Input id="tanggal" name="tanggal" type="date" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dokumen">Dokumen</Label>
                    <Input id="dokumen" name="dokumen" type="file" accept=".pdf,.doc,.docx" />
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button type="button" onClick={() => setOpen(false)} className="bg-gray-600 hover:bg-gray-700 text-white">
                      Kembali
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                      Tambah
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tombol filter kategori */}
        <div className="flex flex-wrap gap-2 mt-3 bg-white p-3 rounded-md shadow-sm border mb-4">
          <Button className="text-sm px-3 py-1 border border-blue-600 text-blue-600 hover:bg-blue-100 bg-white">
            Kebijakan Diajukan
          </Button>
          <Button className="text-sm px-3 py-1 border border-green-600 text-green-600 hover:bg-green-100 bg-white">
            Kebijakan Disetujui
          </Button>
          <Button className="text-sm px-3 py-1 border border-yellow-600 text-yellow-600 hover:bg-yellow-100 bg-white">
            Kebijakan Diproses
          </Button>
          <Button className="text-sm px-3 py-1 border border-purple-600 text-purple-600 hover:bg-purple-100 bg-white">
            Kebijakan Selesai
          </Button>
        </div>

        {/* Tabel Data */}
        <div className="overflow-auto rounded-lg border mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">No</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama Kebijakan</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sektor</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">File</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-gray-500">
                    Belum ada data kebijakan.
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">{startIndex + index + 1}</td>
                    <td className="px-4 py-2">{item.nama}</td>
                    <td className="px-4 py-2">{item.sektor}</td>
                    <td className="px-4 py-2">{item.tanggal}</td>
                    <td className="px-4 py-2">{item.file}</td>
                    <td className="px-4 py-2">{item.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-600">
            Menampilkan {startIndex + 1} sampai {Math.min(startIndex + itemsPerPage, data.length)} dari {data.length} entri
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="text-sm border"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Sebelumnya
            </Button>
            <div className="text-sm text-gray-700 px-2 font-semibold">{currentPage}</div>
            <Button
              className="text-sm border"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}
