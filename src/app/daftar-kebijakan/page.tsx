"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import Sidebar from "@/components/sidebar"
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaEye, FaPaperPlane } from "react-icons/fa"

// Dummy data
const initialData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  nama: `Kebijakan ${i + 1}`,
  sektor: "Umum",
  tanggal: "2025-04-18",
  file: "-",
  enumerator: "Enumerator 1",
  progress: "50%",
  tanggalAssign: "2025-04-20",
  nilai: "85",
  status: "Diajukan",
}))

function countByStatus(status: string): number {
  return initialData.filter((item) => item.status === status).length;
}

export default function KebijakanTable() {
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("Diajukan")
  const [data, setData] = useState(initialData)
  const itemsPerPage = 5

  const filteredData = data.filter(item => item.status === activeTab)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newPolicy = {
      id: data.length + 1,
      nama: formData.get('nama') as string || "",
      sektor: formData.get('sektor') as string || "",
      tanggal: formData.get('tanggal') as string || "",
      file: formData.get('dokumen') instanceof File ? (formData.get('dokumen') as File).name : '-',
      enumerator: "-",
      progress: "-",
      tanggalAssign: "-",
      nilai: "-",
      status: "Diajukan",
    }
    setData([...data, newPolicy])
    setOpen(false)
  }

  const handleTabChange = (status: string) => {
    setActiveTab(status)
    setCurrentPage(1)
  }

  return (
    <Sidebar>
      <div className="p-6">

        {/* Indikator Status */}
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

        {/* Judul dan Tambah */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Daftar Kebijakan</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                + Tambah Populasi
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md mx-auto">
  <div className="bg-white rounded-lg  p-4">
    <DialogTitle className="text-xl font-semibold mb-4">Tambah Populasi (Kebijakan)</DialogTitle>
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="nama">Nama Kebijakan</Label>
        <Input id="nama" name="nama" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sektor">Sektor Kebijakan</Label>
        <Input id="sektor" name="sektor" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="tanggal">Tanggal Berlaku</Label>
        <Input id="tanggal" name="tanggal" type="date" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="dokumen">Dokumen</Label>
        <Input id="dokumen" name="dokumen" type="file" />
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

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-3 bg-white p-3 rounded-md shadow-sm border mb-4">
          {["Diajukan", "Disetujui", "Diproses", "Selesai"].map((status) => (
            <Button
              key={status}
              onClick={() => handleTabChange(status)}
              className={`text-sm px-3 py-1 border ${
                activeTab === status ? "bg-blue-600 text-white" : "border-blue-600 text-blue-600 hover:bg-blue-100 bg-white"
              }`}
            >
              Kebijakan {status}
            </Button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-lg border mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">No</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama Kebijakan</th>
                {activeTab === "Diajukan" && (
                  <>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal Berlaku</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">File</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  </>
                )}
                {activeTab === "Disetujui" && (
                  <>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Enumerator</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal Berlaku</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Aksi</th>
                  </>
                )}
                {activeTab === "Diproses" && (
                  <>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Enumerator</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Progress</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal Assign</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Aksi</th>
                  </>
                )}
                {activeTab === "Selesai" && (
                  <>
                    <th className="px-4 py-2 text -left text-sm font-medium text-gray-700">Enumerator</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nilai</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-sm text-gray-500">
                    Belum ada data kebijakan.
                  </td>
                </tr>
              ) : (
                currentData.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-sm">{startIndex + idx + 1}</td>
                    <td className="px-4 py-2 text-sm">{item.nama}</td>
                    {activeTab === "Diajukan" && (
                      <>
                        <td className="px-4 py-2 text-sm">{item.tanggal}</td>
                        <td className="px-4 py-2 text-sm">{item.file}</td>
                        <td className="px-4 py-2 text-sm">{item.status}</td>
                      </>
                    )}
                    {activeTab === "Disetujui" && (
                      <>
                        <td className="px-4 py-2 text-sm">{item.enumerator}</td>
                        <td className="px-4 py-2 text-sm">{item.tanggal}</td>
                        <td className="px-4 py-2 text-sm flex justify-around">
                          <Button className="bg-blue-500 text-white">
                            Pilih Enumerator
                          </Button>
                        </td>
                      </>
                    )}
                    {activeTab === "Diproses" && (
                      <>
                        <td className="px-4 py-2 text-sm">{item.enumerator}</td>
                        <td className="px-4 py-2 text-sm">{item.progress}</td>
                        <td className="px-4 py-2 text-sm">{item.tanggalAssign}</td>
                        <td className="px-4 py-2 text-sm flex justify-around">
                          <Button className="bg-green-500 text-white">
                            <FaEye />
                          </Button>
                          <Button className="bg-blue-500 text-white">
                            <FaPaperPlane />
                          </Button>
                        </td>
                      </>
                    )}
                    {activeTab === "Selesai" && (
                      <>
                        <td className="px-4 py-2 text-sm">{item.enumerator}</td>
                        <td className="px-4 py-2 text-sm">{item.status}</td>
                        <td className="px-4 py-2 text-sm">{item.nilai}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Next
          </Button>
        </div>
      </div>
    </Sidebar>
  )
}
