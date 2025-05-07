'use client';
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar-enum";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

type Policy = {
    id: string;
    enumerator: string;
    name: string;
    tanggal_proses: string;
    tanggal_berlaku: string;
    instansi: string;
    progress_pengisian: number;
    status_kebijakan: string;
};

const steps = [
    "1. Perencanaan Kebijakan",
    "2. Implementasi Kebijakan",
    "3. Evaluasi Keberlanjutan",
    "4. Transparansi dan Partisipasi",
];

const stepDimensionMap: Record<number, string> = {
    0: "Perencanaan Kebijakan",
    1: "Implementasi Kebijakan",
    2: "Evaluasi dan Keberlanjutan Kebijakan",
    3: "Transparansi dan Partisipasi Publik",
};

export default function PolicyPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
    const [policyData, setPolicyData] = useState<Policy | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState("");
    type Question = {
        id: string;
        dimension_name: string;
        indicator_question: string;
        indicator_description: string;
        instrument_answer: { level_id: number; level_description: string }[];
    };

    const [apiQuestions, setApiQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const fetchPolicyData = async () => {
            const enumerator_id = localStorage.getItem("id");
            if (!enumerator_id) return;
            try {
                const res = await fetch(`/api/policies/enumerator?enumerator_id=${enumerator_id}`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setPolicyData(data[0]);
                }
            } catch (error) {
                console.error("Gagal mengambil data kebijakan:", error);
            }
        };

        const fetchQuestions = async () => {
            try {
                const res = await fetch("/api/pertanyaan");
                const data = await res.json();
                if (Array.isArray(data.data)) {
                    setApiQuestions(data.data);
                }
            } catch (error) {
                console.error("Gagal mengambil pertanyaan:", error);
            }
        };

        fetchPolicyData();
        fetchQuestions();
    }, []);

    const handleAnswerChange = (questionId: string, answer: string) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const handleLinkUpload = (questionId: string, link: string) => {
        setUploadedFiles((prev) => ({
            ...prev,
            [questionId]: link,
        }));
    };

    const handleSaveAnswer = (questionId: string, questionText: string) => {
        if (!selectedAnswers[questionId]) {
            toast.warning("Pilih jawaban terlebih dahulu");
            return;
        }

        // Here you would typically call your API to save the answer
        // For now, we'll just show a toast notification
        toast.success("Jawaban berhasil disimpan", {
            description: `Pertanyaan: ${questionText}`,
        });

        console.log("Saved answer:", {
            questionId,
            answer: selectedAnswers[questionId],
            documentLink: uploadedFiles[questionId]
        });
    };

    if (!policyData) {
        return (
                <Sidebar>
                  <div className="w-full px-6 py-8">
                  <div className="flex justify-between items-center mb-4">
                    <p>Memuat data kebijakan...</p>
                </div>
                </div>
                </Sidebar>
        );
    }

    return (
            <Sidebar>
              <div className="w-full px-6 py-8">
                <div className="space-y-8">
                <PolicyCard policy={policyData} />
                <PolicyStepsNav activeStep={activeStep} onChangeStep={setActiveStep} />
                <div className="space-y-6">
                  <QuestionList
                    activeStep={activeStep}
                    selectedAnswers={selectedAnswers}
                    onAnswerChange={handleAnswerChange}
                    onLinkUpload={handleLinkUpload}
                    uploadedFiles={uploadedFiles}
                    apiQuestions={apiQuestions}
                    onSaveAnswer={handleSaveAnswer}
                  />
                  <AdditionalInfoSection
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    onSave={() => {
                      toast.success("Informasi tambahan berhasil disimpan");
                      console.log("Saved additional info:", additionalInfo);
                    }}
                  />
                </div>
                </div>
            </div>
            </Sidebar>
    );
}

