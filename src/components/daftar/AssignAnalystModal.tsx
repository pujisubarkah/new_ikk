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

    useEffect(() => {
        const fetchAnalysts = async () => {
            try {
                const koorId = localStorage.getItem('id');
                const res = await axios.get(`/api/koorinstansi/${koorId}/analis`);
                setAnalysts(res.data.data || []);
            } catch (err) {
                toast.error('Gagal memuat daftar analis');
                setAnalysts([]);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) fetchAnalysts();
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!policy || !selectedAnalystId) {
            toast.error('Pilih kebijakan dan analis terlebih dahulu');
            return;
        }

        try {
            const res = await axios.post('/api/policies/pilih-enumerator', {
                policyId: policy.id,
                analystId: selectedAnalystId,
            });

            if (res.status === 200 || res.status === 201) {
                toast.success('Analis berhasil ditetapkan');
                onClose();
            }
        } catch (err) {
            toast.error('Gagal menetapkan analis');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 transform transition-all scale-95 opacity-0 animate-fade-in-scale">
                <div className="flex justify-between items-center mb-4 pb-3 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">Pilih Analis</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="mb-5 text-sm text-gray-600">
                    Pilih analis untuk kebijakan: <br/>
                    <span className="font-semibold text-gray-800">{policy.nama}</span>
                </p>
                <div className="mb-6">
                    <label htmlFor="analystSelect" className="block text-sm font-medium text-gray-700 mb-1">Pilih Analis</label>
                    <select
                        id="analystSelect"
                        value={selectedAnalystId || ''}
                        onChange={(e) => setSelectedAnalystId(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="" disabled>{loading ? 'Memuat...' : '-- Pilih Analis --'}</option>
                        {analysts.map(analyst => (
                            <option key={analyst.id} value={analyst.id}>
                                {analyst.name} (ID: {analyst.id})
                            </option>
                        ))}
                    </select>
                    {analysts.length === 0 && !loading && (
                        <p className="text-xs text-red-600 mt-1">Tidak ada analis tersedia.</p>
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
                        disabled={!selectedAnalystId || loading}
                        className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed`}
                    >
                        Tetapkan Analis
                    </button>
                </div>
            </div>
        </div>
    );
}