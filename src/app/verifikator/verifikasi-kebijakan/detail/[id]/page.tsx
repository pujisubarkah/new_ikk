"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar-verif";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";

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

interface PolicyApiResponse {
  id: string;
  nama_kebijakan: string;
  sektor: string;
  file_url: string;
  policy_status: string;
}

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = params && typeof params.id === "string" ? params.id : "";

  const [instansi, setInstansi] = useState<Instansi | null>(null);
  const [kebijakanData, setKebijakanData] = useState<KebijakanDetail[]>([]);

  // Decode ID safely
  const [decodedId, setDecodedId] = useState<string>("");

  useEffect(() => {
    let decoded = id;
    try {
      decoded = decodeURIComponent(id || "");
    } catch {
      decoded = id || "";
    }
    setDecodedId(decoded);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Fetch instansi data
        const instansiRes = await fetch(`/api/instansi/${id}/instansi`);
        const instansiData = await instansiRes.json();
        setInstansi(instansiData);

        // Fetch policy data
              const policyRes = await fetch(`/api/policies/${id}/menunggu-validasi-ku?_=${Date.now()}`);
      
      if (!policyRes.ok) throw new Error("Gagal mengambil data kebijakan");

      const policyData = await policyRes.json(); // <-- JSON response
      console.log("Raw Policy Data:", policyData);

      if (!policyData.data || !Array.isArray(policyData.data)) {
        console.error("Format data salah", policyData);
        setKebijakanData([]);
        return;
      }

   const mappedData = policyData.data.map((policy: PolicyApiResponse, index: number) => ({
  no: index + 1,
  nama_kebijakan: policy.nama_kebijakan,
  sektor: policy.sektor || "-",
  file_url: policy.file_url || "-",
  status: policy.policy_status,
  id: policy.id,
}));

      setKebijakanData(mappedData);
    } catch (error) {
      console.error("Error fetching policy data", error);
      toast.error("Gagal memuat data kebijakan");
    }
  };

  fetchData();
}, [id]);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-white shadow-md border-r">
        <Sidebar>
          {/* You can put sidebar content here or leave it empty if not needed */}
          <></>
        </Sidebar>
      </div>

      <div className="flex-1 p-8 md:p-20 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Daftar Kebijakan yang Harus Diverifikasi -{" "}
          {instansi?.agency_name || decodedId}
        </h1>

        <button
          onClick={() => router.push("/verifikator/verifikasi-kebijakan")}
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          Kembali
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
                        onClick={() =>
                          router.push(`/verifikator/verifikasi/${item.id}`)
                        }
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs mx-auto"
                      >
                        <FaCheckCircle /> Verified
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Tidak ada kebijakan yang perlu diverifikasi.
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
