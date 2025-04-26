"use client";

import { useParams, useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar-koor";

interface KebijakanDetail {
  no: number;
  nama: string;
  progress: number;
  enumerator: string;
  tanggal: string;
  id: string;
}

const Page = () => {
  const { id } = useParams() ?? { id: "" };
  const router = useRouter();
  const [kebijakanData, setKebijakanData] = useState<KebijakanDetail[]>([]);

  // Fetch data from API based on agency_id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/koordinator-instansi?agency_id=${id}`);
        const data = await response.json();

        const policies = data?.[0]?.agencies?.policies || [];

        // Map the policies to match KebijakanDetail structure
        const mappedData: KebijakanDetail[] = policies.map((policy: { name: string; progress: number; enumerator: string; tanggal_proses: string; id: string }, index: number) => ({
          no: index + 1,
          nama: policy.name,
          progress: policy.progress,
          enumerator: policy.enumerator,
          tanggal: new Date(policy.tanggal_proses).toLocaleDateString(),
          id: policy.id,
        }));

        setKebijakanData(mappedData);
      } catch (error) {
        console.error("Failed to fetch kebijakan data", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md border-r">
        <Sidebar>
          <div>Sidebar Content</div>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Daftar Kebijakan Instansi - {decodeURIComponent(String(id))}
        </h1>

        {/* Back Button */}
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
                <th className="px-6 py-3 border-b">Proses Penilaian</th>
                <th className="px-6 py-3 border-b">Enumerator</th>
                <th className="px-6 py-3 border-b">Tanggal Proses</th>
                <th className="px-6 py-3 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kebijakanData.map((item) => (
                <tr
                  key={item.no}
                  className="hover:bg-blue-50 transition duration-150"
                >
                  <td className="px-6 py-4 border-b text-center">{item.no}</td>
                  <td className="px-6 py-4 border-b">{item.nama}</td>
                  <td className="px-6 py-4 border-b w-56">
                    <Progress value={item.progress} />
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    {item.enumerator}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    {item.tanggal}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    <button
                      onClick={() =>
                        router.push(`/koordinator-utama/detail-kebijakan/${item.id}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-xs"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;

