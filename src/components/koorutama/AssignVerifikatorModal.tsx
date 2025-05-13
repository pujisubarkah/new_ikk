"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Verifikator {
  id: string;
  name: string;
}

interface Instansi {
  id: string;
  nama: string;
}

interface AssignVerifikatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  instansi: Instansi;
  onAssignSuccess?: () => void;
}

export default function AssignVerifikatorModal({
  isOpen,
  onClose,
  instansi,
  onAssignSuccess,
}: AssignVerifikatorModalProps) {
  const [verifikators, setVerifikators] = useState<Verifikator[]>([]);
  const [selectedVerifikatorId, setSelectedVerifikatorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchVerifikators = async () => {
    setLoading(true);
    try {
      const koorId = typeof window !== 'undefined' ? localStorage.getItem("id") : null;

      if (!koorId) {
        throw new Error("ID koordinator tidak ditemukan");
      }

      const res = await axios.get(`/api/koordinator_utama/${koorId}/verifikator`);

      interface ApiResponseVerifikator {
        id: string;
        name?: string;
        username?: string;
      }

     const mappedData = res.data.map((item: ApiResponseVerifikator) => ({
  id: item.id,
  name: item.name || "Tanpa Nama",
  username: item.username || "-",
}));

      setVerifikators(mappedData);
    } catch (error) {
      toast.error("Gagal memuat daftar verifikator");
      setVerifikators([]);
    } finally {
      setLoading(false);
    }
  };

  if (isOpen) {
    fetchVerifikators();
  }
}, [isOpen]);

  const handleSubmit = async () => {
    if (!instansi || !instansi.id || !selectedVerifikatorId) {
      toast.error("Pilih instansi dan verifikator terlebih dahulu");
      return;
    }

    const loadingToastId = toast.loading("Menetapkan verifikator...");

    try {
      const res = await axios.post(`/api/instansi/${instansi.id}/pilih-verifikator`, {
        verifikatorId: selectedVerifikatorId, // Sesuaikan dengan endpoint backend
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Verifikator berhasil ditetapkan", { id: loadingToastId });
        onAssignSuccess?.();
        onClose();
      }
    } catch (error) {
      toast.error("Gagal menetapkan verifikator", {
        description: axios.isAxiosError(error)
          ? error.response?.data.message || error.message
          : "Silakan coba lagi",
        id: loadingToastId,
      });
      console.error("Error assigning verifikator:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Pilih Verifikator</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mb-5 text-sm text-gray-600">
          Pilih verifikator untuk instansi: <br />
          <span className="font-semibold text-gray-800">{instansi.nama}</span>
        </p>
        <div className="mb-6">
          <label htmlFor="verifikatorSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Verifikator
          </label>
          <select
            id="verifikatorSelect"
            value={selectedVerifikatorId || ""}
            onChange={(e) => setSelectedVerifikatorId(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="" disabled>{loading ? "Memuat..." : "-- Pilih Verifikator --"}</option>
            {verifikators.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} 
              </option>
            ))}
          </select>
          {verifikators.length === 0 && !loading && (
            <p className="text-xs text-red-600 mt-1">Tidak ada verifikator tersedia.</p>
          )}
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedVerifikatorId || loading}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed`}
          >
            {loading ? "Memproses..." : "Tetapkan Verifikator"}
          </button>
        </div>
      </div>
    </div>
  );
}