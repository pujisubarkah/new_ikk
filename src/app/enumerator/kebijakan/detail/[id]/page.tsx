'use client';
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar-enum";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { useRouter, useParams } from 'next/navigation';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Policy = {
    id: string;
    nama_kebijakan: string;
    status_kebijakan: string;
    tanggal_proses: string;
    instansi: string;
    progress_pengisian: number;
    nilai_akhir: number;
};

type Question = {
    id: string;
    dimension_name: string;
    indicator_question: string;
    indicator_description: string;
    indicator_column_code: string;
    instrument_answer: {
        level_id: number;
        level_score: string;
        level_description: string;
    }[];
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
    const params = useParams();
    const router = useRouter();
    const policyId = params?.id as string;
    const [activeStep, setActiveStep] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, { description: string; score: number }>>({});
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
    const [policyData, setPolicyData] = useState<Policy | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [apiQuestions, setApiQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);

    // Fetch data policy dan pertanyaan
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                if (!policyId) throw new Error("Policy ID tidak ditemukan di URL");

                const policyRes = await fetch(`/api/policies/${policyId}`);
                if (!policyRes.ok) throw new Error("Gagal memuat data kebijakan");
                const policyData = await policyRes.json();
                setPolicyData(policyData.data);

                const questionsRes = await fetch("/api/pertanyaan");
                if (!questionsRes.ok) throw new Error("Gagal memuat pertanyaan");
                const questionsData = await questionsRes.json();

                if (Array.isArray(questionsData.data)) {
                    setApiQuestions(questionsData.data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [policyId]);

    // Ubah jawaban
    const handleAnswerChange = (questionId: string, answerDescription: string, answerScore: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: {
                description: answerDescription,
                score: answerScore
            }
        }));
    };

    // Mapping kolom file berdasarkan dimensi dan urutan pertanyaan
    const getFileNameFromQuestion = (dimension: string, questionIndex: number): string | null => {
        const prefixMap: Record<string, string> = {
            "Perencanaan Kebijakan": "a",
            "Implementasi Kebijakan": "b",
            "Evaluasi dan Keberlanjutan Kebijakan": "c",
            "Transparansi dan Partisipasi Publik": "d",
        };
        const prefix = prefixMap[dimension];
        if (!prefix) return null;
        const order = questionIndex % 3 + 1;
        return `file_url_${prefix}${order}`;
    };

    // Unggah file pendukung
    const handleLinkUpload = async (questionId: string, link: string, questionIndex: number) => {
        const question = apiQuestions.find(q => q.id === questionId);
        if (!question) return;

        const fileName = getFileNameFromQuestion(question.dimension_name, questionIndex);
        if (!fileName) return;

        try {
            await fetch("/api/upload-supporting-file", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    policy_id: policyId,
                    created_by: localStorage.getItem("id"),
                    [fileName]: link
                })
            });
            setUploadedFiles(prev => ({
                ...prev,
                [questionId]: link
            }));
            toast.success("File berhasil disimpan");
        } catch (error) {
            console.error("Gagal menyimpan file:", error);
            toast.error("Gagal menyimpan file");
        }
    };

    // Simpan semua jawaban dan kirim ke koordinator
    const handleConfirm = async () => {
        const unansweredQuestions = apiQuestions.filter((item) => {
            return !selectedAnswers[item.id]; // Cek apakah sama sekali belum dipilih
        });

        if (unansweredQuestions.length > 0) {
            const pesan = `Masih ada ${unansweredQuestions.length} pertanyaan yang belum dijawab:\n\n${unansweredQuestions
                .map(q => `- ${q.indicator_question}`)
                .join('\n')}`;
            alert(pesan);

            const firstUnansweredId = unansweredQuestions[0].id;
            const elemen = document.getElementById(`question-${firstUnansweredId}`);
            if (elemen) {
                elemen.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            return;
        }

        setIsSaving(true);
        const userId = localStorage.getItem("id");

        try {
            const answersToSubmit: Record<string, number> = {};
            const infoToSubmit: Record<string, string> = {};

            apiQuestions.forEach((item) => {
                const answer = selectedAnswers[item.id];
                if (answer?.score !== undefined) {
                    answersToSubmit[item.indicator_column_code] = answer.score;
                }
                if (uploadedFiles[item.id]) {
                    infoToSubmit[`informasi_${item.dimension_name.charAt(0).toLowerCase()}`] =
                        uploadedFiles[item.id];
                }
            });

            // Simpan jawaban
            const saveResponse = await fetch("/api/save-ikk-ki-score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    policy_id: policyId,
                    created_by: userId,
                    active_year: 2025,
                    ...answersToSubmit,
                    ...infoToSubmit
                }),
            });

            if (!saveResponse.ok) throw new Error("Gagal menyimpan jawaban");

            // Kirim ke koordinator
            const sendResponse = await fetch("/api/policies/send_to_ki", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-enumerator-id": userId || ""
                },
                body: JSON.stringify({ id: policyId })
            });

            if (!sendResponse.ok) {
                const errorData = await sendResponse.json();
                throw new Error(errorData.error || "Gagal mengirim ke koordinator");
            }

            toast.success("Jawaban berhasil dikirim ke koordinator");
            router.push(`/enumerator/kebijakan`);
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error.message || "Gagal mengirim ke koordinator");
        } finally {
            setIsSaving(false);
            setOpen(false);
        }
    };

    if (loading) {
        return (
            <Sidebar>
                <div className="w-full px-6 py-8">
                    <p>Memuat data kebijakan...</p>
                </div>
            </Sidebar>
        );
    }

    if (error) {
        return (
            <Sidebar>
                <div className="w-full px-6 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="text-red-600 font-medium">Error</h3>
                        <p className="text-red-500 mt-1">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </Sidebar>
        );
    }

    if (!policyData) {
        return (
            <Sidebar>
                <div className="w-full px-6 py-8">
                    <p>Data kebijakan tidak ditemukan</p>
                </div>
            </Sidebar>
        );
    }

    return (
        <Sidebar>
            <div className="w-full px-6 py-8">
                <div className="space-y-8">
                    <PolicyCard policy={policyData} />
                    {/* Tombol Simpan & Kirim */}
                    <div className="flex justify-end">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <button
                                    disabled={isSaving}
                                    className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow transition-all ${
                                        isSaving ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                                >
                                    <FaPaperPlane className="text-white" />
                                    {isSaving ? "Menyimpan..." : "Simpan & Kirim ke Koordinator"}
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Yakin ingin mengirim?</DialogTitle>
                                    <DialogDescription>
                                        Pastikan semua jawaban sudah lengkap sebelum mengirim ke koordinator.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
                                    <Button onClick={handleConfirm} disabled={isSaving}>
                                        Ya, Kirim Sekarang
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <PolicyStepsNav activeStep={activeStep} onChangeStep={setActiveStep} />
                    <div className="space-y-6">
                        <QuestionList
                            activeStep={activeStep}
                            selectedAnswers={selectedAnswers}
                            onAnswerChange={handleAnswerChange}
                            onLinkUpload={handleLinkUpload}
                            uploadedFiles={uploadedFiles}
                            apiQuestions={apiQuestions}
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

// --- Komponen Pendukung ---

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
                <h2 className="text-xl font-bold text-gray-800 mt-1">{policy.nama_kebijakan}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div>
                    <small className="text-gray-500 text-sm">Progres Pengisian</small>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 flex-1">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${policy.progress_pengisian}%` }}
                            ></div>
                        </div>
                        <span className="text-blue-600 text-sm font-medium">
                            {Number(policy.progress_pengisian).toFixed(2)}%
                        </span>
                    </div>
                </div>
                <div>
                    <small className="text-gray-500 text-sm">Nilai Akhir Kebijakan</small>
                    <strong className="text-gray-800 mt-1 block">
                        {policy.nilai_akhir ?? '-'}
                    </strong>
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
}: {
    activeStep: number;
    selectedAnswers: Record<string, { description: string; score: number }>;
    uploadedFiles: Record<string, string>;
    onAnswerChange: (questionId: string, answerDescription: string, answerScore: number) => void;
    onLinkUpload: (questionId: string, link: string, questionIndex: number) => void;
    apiQuestions: Question[];
}) {
    const dimensionName = stepDimensionMap[activeStep];
    const filteredQuestions = apiQuestions.filter(q => q.dimension_name === dimensionName);

    return (
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Pertanyaan</h3>
            {filteredQuestions.map((item, index) => (
                <div key={item.id} id={`question-${item.id}`} className="space-y-4 pb-4 border-b last:border-b-0">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{item.indicator_question}</p>
                        <button
                            onClick={() => toast(item.indicator_description, { icon: "💡" })}
                            className="text-blue-600 hover:text-blue-800"
                            title="Lihat deskripsi indikator"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 00-7 7c0 2.5 1.5 4.5 3.5 5.5v2.5h7v-2.5c2-1 3.5-3 3.5-5.5a7 7 0 00-7-7z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-3">
                        {item.instrument_answer
                            .sort((a, b) => a.level_id - b.level_id)
                            .map((opt) => (
                                <label key={opt.level_id} className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question-${item.id}`}
                                        checked={selectedAnswers[item.id]?.description === opt.level_description}
                                        onChange={() =>
                                            onAnswerChange(item.id, opt.level_description, Number(opt.level_score))
                                        }
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-gray-700">{opt.level_description}</span>
                                </label>
                            ))}
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unggah dokumen pendukung <span className="text-xs text-gray-500">(Google Drive link)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="https://drive.google.com/... "
                            value={uploadedFiles[item.id] || ""}
                            onChange={(e) => onLinkUpload(item.id, e.target.value, index)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
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