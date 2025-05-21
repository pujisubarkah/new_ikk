'use client';
import { useRouter } from 'next/navigation';

interface Policy {
    id: string;
    nama_kebijakan: string;
    status_kebijakan: string;
    tanggal_proses: string;
    instansi: string;
    progress_pengisian: number;
    nilai_akhir: number;
    nilai_akhir_verif: number;
}

export default function PolicyCard({ policy }: { policy: Policy }) {
    const router = useRouter();
    const statusColors = {
        'MASUK': 'bg-blue-500',
        'PROSES': 'bg-yellow-500',
        'SELESAI': 'bg-green-500'
    };

    return (
        <div className="p-6 rounded-xl shadow-md bg-white">
    <button
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        onClick={() => router.back()}
    >
        <span>Kembali</span>
    </button>
    <div className="mb-4">
        <small className="text-gray-500 text-sm">{policy.instansi}</small>
        <h2 className="text-xl font-bold text-gray-800 mt-1">{policy.nama_kebijakan}</h2>
    </div>
    <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
        <div>
            <small className="text-gray-500 text-sm">Status Kebijakan</small>
            <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium mt-1 ${
                statusColors[policy.status_kebijakan as keyof typeof statusColors] || 'bg-gray-500'
            }`}>
                {policy.status_kebijakan}
            </span>
        </div>
        <div>
            <small className="text-gray-500 text-sm">Tanggal Pengesahan</small>
            <strong className="text-gray-800 mt-1 block">
                {new Date(policy.tanggal_proses).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}
            </strong>
        </div>
        <div className="flex items-center gap-2">
            <small className="text-gray-500 text-sm">Progres</small>
            <div className="w-32 bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${policy.progress_pengisian}%` }}
                ></div>
            </div>
            <span className="text-blue-600 text-sm font-medium">
                {Number(policy.progress_pengisian).toFixed(2)}%
            </span>
        </div>
        <div>
            <small className="text-gray-500 text-sm">Self Assessment</small>
            <strong className="text-gray-800 mt-1 block">
                {policy.nilai_akhir ?? '-'}
            </strong>
        </div>
        <div>
            <small className="text-gray-500 text-sm">Verifikator</small>
            <strong className="text-gray-800 mt-1 block">
                {policy.nilai_akhir_verif ?? '-'}
            </strong>
        </div>
    </div>
</div>

    );
}