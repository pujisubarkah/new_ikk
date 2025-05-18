'use client';
import { useState } from 'react';

import DiajukanTab from './DiajukanTab';
import DisetujuiTab from './DisetujuiTab';
import DiprosesTab from './DiprosesTab';
import SelesaiTab from './SelesaiTab';

export default function PolicyTabTable() {
    const [activeTab, setActiveTab] = useState("Diajukan");

    return (
        <div className="w-full">
            {/* Tab Navigation - Styling disamakan seperti DashboardPage */}
            <div className="flex space-x-2 md:space-x-4 mb-6 overflow-x-auto">
                {["Diajukan", "Disetujui", "Diproses", "Selesai"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold whitespace-nowrap ${
                            activeTab === tab
                                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 bg-gray-200"
                        }`}
                    >
                        Kebijakan {tab}
                    </button>
                ))}
            </div>

            {/* Render komponen tab aktif */}
            <div className="mt-4">
                {activeTab === "Diajukan" && <DiajukanTab />}
                {activeTab === "Disetujui" && <DisetujuiTab />}
                {activeTab === "Diproses" && <DiprosesTab />}
                {activeTab === "Selesai" && <SelesaiTab />}
            </div>
        </div>
    );
}
