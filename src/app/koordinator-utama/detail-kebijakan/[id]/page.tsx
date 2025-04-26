"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/sidebar-koor";

const dummyData = {
    "Agenda Setting": [
        {
            id: "agenda1",
            nomor: "A1.",
            pertanyaan: "Apakah kebijakan ini berdasarkan kebutuhan masyarakat?",
            pilihanJawaban: [
                "Ya, berdasarkan hasil konsultasi publik",
                "Tidak, hanya berdasarkan inisiatif internal",
            ],
            buktiRequired: true,
        },
        {
            id: "agenda2",
            nomor: "A2.",
            pertanyaan: "Apakah ada analisis masalah sebelum penyusunan kebijakan?",
            pilihanJawaban: [
                "Ya, analisis mendalam dilakukan",
                "Tidak ada analisis khusus",
            ],
            buktiRequired: true,
        },
    ],
    "Formulasi Kebijakan": [
        {
            id: "formulasi1",
            nomor: "F1.",
            pertanyaan: "Apakah kebijakan disusun dengan melibatkan multi-stakeholder?",
            pilihanJawaban: [
                "Ya, melalui forum konsultasi",
                "Tidak, hanya internal",
            ],
            buktiRequired: true,
        },
    ],
    "Implementasi Kebijakan": [
        {
            id: "implementasi1",
            nomor: "I1.",
            pertanyaan: "Apakah ada SOP pelaksanaan kebijakan?",
            pilihanJawaban: [
                "Ya, SOP tersedia dan didistribusikan",
                "Tidak ada SOP",
            ],
            buktiRequired: true,
        },
    ],
    "Evaluasi Kebijakan": [
        {
            id: "evaluasi1",
            nomor: "E1.",
            pertanyaan: "Apakah dilakukan evaluasi dampak setelah implementasi?",
            pilihanJawaban: [
                "Ya, evaluasi berkala dilakukan",
                "Tidak ada evaluasi",
            ],
            buktiRequired: true,
        },
    ],
};

export default function DetailPolicyCard() {
    const tabs = Object.keys(dummyData);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<keyof typeof dummyData>(tabs[0] as keyof typeof dummyData);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [uploads, setUploads] = useState<{ [key: string]: File | null }>({});

    const handleAnswerChange = (id: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (id: string, file: File | null) => {
        setUploads((prev) => ({ ...prev, [id]: file }));
    };

    const handleSave = () => {
        console.log("Jawaban:", answers);
        console.log("File Upload:", uploads);
        alert("Data berhasil disimpan! 🚀");
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4">
                <Sidebar>
                    <></>
                </Sidebar>
            </div>

            {/* Main Content */}
            <Card className="p-20 w-3/4 h-full overflow-y-auto">
                <div className="flex flex-col space-y-6">
                    {/* Tombol Kembali */}
                    <div className="flex justify-start mb-4">
                        <Button
                            variant="secondary"
                            onClick={() => router.push(`/koordinator-utama/daftar-kebijakan-instansi`)}
                            className="border-gray-400"
                        >
                            ⬅️ Kembali
                        </Button>
                    </div>

                    {/* Header - Instansi dan Judul Kebijakan */}
                    <div className="flex flex-col mb-4">
                        <small className="text-gray-500">Sekretariat Jenderal DPD 2023</small>
                        <h5 className="text-lg font-bold mt-1">
                            Peraturan Dewan Perwakilan Daerah Republik Indonesia Nomor 4 Tahun 2022 tentang Pemantauan dan Evaluasi Rancangan Peraturan Daerah dan Peraturan Daerah
                        </h5>
                    </div>

                    {/* Info Statistika */}
                    <div className="flex flex-wrap justify-between gap-4">
                        <div className="flex flex-col">
                            <small className="text-gray-600">Status Kebijakan</small>
                            <span className="text-xs bg-yellow-400 text-white px-2 py-1 rounded-full mt-1">PROSES</span>
                        </div>
                        <div className="flex flex-col">
                            <small className="text-gray-600">Tanggal Pengesahan</small>
                            <strong className="mt-1">06-10-2022</strong>
                        </div>
                        <div className="flex flex-col">
                            <small className="text-gray-600">Progress Pengisian</small>
                            <div className="mt-1 w-32">
                                <Progress value={100} />
                                <small className="text-xs text-gray-500 text-center block mt-1">100%</small>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <small className="text-gray-600">Nilai 1</small>
                            <strong className="mt-1">84.45</strong>
                        </div>
                        <div className="flex flex-col">
                            <small className="text-gray-600">Nilai 2</small>
                            <strong className="mt-1">60.27</strong>
                        </div>
                        <div className="flex flex-col">
                            <small className="text-gray-600">Nilai 3</small>
                            <strong className="mt-1">0</strong>
                        </div>
                    </div>

                    {/* Button Actions */}
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="secondary" className="text-red-600 border-red-600 hover:bg-red-50">
                            Tunda Validasi
                        </Button>
                    </div>

                    {/* Catatan Validasi */}
                    <div className="flex flex-col space-y-2 mt-8">
                        <h6 className="text-md font-semibold">Catatan Validasi</h6>
                        <Textarea
                            id="validationNote"
                            name="validationNote"
                            placeholder="Belum ada catatan..."
                            disabled
                            className="resize-none min-h-[150px]"
                        />
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex justify-center mt-8">
                        <ul className="flex flex-wrap gap-2">
                            {tabs.map((tab) => (
                                <li key={tab}>
                                    <button
                                        onClick={() => setActiveTab(tab as keyof typeof dummyData)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                            activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pertanyaan */}
                    <div className="flex flex-col space-y-6 mt-8">
                        {dummyData[activeTab].map((item) => (
                            <div key={item.id} className="p-4 border rounded-lg shadow-sm">
                                <h6 className="font-semibold mb-4">
                                    {item.nomor} {item.pertanyaan}
                                </h6>
                                <div className="flex flex-col gap-2 mb-4">
                                    {item.pilihanJawaban.map((option, idx) => (
                                        <label key={idx} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={item.id}
                                                value={option}
                                                checked={answers[item.id] === option}
                                                onChange={() => handleAnswerChange(item.id, option)}
                                                className="form-radio text-blue-600"
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                                {item.buktiRequired && (
                                    <div className="flex flex-col gap-2 mt-4">
                                        <label className="text-sm font-semibold">Upload Bukti:</label>
                                        <Input
                                            type="file"
                                            onChange={(e) => handleFileChange(item.id, e.target.files?.[0] || null)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex justify-center mt-8">
                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                            Simpan & Lanjut 🚀
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
