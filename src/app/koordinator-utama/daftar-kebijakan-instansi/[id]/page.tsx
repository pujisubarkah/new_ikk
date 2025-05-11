"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar-koornas";

interface Instansi {
  id: string;
  name: string;
}

interface KebijakanDetail {
  no: number;
  nama: string;
  sektor: string;
  file: string;
  id: string;
}

const Page = () => {
  const { id } = useParams() ?? { id: "" };
  const router = useRouter();
  const [instansi, setInstansi] = useState<Instansi | null>(null);
  const [kebijakanData, setKebijakanData] = useState<KebijakanDetail[]>([]);

  // Fetch instansi data based on ID
  useEffect(() => {
    const fetchInstansi = async () => {
      try {
        const response = await fetch(`/api/instansi/${id}`);
        const data = await response.json();
        setInstansi(data); // Assuming `data` contains agency_name and id
      } catch (error) {
        console.error("Failed to fetch instansi data", error);
      }
    };

    if (id) {
      fetchInstansi();
    }
  }, [id]);

  // Fetch kebijakan data based on agency_id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/koordinator-instansi?agency_id=${id}`);
        const data = await response.json();

        const policies = data?.[0]?.agencies?.policies || [];

        // Map the policies to match KebijakanDetail structure
        const mappedData: KebijakanDetail[] = policies.map((policy: { name: string; sector: string; file: string; id: string }, index: number) => ({
          no: index + 1,
          nama: policy.name,
          sektor: policy.sector || "-",
          file: policy.file || "-",
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
      <div className="flex-1 p-20 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Daftar Kebijakan yang Diajukan - {instansi?.name || decodeURIComponent(String(id))}
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
                <th className="px-6 py-3 border-b">Sektor</th>
                <th className="px-6 py-3 border-b">File</th>
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
                  <td className="px-6 py-4 border-b">{item.sektor}</td>
                  <td className="px-6 py-4 border-b">{item.file}</td>
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
