// components/PolicyTabTable.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SendPolicyDialog from "./SendPolicyDialog";

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
  instansi: string;
}

interface Analyst {
  id: number;
  nama: string;
}

export default function PolicyTabTable() {
  const [activeTab, setActiveTab] = useState("Diajukan");
  const [data, setData] = useState<Policy[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [openAnalystModal, setOpenAnalystModal] = useState(false);
  const [selectedAnalystId, setSelectedAnalystId] = useState<number | null>(null);
  const router = useRouter();

  // Map tab names to API status values
  const statusMap = {
    "Diajukan": "DIAJUKAN",
    "Disetujui": "DISETUJUI",
    "Diproses": "PROSES",
    "Selesai": "SELESAI"
  };

  const filteredData = data.filter((item) => 
    item.status === statusMap[activeTab as keyof typeof statusMap]
  );
  const totalPages = Math.ceil(filteredData.length / 5);
  const startIndex = (currentPage - 1) * 5;
  const currentData = filteredData.slice(startIndex, startIndex + 5);

  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const adminInstansiId = localStorage.getItem("id");
      console.log('Admin ID:', adminInstansiId); // Debug log
      
      if (!adminInstansiId) {
        toast.error("ID admin tidak ditemukan");
        return;
      }

      let endpoint = "";
      switch (activeTab) {
        case "Diajukan":
          endpoint = `/api/policies/${adminInstansiId}/diajukan`;
          break;
        case "Disetujui":
          endpoint = `/api/policies/${adminInstansiId}/disetujui`;
          break;
        case "Diproses":
          endpoint = `/api/policies/${adminInstansiId}/diproses`;
          break;
        case "Selesai":
          endpoint = `/api/policies/${adminInstansiId}/selesai`;
          break;
        default:
          endpoint = `/api/policies/${adminInstansiId}/diajukan`;
      }

      console.log('Fetching from endpoint:', endpoint); // Debug log
      const res = await axios.get(endpoint);
      console.log('API Response:', res.data); // Debug log
      
      const fetchedData = res.data?.data || [];

      const mappedData = Array.isArray(fetchedData)
        ? fetchedData.map((item) => ({
            id: parseInt(item.id, 10),
            nama: item.nama_kebijakan || "-",
            sektor: item.sektor || "-",
            tanggal: item.tanggal_berlaku
              ? new Date(item.tanggal_berlaku).toLocaleDateString("id-ID")
              : "-",
            file: item.file_url || "-",
            enumerator: item.enumerator || "-",
            progress: item.progress 
              ? `${item.progress}%` 
              : "0%",
            tanggalAssign: item.tanggal_proses || item.tanggal_assign
              ? new Date(item.tanggal_proses || item.tanggal_assign).toLocaleDateString("id-ID")
              : "-",
            nilai: "-",
            instansi: item.instansi || "-",
            status: item.proses || "-",
          }))
        : [];

      console.log('Mapped Data:', mappedData); // Debug log
      setData(mappedData);
    } catch (err) {
      console.error("Gagal fetch data policies", err);
      toast.error("Gagal memuat data kebijakan");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalysts = async () => {
    try {
      const res = await axios.get("/api/analysts");
      setAnalysts(res.data || []);
    } catch (err) {
      console.error("Gagal fetch data analysts", err);
      toast.error("Gagal memuat daftar analis");
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [activeTab]);

  useEffect(() => {
    if (openAnalystModal) {
      fetchAnalysts();
    }
  }, [openAnalystModal]);

  const handleTabChange = (status: string) => {
    setActiveTab(status);
    setCurrentPage(1);
  };

  const handleAssignAnalystClick = (policy: Policy) => {
    setSelectedPolicy(policy);
    setOpenAnalystModal(true);
  };

  const handleSubmitAnalyst = async () => {
    if (!selectedPolicy || !selectedAnalystId) {
      toast.error("Harap pilih analis terlebih dahulu");
      return;
    }

    try {
      const res = await axios.post("/api/policies/assign-analyst", {
        policyId: selectedPolicy.id,
        analystId: selectedAnalystId,
      });

      if (res.status === 200) {
        toast.success("Analis berhasil ditetapkan");
        setOpenAnalystModal(false);
        setSelectedPolicy(null);
        setSelectedAnalystId(null);
        fetchPolicies();
      } else {
        throw new Error(res.data.message || "Gagal menetapkan analis");
      }
    } catch (err) {
      console.error("Gagal menetapkan analis", err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Gagal menetapkan analis");
      }
    }
  };

  return (
    <>
      {/* Tombol Kirim Kebijakan (hanya di tab Diajukan) */}
      {activeTab === "Diajukan" && data.some((item) => item.status === "DIAJUKAN") && (
        <div className="mt-6 flex justify-end">
          <SendPolicyDialog onSend={() => console.log("Policy sent")}>
            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-md hover:bg-green-700 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Kirim Kebijakan
            </button>
          </SendPolicyDialog>
        </div>
      )}

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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Analis Instansi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Tanggal Berlaku</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Aksi</th>
                </>
              )}

              {activeTab === "Diproses" && (
                <>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Analis Instansi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Tanggal Assign</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Aksi</th>
                </>
              )}

              {activeTab === "Selesai" && (
                <>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Analis Instansi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Nilai</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Aksi</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Memuat data...
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">{startIndex + index + 1}</td>
                  <td className="px-4 py-3 border">{item.nama}</td>
                  
                  {activeTab === "Diajukan" && (
                    <>
                      <td className="px-4 py-3 border">{item.tanggal}</td>
                      <td className="px-4 py-3 border">
                        {item.file !== "-" ? (
                          <a 
                            href={item.file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Lihat File
                          </a>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 border">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "DISETUJUI"
                              ? "bg-green-100 text-green-800"
                              : item.status === "DITOLAK"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </>
                  )}

                  {activeTab === "Disetujui" && (
                    <>
                      <td className="px-4 py-3 border">{item.enumerator || "Belum ditetapkan"}</td>
                      <td className="px-4 py-3 border">{item.tanggal}</td>
                      <td className="px-4 py-3 border">
                        <button
                          onClick={() => handleAssignAnalystClick(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md shadow-sm transition duration-150 text-sm"
                        >
                          Pilih Analis Instansi
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
                        <span className="text-xs text-gray-500 mt-1 block text-center">{item.progress}</span>
                      </td>
                      <td className="px-4 py-3 border">{item.tanggalAssign}</td>
                      <td className="px-4 py-3 border">
                      <button 
  onClick={() => router.push(`/koordinator-instansi/daftar-kebijakan/prosesdetail/${item.id}`)}
  className="text-green-600 hover:text-green-800 p-1"
>
  <FaEye size={18} />
</button>
                      </td>
                    </>
                  )}

                  {activeTab === "Selesai" && (
                    <>
                      <td className="px-4 py-3 border">{item.enumerator}</td>
                      <td className="px-4 py-3 border">{item.nilai}</td>
                      <td className="px-4 py-3 border">
                        <button 
                          onClick={() => router.push(`/kebijakan/detail/${item.id}`)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" />
                            <path d="M12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                          </svg>
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

      {/* Analyst Assignment Modal */}
      {openAnalystModal && selectedPolicy && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Pilih Analis untuk Kebijakan</h2>
            <p className="mb-2"><strong>Kebijakan:</strong> {selectedPolicy.nama}</p>
            
            <label className="block mb-2 font-medium text-sm">Pilih Analis:</label>
            <select
              value={selectedAnalystId ?? ""}
              onChange={(e) => setSelectedAnalystId(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            >
              <option value="">-- Pilih Analis --</option>
              {analysts.map((analyst) => (
                <option key={analyst.id} value={analyst.id}>
                  {analyst.nama}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setOpenAnalystModal(false);
                  setSelectedPolicy(null);
                  setSelectedAnalystId(null);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSubmitAnalyst}
                disabled={!selectedAnalystId}
              >
                Tetapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}