"use client"

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import Sidebar from "@/components/sidebar"
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaEye, FaPaperPlane } from "react-icons/fa"
import axios from "axios"; // pakai axios biar simpel



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

  useEffect(() => {
    const fetchPolicies = async () => {
      const adminInstansiId = localStorage.getItem("admin_instansi_id"); // ambil ID
      if (!adminInstansiId) return;

      try {
        const res = await axios.get(`/api/policies/admin_instansi?admin_instansi_id=${adminInstansiId}`);
        const fetchedData = res.data.data; // sesuaikan path responsenya

        const mappedData = fetchedData.map((item: any, index: number) => ({
          id: item.id,
          nama: item.name,
          sektor: "Umum", // default karena API tidak ada sektor
          tanggal: item.policy_details?.effective_date || "-", // kosong atau isi
          file: "-", // API kamu tidak ada field file
          enumerator: "-", // mungkin nanti ditambah
          progress: item.policy_details?.progress + "%" || "-",
          tanggalAssign: "-", // belum ada di API
          nilai: "-", // belum ada
          status: mapStatus(item.policy_process?.name), // pakai fungsi kecil buat ubah
        }));

        setData(mappedData);
      } catch (err) {
        console.error("Gagal fetch data policies", err);
      }
    };

    fetchPolicies();
  }, []);

  const mapStatus = (statusApi: string) => {
    if (statusApi === "DISETUJUI") return "Disetujui";
    if (statusApi === "PROSES") return "Diproses";
    if (statusApi === "SELESAI") return "Selesai";
    if (statusApi === "DIAJUKAN") return "Diajukan";
    return "Diajukan"; // default fallback
  };



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
      <div className="flex flex-col p-6 space-y-6 bg-gray-50">
        {/* Indikator Status */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center justify-between bg-blue-100 border border-blue-300 p-4 rounded-lg shadow-sm">
            <div className="text-blue-700 font-semibold">Diajukan</div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
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

        {/* Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-700">Daftar Kebijakan</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                + Tambah Populasi
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md mx-auto">
              <div className="bg-white rounded-lg p-4">
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
        <div className="flex space-x-2 mb-6">
          {["Diajukan", "Disetujui", "Diproses", "Selesai"].map((status) => (
            <button
              key={status}
              onClick={() => handleTabChange(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                activeTab === status
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-100"
              }`}
            >
              Kebijakan {status}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-auto bg-white shadow-md rounded-xl">
          <table className="table-auto w-full text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">No</th>
                <th className="px-4 py-2 border">Nama Kebijakan</th>
                {activeTab === "Diajukan" && (
                  <>
                    <th className="px-4 py-2 border">Tanggal Berlaku</th>
                    <th className="px-4 py-2 border">File</th>
                    <th className="px-4 py-2 border">Status</th>
                  </>
                )}
                {activeTab === "Disetujui" && (
                  <>
                    <th className="px-4 py-2 border">Enumerator</th>
                    <th className="px-4 py-2 border">Tanggal Berlaku</th>
                    <th className="px-4 py-2 border">Aksi</th>
                  </>
                )}
                {activeTab === "Diproses" && (
                  <>
                    <th className="px-4 py-2 border">Enumerator</th>
                    <th className="px-4 py-2 border">Progress</th>
                    <th className="px-4 py-2 border">Tanggal Assign</th>
                    <th className="px-4 py-2 border">Aksi</th>
                  </>
                )}
                {activeTab === "Selesai" && (
                  <>
                    <th className="px-4 py-2 border">Enumerator</th>
                    <th className="px-4 py-2 border">Nilai</th>
                    <th className="px-4 py-2 border">Aksi</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{item.id}</td>
                  <td className="px-4 py-2 border">{item.nama}</td>
                  {activeTab === "Diajukan" && (
                    <>
                      <td className="px-4 py-2 border">{item.tanggal}</td>
                      <td className="px-4 py-2 border">{item.file}</td>
                      <td className="px-4 py-2 border">{item.status}</td>
                    </>
                  )}
                  {activeTab === "Disetujui" && (
                    <>
                      <td className="px-4 py-2 border">{item.enumerator}</td>
                      <td className="px-4 py-2 border">{item.tanggal}</td>
                      <td className="px-4 py-2 border">
                        <Button variant="primary">
                          <FaEye />
                        </Button>
                      </td>
                    </>
                  )}
                  {activeTab === "Diproses" && (
                    <>
                      <td className="px-4 py-2 border">{item.enumerator}</td>
                      <td className="px-4 py-2 border">{item.progress}</td>
                      <td className="px-4 py-2 border">{item.tanggalAssign}</td>
                      <td className="px-4 py-2 border">
                        <Button variant="primary">
                          <FaPaperPlane />
                        </Button>
                      </td>
                    </>
                  )}
                  {activeTab === "Selesai" && (
                    <>
                      <td className="px-4 py-2 border">{item.enumerator}</td>
                      <td className="px-4 py-2 border">{item.nilai}</td>
                      <td className="px-4 py-2 border">
                        <Button variant="primary">
                          <FaEye />
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div>
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} results
          </div>
          <div className="flex gap-4">
            <Button
              variant="primary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </Button>
            <Button
              variant="secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}
