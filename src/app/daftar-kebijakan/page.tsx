"use client"

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "../../components/ui/button"
import Sidebar from "@/components/sidebar"
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaEye, FaPaperPlane } from "react-icons/fa"
import axios from "axios";

interface Policy {
  id: number;
  nama: string;
  sektor: string;
  tanggal: string;
  file: string;
  enumerator: string;
  progress: string;
  tanggalAssign: string;
  nilai: string;
  status: string;
}

const initialData: Policy[] = [];

export default function KebijakanTable() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Diajukan");
  const [data, setData] = useState<Policy[]>(initialData);
  const itemsPerPage = 5;
  const [processCounts, setProcessCounts] = useState({
    DIAJUKAN: 0,  // Maps to PROSES from API
    DISETUJUI: 0,
    DITOLAK: 0,   // Maps to SELESAI from API
  });

  const filteredData = data.filter(item => item.status === activeTab);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const fetchPolicies = async () => {
      const adminInstansiId = localStorage.getItem("id");
      if (!adminInstansiId) return;

      try {
        const res = await axios.get(`/api/policies/admin_instansi?admin_instansi_id=${adminInstansiId}`);
        const fetchedData = res.data.data;
        const counts = res.data.policyProcessCounts || {};

        interface FetchedPolicy {
          id: number;
          nama: string;
          sektor?: string;
          tanggal_berlaku?: string;
          file?: string;
          enumerator?: string;
          progress?: number;
          tanggalAssign?: string;
          nilai?: string;
          status: string;
        }

        const mappedData = fetchedData.map((item: FetchedPolicy) => ({
          id: item.id,
          nama: item.nama,
          sektor: item.sektor || "Umum",
          tanggal: item.tanggal_berlaku ? new Date(item.tanggal_berlaku).toISOString().split('T')[0] : "-",
          file: item.file || "-",
          enumerator: item.enumerator || "-",
          progress: item.progress ? `${item.progress}%` : "-",
          tanggalAssign: item.tanggalAssign || "-",
          nilai: item.nilai || "-",
          status: mapStatus(item.status),
        }));

        setData(mappedData);
        setProcessCounts({
          DIAJUKAN: counts.PROSES || 0,   // Map PROSES to DIAJUKAN
          DISETUJUI: counts.DISETUJUI || 0,
          DITOLAK: counts.DITOLAK || 0    // Map SELESAI to DITOLAK
        });
      } catch (err) {
        console.error("Gagal fetch data policies", err);
      }
    };

    fetchPolicies();
  }, []);

  const mapStatus = (statusApi: string) => {
    const statusMap: Record<string, string> = {
      "PROSES": "Diajukan",    // Map PROSES to Diajukan
      "DISETUJUI": "Disetujui",
      "SELESAI": "Ditolak",    // Map SELESAI to Ditolak
      "DIAJUKAN": "Diajukan",
    };
    return statusMap[statusApi] || "Diajukan";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get('dokumen') as File;
  
    if (file && !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      alert("Harap unggah file yang valid (PDF, JPEG, PNG).");
      return;
    }
  
    console.log("Form submitted");
    setOpen(false);
  };

  const handleTabChange = (status: string) => {
    setActiveTab(status);
    setCurrentPage(1);
  };

  return (
    <Sidebar>
      <div className="flex flex-col p-6 space-y-6 bg-gray-50">
        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center justify-between bg-blue-100 border border-blue-300 p-4 rounded-lg shadow-sm">
            <div className="text-blue-700 font-semibold">Diajukan</div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
              <FaHourglassHalf />
              {processCounts.DIAJUKAN}
            </div>
          </div>
          <div className="flex items-center justify-between bg-green-100 border border-green-300 p-4 rounded-lg shadow-sm">
            <div className="text-green-700 font-semibold">Disetujui</div>
            <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
              <FaCheckCircle />
              {processCounts.DISETUJUI}
            </div>
          </div>
          <div className="flex items-center justify-between bg-red-100 border border-red-300 p-4 rounded-lg shadow-sm">
            <div className="text-red-700 font-semibold">Ditolak</div>
            <div className="flex items-center gap-2 text-red-600 font-bold text-xl">
              <FaTimesCircle />
              {processCounts.DITOLAK}
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
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="dokumen" className="block text-sm font-medium text-gray-700">
                    Unggah Dokumen
                  </label>
                  <input
                    type="file"
                    id="dokumen"
                    name="dokumen"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Submit
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs - Updated to only show Diajukan, Disetujui, Ditolak */}
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
              {currentData.map((item, index) => (
                <tr key={item.id} className="text-center">
                  <td className="px-4 py-2 border">{startIndex + index + 1}</td>
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
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaEye />
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Diproses" && (
                    <>
                      <td className="px-4 py-2 border">{item.enumerator}</td>
                      <td className="px-4 py-2 border">{item.progress}</td>
                      <td className="px-4 py-2 border">{item.tanggalAssign}</td>
                      <td className="px-4 py-2 border">
                        <button className="text-green-600 hover:text-green-800">
                          <FaPaperPlane />
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Selesai" && (
                    <>
                      <td className="px-4 py-2 border">{item.enumerator}</td>
                      <td className="px-4 py-2 border">{item.nilai}</td>
                      <td className="px-4 py-2 border">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaEye />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md font-semibold ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
