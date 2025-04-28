"use client";
import { FaExclamationTriangle } from 'react-icons/fa';

export default function ForbiddenPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
        <FaExclamationTriangle className="text-red-600 text-6xl mb-4" />
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">403 - Akses Ditolak</h1>
        <p className="text-lg text-gray-600 mb-6">Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Kembali ke Beranda
        </button>
      </div>
    )
  }
  