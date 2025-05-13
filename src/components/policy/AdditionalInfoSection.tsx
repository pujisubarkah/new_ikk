'use client';
import React from 'react';

interface AdditionalInfoSectionProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSave?: () => void;
    dimensionName?: string;
}

export default function AdditionalInfoSection({ 
    value, 
    onChange, 
    onSave,
    dimensionName = "dimensi tidak diketahui"
}: AdditionalInfoSectionProps) {

    const getDescription = () => {
        switch(dimensionName) {
            case "Perencanaan Kebijakan":
                return "Jelaskan informasi tambahan terkait proses perencanaan kebijakan.";
            case "Implementasi Kebijakan":
                return "Berikan detail tambahan tentang implementasi kebijakan di lapangan.";
            case "Evaluasi dan Keberlanjutan Kebijakan":
                return "Tuliskan informasi tambahan mengenai evaluasi dan keberlanjutan kebijakan.";
            case "Transparansi dan Partisipasi Publik":
                return "Tambahkan informasi tambahan terkait transparansi dan partisipasi publik dalam kebijakan ini.";
            default:
                return "Tuliskan informasi tambahan...";
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Informasi Tambahan</h3>
            <p className="text-sm text-gray-600">{getDescription()}</p>
            <textarea
                value={value}
                onChange={onChange}
                rows={5}
                placeholder="Tuliskan informasi tambahan..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <div className="text-right">
                <button
                    onClick={onSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md shadow"
                >
                    Simpan
                </button>
            </div>
        </div>
    );
}