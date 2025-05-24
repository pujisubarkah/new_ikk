"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import Sidebar from "@/components/sidebar-koornas";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "sonner"; // Import toast

interface Instansi {
  id: string;
  agency_name: string;
}

interface KebijakanDetail {
  no: number;
  nama_kebijakan: string;
  sektor: string;
  file_url: string;
  status: string;
  id: string;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
});

const Page = () => {
  const { id } = useParams() ?? { id: "" };
  const router = useRouter();
  const [kebijakanData, setKebijakanData] = useState<KebijakanDetail[]>([]);

  // Fetch instansi data
  const { data: instansi, error: instansiError } = useSWR(id ? `/api/instansi/${id}/instansi` : null, fetcher);

  // Fetch kebijakan data
  const { data: kebijakan, error: kebijakanError } = useSWR(id ? `/api/instansi/${id}/kebijakan-diajukan` : null, fetcher);

  // Map kebijakan data when it is fetched
  React.useEffect(() => {
    if (kebijakan) {
      const mappedData: KebijakanDetail[] = kebijakan.map(
        (policy: { id: string; nama_kebijakan: string; sektor: string; file_url: string; status: string }, index: number) => ({
          no: index + 1,
          nama_kebijakan: policy.nama_kebijakan,
          sektor: policy.sektor || "-",
          file_url: policy.file_url || "-",
          status: policy.status,
          id: policy.id,
        })
      );
      setKebijakanData(mappedData);
    }
  }, [kebijakan]);

  const handleApprove = async (policyId: string) => {
    try {
      const response = await fetch(`/api/policies/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: policyId }),
      });

      if (!response.ok) throw new Error("Gagal menyetujui kebijakan");

      // Update local data after approval
      mutate(`/api/instansi/${id}/kebijakan-diajukan`, (prevData?: KebijakanDetail[]) => {
        if (!prevData) return [];
        return prevData.map(item => 
          item.id === policyId ? { ...item, status: "Disetujui" } : item
        );
      }, false); // false to prevent revalidation

      toast.success("Kebijakan berhasil disetujui!"); // Menampilkan toast sukses
    } catch (error) {
      console.error("Error approving policy:", error);
      toast.error("Terjadi kesalahan saat menyetujui kebijakan."); // Menampilkan toast error
    }
  };

  const handleReject = async (policyId: string) => {
    try {
      const response = await fetch(`/api/policies/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: policyId }),
      });

      if (!response.ok) throw new Error("Gagal menolak kebijakan");

      mutate(`/api/instansi/${id}/kebijakan-diajukan`, (prevData?: KebijakanDetail[]) => {
        if (!prevData) return [];
        return prevData.map(item => 
          item.id === policyId ? { ...item, status: "Ditolak" } : item
        );
      }, false); // false to prevent revalidation

      toast.success("Kebijakan ditolak!"); // Menampilkan toast sukses
    } catch (error) {
      console.error("Error rejecting policy:", error);
      toast.error("Terjadi kesalahan saat menolak kebijakan."); // Menampilkan toast error
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-white shadow-md border-r">
        <Sidebar>
          <div>Sidebar Content</div>
        </Sidebar>
      </div>

      <div className="flex-1 p-20 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Daftar Kebijakan yang Diajukan - {instansi?.agency_name || decodeURIComponent(String(id))}
        </h1>

        <button
          onClick={() => router.push("/koordinator-utama/daftar-kebijakan")}
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          Back
        </button>

        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-100 text-gray-800 font-semibold">
              <tr>
                <th className="px-6 py-3 border-b">No</th>
                <th className="px-6 py-3 border-b">Nama Kebijakan</th>
                <th className="px-6 py-3 border-b">Sektor</th>
                <th className="px-6 py-3 border-b">File</th>
                <th className="px-6 py-3 border-b">Status</th>
                <th className="px-6 py-3 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kebijakanData.length > 0 ? (
                kebijakanData.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition duration-150">
                    <td className="px-6 py-4 border-b text-center">{item.no}</td>
                    <td className="px-6 py-4 border-b">{item.nama_kebijakan}</td>
                    <td className="px-6 py-4 border-b">{item.sektor}</td>
                    <td className="px-6 py-4 border-b">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {item.file_url ? "Lihat File" : "Tidak ada file"}
                      </a>
                    </td>
                    <td className="px-6 py-4 border-b">{item.status}</td>
                    <td className="px-6 py-4 border-b text-center">
                      <button
                        onClick={() => handleApprove(item.id)}  // Panggil fungsi approve
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-xs"
                      >
                        <FaCheckCircle className="text-white" />
                        DISETUJUI
                      </button>

                      <button
                        onClick={() => handleReject(item.id)}  // Panggil fungsi reject
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-xs"
                      >
                        <FaTimesCircle className="text-white" />
                        DITOLAK
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    {kebijakanError ? "Gagal memuat data kebijakan." : "Tidak ada kebijakan yang diajukan."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
