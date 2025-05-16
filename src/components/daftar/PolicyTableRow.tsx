'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaPaperPlane } from 'react-icons/fa';
import AssignAnalystModal from './AssignAnalystModal'; // pastikan file ini tersedia
import axios from 'axios';
import { toast } from 'sonner';

interface Policy {
  id: number;
  nama: string;
  tanggal?: string;
  proses?: string;
  file?: string;
  enumerator?: string;
  progress?: string;
  tanggalAssign?: string;
  nilai_akhir: string;
  instansi?: string;
  status?: string;
}

interface PolicyRowProps {
  item: Policy;
  index: number;
    
    showProgress?: boolean;
    showAssignDate?: boolean;
    showViewButton?: boolean;
  tab: 'diajukan' | 'disetujui' | 'diproses' | 'selesai';
}

export default function PolicyTableRow({ item, index, tab }: PolicyRowProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  const handleSend = async (policyId: number) => {
    const confirmSend = confirm('Yakin ingin mengirim hasil ke Koordinator Nasional?');
    if (!confirmSend) return;

    const koorinstansiId = localStorage.getItem('id');

    try {
      await toast.promise(
        axios.post(
          `/api/policies/kirim-koordinator`,
          { id: policyId },
          {
            headers: {
              'x-koorinstansi-id': koorinstansiId,
              'Content-Type': 'application/json',
            },
          }
        ),
        {
          loading: 'Sedang mengirim ke Koordinator Nasional...',
          success: () => 'Marvelous! Berhasil dikirim ke Koordinator Nasional!',
          error: 'Ups! Gagal mengirim. Coba lagi ya Kak!',
        }
      );
    } catch (err) {
      console.error('Error sending to coordinator:', err);
    }
  };

  return (
    <>
      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
        {/* Kolom Umum */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{index}</td>
        <td className="px-4 py-3 text-sm text-gray-900 font-medium border-r">{item.nama}</td>

        {/* Tab: Diajukan */}
        {tab === 'diajukan' && (
          <>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.tanggal}</td>
            <td className="px-4 py-3 text-sm text-gray-700 border-r">
              {item.file ? (
                <a href={item.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  Lihat File
                </a>
              ) : (
                '-'
              )}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.proses || '-'}</td>
          </>
        )}

        {/* Tab: Disetujui */}
        {tab === 'disetujui' && (
          <>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">
              {item.enumerator || 'Belum ditetapkan'}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.tanggal}</td>
            <td className="px-4 py-3 text-center whitespace-nowrap text-sm font-medium">
  <button
    onClick={() => {
      console.log('Tombol "Pilih Analis" diklik');
      console.log('Data policy yang dikirim ke modal:', item);
      setIsModalOpen(true);
    }}
    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md shadow-sm"
    title={`Pilih analis untuk ${item.nama}`}
  >
    Pilih Analis
  </button>
</td>
          </>
        )}

        {/* Tab: Diproses */}
        {tab === 'diproses' && (
          <>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">
              {item.enumerator || 'Belum Ditetapkan'}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700 border-r">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: item.progress || '0%' }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1 block text-center">{item.progress}</span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.tanggalAssign}</td>
            <td className="px-4 py-3 text-center whitespace-nowrap text-sm font-medium flex justify-center items-center gap-2">
              <button
                onClick={() => router.push(`/koordinator-instansi/daftar-kebijakan/prosesdetail/${item.id}`)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 p-1"
                title={`Lihat detail proses ${item.nama}`}
              >
                <FaEye size={16} />
                <span className="text-sm">Lihat</span>
              </button>

              <button
                onClick={() => handleSend(item.id)}
                className="flex items-center gap-1 text-green-600 hover:text-green-800 p-1"
                title="Kirim ke Koordinator Nasional"
              >
                <FaPaperPlane size={16} />
                <span className="text-sm">Kirim</span>
              </button>
            </td>
          </>
        )}

        {/* Tab: Selesai */}
        {tab === 'selesai' && (
          <>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.enumerator}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.nilai_akhir || '-'}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r">{item.nilai_akhir || '-'}</td>
          </>
        )}
      </tr>

      {/* Modal dipindahkan keluar dari tabel agar tidak rusak struktur HTML */}
      <AssignAnalystModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        policy={item} // Kirim seluruh objek policy jika perlu
      />
    </>
  );
}
