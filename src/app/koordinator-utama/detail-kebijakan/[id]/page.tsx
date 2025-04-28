"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Pastikan kamu punya komponen Input
import { Textarea } from "@/components/ui/textarea"; // Pastikan kamu punya komponen Textarea
import Sidebar from "@/components/sidebar-koor";

interface Policy {
  instansi: string;
  tanggalPengesahan: string;
  progress: number;
  name: string;
  status_kebijakan: string;
  progress_pengisian: number;
  Nilai1?: string;
  Nilai2?: string;
  Nilai3?: string;
}

interface Question {
  id: string;
  nomor: string;
  pertanyaan: string;
  pilihanJawaban: string[];
  buktiRequired: boolean;
}

// Dummy Data (sementara)
const dummyData: Record<string, Question[]> = {
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


const tabs = Object.keys(dummyData); // ["Tab 1", "Tab 2"]

const PolicyDetailPage = () => {
  const [policyData, setPolicyData] = useState<Policy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});

  const router = useRouter();
  const params = useParams();
  const id = params?.id && typeof params.id === "string" ? params.id : null;

  useEffect(() => {
    const fetchPolicyData = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/policies?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch policy data');
        }
        const data = await response.json();
        setPolicyData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, [id]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFileChange = (questionId: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [questionId]: file }));
  };

  const handleSave = () => {
    console.log("Jawaban:", answers);
    console.log("File Upload:", uploadedFiles);
    alert("Data berhasil disimpan!");
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">Error: {error}</div>;
  }

  return (
      <Sidebar>
      <div className="w-full px-6 py-8">
      <div className="flex justify-between items-center mb-4">
        <Card className="p-8 w-full h-full overflow-y-auto">
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
              {policyData && (
                <>
                  <small className="text-gray-500">{policyData.instansi}</small>
                  <h5 className="text-lg font-bold mt-1">{policyData.name}</h5>
                </>
              )}
            </div>

            {/* Info Statistika */}
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex flex-col">
                <small className="text-gray-600">Status Kebijakan</small>
                <span className="text-xs bg-yellow-400 text-white px-2 py-1 rounded-full mt-1">
                  {policyData?.status_kebijakan}
                </span>
              </div>
              <div className="flex flex-col">
                <small className="text-gray-600">Tanggal Pengesahan</small>
                <strong className="mt-1">{policyData?.tanggalPengesahan}</strong>
              </div>
              <div className="flex flex-col">
                <small className="text-gray-600">Progress Pengisian</small>
                <div className="mt-1 w-32">
                  <Progress value={policyData?.progress_pengisian || 0} />
                  <small className="text-xs text-gray-500 text-center block mt-1">
                    {policyData?.progress_pengisian}%
                  </small>
                </div>
              </div>
              <div className="flex flex-col">
                <small className="text-gray-600">Nilai 1</small>
                <strong className="mt-1">{policyData?.Nilai1}</strong>
              </div>
              <div className="flex flex-col">
                <small className="text-gray-600">Nilai 2</small>
                <strong className="mt-1">{policyData?.Nilai2}</strong>
              </div>
              <div className="flex flex-col">
                <small className="text-gray-600">Nilai 3</small>
                <strong className="mt-1">{policyData?.Nilai3}</strong>
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
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        activeTab === tab
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                        onChange={(e) =>
                          handleFileChange(item.id, e.target.files?.[0] || null)
                        }
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
      </div>
      </Sidebar>
  );
};

export default PolicyDetailPage;
