"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../../components/ui/button";
import Sidebar from "@/components/sidebar";
import {
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaPaperPlane,
} from "react-icons/fa";
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
  const [processCounts, setProcessCounts] = useState({
    DIAJUKAN: 0,
    DISETUJUI: 0,
    DITOLAK: 0,
  });

  const itemsPerPage = 5;
  const filteredData = data.filter((item) => item.status === activeTab);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const [sektorLainnya, setSektorLainnya] = useState(false);

  useEffect(() => {
    const fetchPolicies = async () => {
      const adminInstansiId = localStorage.getItem("id");
      if (!adminInstansiId) return;

      try {
        const res = await axios.get(
          `/api/policies/admin_instansi?admin_instansi_id=${adminInstansiId}`
        );
        const fetchedData = res.data.data;
        const counts = res.data.policyProcessCounts || {};

        const mappedData = fetchedData.map((item: { id: number; nama: string; sektor?: string; tanggal_berlaku?: string; file?: string; enumerator?: string; progress?: number; tanggalAssign?: string; nilai?: string; status: string }) => ({
          id: item.id,
          nama: item.nama,
          sektor: item.sektor || "Umum",
          tanggal: item.tanggal_berlaku
            ? new Date(item.tanggal_berlaku).toLocaleDateString('id-ID')
            : "-",
          file: item.file || "-",
          enumerator: item.enumerator || "-",
          progress: item.progress ? `${item.progress}%` : "-",
          tanggalAssign: item.tanggalAssign || "-",
          nilai: item.nilai || "-",
          status: mapStatus(item.status),
        }));

        setData(mappedData);
        setProcessCounts({
          DIAJUKAN: counts.PROSES || 0,
          DISETUJUI: counts.DISETUJUI || 0,
          DITOLAK: counts.DITOLAK || 0,
        });
      } catch (err) {
        console.error("Gagal fetch data policies", err);
      }
    };

    fetchPolicies();
  }, []);

  const mapStatus = (statusApi: string) => {
    const statusMap: Record<string, string> = {
      PROSES: "Diajukan",
      DISETUJUI: "Disetujui",
      DITOLAK: "Ditolak",
      DIAJUKAN: "Diajukan",
      SELESAI: "Selesai"
    };
    return statusMap[statusApi] || "Diajukan";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get("dokumen") as File;

    if (file && !["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
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

  const handleSektorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSektorLainnya(e.target.value === "Lainnya");
  };

  return (
    <Sidebar>
      <div className="flex flex-col p-6 space-y-6 bg-gray-50">
        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Diajukan", count: processCounts.DIAJUKAN, icon: <FaHourglassHalf />, color: "blue" },
            { label: "Disetujui", count: processCounts.DISETUJUI, icon: <FaCheckCircle />, color: "green" },
            { label: "Ditolak", count: processCounts.DITOLAK, icon: <FaTimesCircle />, color: "red" },
          ].map(({ label, count, icon, color }) => (
            <div
              key={label}
              className={`flex items-center justify-between bg-${color}-100 border border-${color}-300 p-4 rounded-lg shadow-sm`}
            >
              <div className={`text-${color}-700 font-semibold`}>{label}</div>
              <div className={`flex items-center gap-2 text-${color}-600 font-bold text-xl`}>
                {icon}
                {count}
              </div>
            </div>
          ))}
        </div>

        {/* Header and Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-700">Daftar Kebijakan</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                + Tambah Populasi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl mx-auto">
  <form onSubmit={handleSubmit}>
    {/* Dropdown Nama Kebijakan */}
    <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Nama dan Detail Kebijakan
  </label>
  <div className="flex gap-4">
    {/* Dropdown Nama Kebijakan */}
    <select
      id="nama_kebijakan"
      name="nama_kebijakan"
      required
      className="w-1/3 text-base py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Pilih</option>
      <option value="UU">UU</option>
      <option value="PP">PP</option>
      <option value="Perpres/Kepres">Perpres/Kepres</option>
      <option value="Permen/Kepmen">Permen/Kepmen</option>
      <option value="Perda">Perda</option>
      <option value="Perkada/Kepkada">Perkada/Kepkada</option>
      <option value="Perkains/Kepkains">Perkains/Kepkains</option>
      <option value="SE">SE</option>
    </select>

    {/* Input Detail Kebijakan */}
    <input
      type="text"
      id="detail_nama_kebijakan"
      name="detail_nama_kebijakan"
      required
      placeholder="Contoh: UU No. 11 Tahun 2020"
      className="flex-1 text-base py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
</div>

<div className="mb-4">
      <label htmlFor="sektor_kebijakan" className="block text-sm font-medium text-gray-700">
        Sektor Kebijakan
      </label>
      <select
        id="sektor_kebijakan"
        name="sektor_kebijakan"
        required
        onChange={handleSektorChange}
        className="mt-1 block w-full text-base py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Pilih Sektor</option>
        <option value="Infrastruktur">Infrastruktur</option>
        <option value="Pangan">Pangan</option>
        <option value="Ketenagakerjaan">Ketenagakerjaan</option>
        <option value="Sosial">Sosial</option>
        <option value="Pendidikan">Pendidikan</option>
        <option value="Kesehatan">Kesehatan</option>
        <option value="Aparatur Negara">Aparatur Negara</option>
        <option value="Perencana">Perencana</option>
        <option value="Lingkungan">Lingkungan</option>
        <option value="Lainnya">Lainnya</option>
      </select>

      {sektorLainnya && (
        <input
          type="text"
          id="sektor_kebijakan_lain"
          name="sektor_kebijakan_lain"
          placeholder="Sebutkan sektor lainnya"
          className="mt-2 block w-full text-base py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
    {/* Tanggal Berlaku */}
    <div className="mb-4">
      <label htmlFor="tanggal_berlaku" className="block text-sm font-medium text-gray-700">
        Tanggal Berlaku
      </label>
      <input
        type="date"
        id="tanggal_berlaku"
        name="tanggal_berlaku"
        required
        className="mt-1 block w-full text-base py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
      <p className="text-xs text-gray-500 mt-1">
        Hanya untuk kebijakan yang telah berlaku efektif minimal 1 tahun dan maksimal 2 tahun terakhir.
      </p>
    </div>

    {/* Link Drive */}
    <div className="mb-4">
      <label htmlFor="link_drive" className="block text-sm font-medium text-gray-700">
        Link Dokumen (Google Drive)
      </label>
      <input
        type="url"
        id="link_drive"
        name="link_drive"
        required
        placeholder="https://drive.google.com/..."
        className="mt-1 block w-full text-base py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Nama Kebijakan</th>
                {activeTab === "Diajukan" && (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Tanggal Berlaku</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">File</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Status</th>
                  </>
                )}
                {activeTab === "Disetujui" && (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Enumerator</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Tanggal Berlaku</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Aksi</th>
                  </>
                )}
                {activeTab === "Diproses" && (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Enumerator</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Progress</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Tanggal Assign</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Aksi</th>
                  </>
                )}
                {activeTab === "Selesai" && (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Enumerator</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Nilai</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Aksi</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">{startIndex + index + 1}</td>
                    <td className="px-4 py-3 border">{item.nama}</td>
                    {activeTab === "Diajukan" && (
                      <>
                        <td className="px-4 py-3 border">{item.tanggal}</td>
                        <td className="px-4 py-3 border">{item.file}</td>
                        <td className="px-4 py-3 border">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "Disetujui" ? "bg-green-100 text-green-800" :
                            item.status === "Ditolak" ? "bg-red-100 text-red-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </>
                    )}
                    {activeTab === "Disetujui" && (
                      <>
                        <td className="px-4 py-3 border">{item.enumerator}</td>
                        <td className="px-4 py-3 border">{item.tanggal}</td>
                        <td className="px-4 py-3 border">
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <FaEye size={18} />
                          </button>
                        </td>
                      </>
                    )}
                    {activeTab === "Diproses" && (
                      <>
                        <td className="px-4 py-3 border">{item.enumerator}</td>
                        <td className="px-4 py-3 border">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: item.progress }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{item.progress}</span>
                        </td>
                        <td className="px-4 py-3 border">{item.tanggalAssign}</td>
                        <td className="px-4 py-3 border">
                          <button className="text-green-600 hover:text-green-800 p-1">
                            <FaPaperPlane size={18} />
                          </button>
                        </td>
                      </>
                    )}
                    {activeTab === "Selesai" && (
                      <>
                        <td className="px-4 py-3 border">{item.enumerator}</td>
                        <td className="px-4 py-3 border">{item.nilai}</td>
                        <td className="px-4 py-3 border">
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <FaEye size={18} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500 border">
                    Tidak ada data kebijakan
                  </td>
                </tr>
              )}
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
