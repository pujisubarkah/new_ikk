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
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 mt-4">
                {["Diajukan", "Disetujui", "Diproses", "Selesai"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                            activeTab === tab
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
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