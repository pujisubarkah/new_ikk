"use client";
import { useParams, useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import React from "react";

interface KebijakanDetail {
  no: number;
  nama: string;
  progress: number;
  enumerator: string;
  tanggal: string;
  id: string; // id kebijakan untuk diarahkan ke detail
}

const mockData: KebijakanDetail[] = [
  {
    no: 1,
    nama: "Kebijakan Vaksinasi Lansia",
    progress: 80,
    enumerator: "Andi",
    tanggal: "2024-11-01",
    id: "kebijakan-001",
  },
  {
    no: 2,
    nama: "Kebijakan Pendidikan Gratis",
    progress: 50,
    enumerator: "Budi",
    tanggal: "2024-12-15",
    id: "kebijakan-002",
  },
  {
    no: 3,
    nama: "Kebijakan Transportasi Umum",
    progress: 95,
    enumerator: "Citra",
    tanggal: "2025-01-10",
    id: "kebijakan-003",
  },
];

const Page = () => {
  const { id } = useParams() ?? { id: "" };
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Daftar Kebijakan Instansi - {id}
      </h1>

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
            {mockData.map((item) => (
              <tr key={item.no} className="hover:bg-blue-50 transition duration-150">
                <td className="px-6 py-4 border-b text-center">{item.no}</td>
                <td className="px-6 py-4 border-b">{item.nama}</td>
                <td className="px-6 py-4 border-b w-56">
                  <Progress value={item.progress} />
                </td>
                <td className="px-6 py-4 border-b text-center">{item.enumerator}</td>
                <td className="px-6 py-4 border-b text-center">{item.tanggal}</td>
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
  );
};

export default Page;