function PolicyCard({ policy }: { policy: Policy }) {
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
          <FaArrowLeft />
          <span>Kembali</span>
        </button>
        <div className="mb-4">
          <small className="text-gray-500 text-sm">{policy.instansi}</small>
          <h2 className="text-xl font-bold text-gray-800 mt-1">{policy.name}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <small className="text-gray-500 text-sm">Status Kebijakan</small>
            <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium mt-1 ${statusColors[policy.status_kebijakan as keyof typeof statusColors] || 'bg-gray-500'}`}>
              {policy.status_kebijakan}
            </span>
          </div>
          <div>
            <small className="text-gray-500 text-sm">Tanggal Pengesahan</small>
            <strong className="text-gray-800 mt-1 block">
              {new Date(policy.tanggal_berlaku).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </strong>
          </div>
          <div>
            <small className="text-gray-500 text-sm">Progres Pengisian</small>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2.5 flex-1">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${policy.progress_pengisian}%` }} />
              </div>
              <span className="text-blue-600 text-sm font-medium">
                {Number(policy.progress_pengisian).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function PolicyStepsNav({
    activeStep,
    onChangeStep,
  }: {
    activeStep: number;
    onChangeStep: (step: number) => void;
  }) {
    return (
      <div className="overflow-x-auto pb-2">
        <ul className="flex gap-2 w-max min-w-full">
          {steps.map((step, index) => (
            <li key={index}>
              <button
                onClick={() => onChangeStep(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all min-w-max ${
                  index === activeStep
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {step}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  function QuestionList({
    activeStep,
    selectedAnswers,
    uploadedFiles,
    onAnswerChange,
    onLinkUpload,
    apiQuestions,
    onSaveAnswer,
}: {
    activeStep: number;
    selectedAnswers: Record<string, string>;
    uploadedFiles: Record<string, string>;
    onAnswerChange: (questionId: string, answer: string) => void;
    onLinkUpload: (questionId: string, link: string) => void;
    apiQuestions: {
      indicator_description: string; id: string; dimension_name: string; indicator_question: string; instrument_answer: {
        level_id: number; level_description: string 
}[] 
}[]; // Define the Question type inline or import it if available
    onSaveAnswer: (questionId: string, questionText: string) => void;
}) {
    const dimensionName = stepDimensionMap[activeStep];
    const filteredQuestions = apiQuestions.filter(
        (q) => q.dimension_name === dimensionName
    );
  
    return (
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Pertanyaan</h3>
                {filteredQuestions.map((item) => (
                    <div key={item.id} className="space-y-4 pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">{item.indicator_question}</p>
                          <button
                            onClick={() => toast(item.indicator_description, { icon: "💡" })}
                            className="text-blue-600 hover:text-blue-800"
                            title="Lihat deskripsi indikator"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 2a7 7 0 00-7 7c0 2.5 1.5 4.5 3.5 5.5v2.5h7v-2.5c2-1 3.5-3 3.5-5.5a7 7 0 00-7-7z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 21h6"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="space-y-3">
                          {item.instrument_answer
                          .sort((a, b) => (a.level_id || 0) - (b.level_id || 0))
                          .map((opt, i: number) => (
                            <label key={i} className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${item.id}`}
                              value={opt.level_description}
                              checked={selectedAnswers[item.id] === opt.level_description}
                              onChange={() => onAnswerChange(item.id, opt.level_description)}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                              style={{ width: '20px', height: '20px' }}
                            />
                            <span className="text-gray-700">{opt.level_description}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unggah dokumen pendukung <span className="text-xs text-gray-500 ml-1">(Google Drive link)</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="https://drive.google.com/..."
                                    value={uploadedFiles[item.id] || ""}
                                    onChange={(e) => onLinkUpload(item.id, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Pastikan link dapat diakses oleh semua
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => onSaveAnswer(item.id, item.indicator_question)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md shadow"
                            >
                                Simpan Jawaban
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
  
  function AdditionalInfoSection({
      value,
      onChange,
      onSave,
    }: {
      value: string;
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
      onSave?: () => void;
    }) {
      return (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Informasi Tambahan</h3>
          <textarea
            value={value}
            onChange={onChange}
            rows={5}
            placeholder="Tuliskan informasi tambahan terkait pengisian..."
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
  