'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface Analyst {
  id: number;
  name: string;
}

interface Policy {
  id: number;
  nama: string;
}

interface AssignAnalystModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: Policy;
}

export default function AssignAnalystModal({ isOpen, onClose, policy }: AssignAnalystModalProps) {
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [selectedAnalystId, setSelectedAnalystId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAnalysts = async () => {
      try {
        const koorId = localStorage.getItem('id');
        const res = await axios.get(`/api/koorinstansi/${koorId}/analis`);
        if (isMounted) {
          setAnalysts(res.data || []);
        }
      } catch {
        toast.error('Gagal memuat daftar analis');
        if (isMounted) setAnalysts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (isOpen) {
      setLoading(true);
      fetchAnalysts();
    }

    return () => {
      isMounted = false;
      setSelectedAnalystId(null); // reset pilihan saat modal ditutup
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!policy || !selectedAnalystId) {
      toast.error('Pilih kebijakan dan analis terlebih dahulu');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post('/api/policies/pilih-enumerator', {
        policyId: policy.id,
        analystId: selectedAnalystId,
      });

      console.log('Hasil assign:', res.data);

      if (res.status === 200 || res.status === 201) {
        toast.success('Analis berhasil ditetapkan');
        onClose();
      }
    } catch (error) {
      console.error('Assign gagal:', error);
      toast.error('Gagal menetapkan analis');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 transition-all transform animate-fade-in-scale">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Pilih Analis</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info Kebijakan */}
        <p className="text-sm text-gray-600 mb-4">
          Pilih analis untuk kebijakan: <br />
          <span className="font-semibold text-gray-900">{policy.nama}</span>
        </p>

        {/* Dropdown */}
        <div className="mb-6">
          <label htmlFor="analystSelect" className="block text-sm font-medium text-gray-700 mb-1">Pilih Analis</label>
          <select
            id="analystSelect"
            value={selectedAnalystId || ''}
            onChange={(e) => setSelectedAnalystId(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="">{loading ? 'Memuat analis...' : '-- Pilih Analis --'}</option>
            {analysts.map((analyst) => (
              <option key={analyst.id} value={analyst.id}>
                {analyst.name}
              </option>
            ))}
          </select>
          {!loading && analysts.length === 0 && (
            <p className="text-xs text-red-600 mt-1">Tidak ada analis tersedia.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedAnalystId || loading || submitting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${
              submitting || !selectedAnalystId ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Memproses...' : 'Tetapkan Analis'}
          </button>
        </div>
      </div>
    </div>
  );
}
