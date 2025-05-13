// components/KoordinatorTab.tsx
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";

interface DataRow {
  no: number;
  nama: string;
  nip: string;
}

interface Props {
  data: DataRow[];
  search: string;
  onKeluarkan: (nama: string) => void;
}

const KoordinatorTab: React.FC<Props> = ({ data, search, onKeluarkan }) => {
  const filteredData = data.filter((row) =>
    row.nama.toLowerCase().includes(search.toLowerCase()) ||
    row.nip.includes(search)
  );

  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-100 text-gray-800 font-semibold">
          <tr>
            <th className="px-6 py-3 border-b">No</th>
            <th className="px-6 py-3 border-b">Nama</th>
            <th className="px-6 py-3 border-b">NIP/No Identitas</th>
            <th className="px-6 py-3 border-b text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row) => (
              <tr key={`${row.no}-${row.nip}`} className="hover:bg-blue-50 transition duration-150">
                <td className="px-6 py-4 border-b text-center">{row.no}</td>
                <td className="px-6 py-4 border-b">{row.nama}</td>
                <td className="px-6 py-4 border-b">{row.nip}</td>
                <td className="px-6 py-4 border-b text-center">
                  <button
                    onClick={() => onKeluarkan(row.nama)}
                    className="text-red-600 hover:text-red-800 flex items-center justify-center gap-1 transition duration-150"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span className="hidden sm:inline">Keluarkan</span>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                Tidak ada hasil yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default KoordinatorTab;
