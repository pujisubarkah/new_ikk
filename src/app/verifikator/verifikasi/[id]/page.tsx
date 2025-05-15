'use client';
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar-verif";
import { FaPaperPlane } from "react-icons/fa";
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
// Komponen lokal
import PolicyCard from "@/components/policy/PolicyCardVerifikator";
import PolicyStepsNav from "@/components/policy/PolicyStepsNav";
import QuestionList from "@/components/policy/QuestListVerifikator";
import AdditionalInfoSection from "@/components/policy/AdditionalInfoSection";

// Tipe lokal di dalam file
type Policy = {
    id: string;
    nama_kebijakan: string;
    status_kebijakan: string;
    tanggal_proses: string;
    instansi: string;
    progress_pengisian: number;
    nilai_akhir: number;
    status_pengiriman?: string;
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

    // State utama
    const [activeStep, setActiveStep] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, { description: string; score: number }>>({});
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
    const [policyData, setPolicyData] = useState<Policy | null>(null);
    const [apiQuestions, setApiQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);

    // Informasi tambahan
    const [additionalInfoA, setAdditionalInfoA] = useState("");
    const [additionalInfoB, setAdditionalInfoB] = useState("");
    const [additionalInfoC, setAdditionalInfoC] = useState("");
    const [additionalInfoD, setAdditionalInfoD] = useState("");

    // Catatan verifikator
    const [verifierNotes, setVerifierNotes] = useState<Record<string, string>>({});

    const isSubmitted = policyData?.status_pengiriman === 'terkirim';

    // Load data awal
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                if (!policyId) throw new Error("Policy ID tidak ditemukan");

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

    // Load jawaban lama
    useEffect(() => {
        if (!policyId || !apiQuestions.length) return;

        const loadSavedAnswers = async () => {
            try {
                const answersRes = await fetch(`/api/answers?policyId=${policyId}`);
                if (!answersRes.ok) return;

                const answersData = await answersRes.json();
                const savedAnswers: Record<string, { description: string; score: number }> = {};
                const savedFiles: Record<string, string> = {};
                const savedNotes: Record<string, string> = {};

                apiQuestions.forEach((q) => {
                    const columnCode = q.indicator_column_code;
                    const score = answersData.data?.[columnCode];
                    if (score !== undefined && q.instrument_answer) {
                        const matchedAnswer = q.instrument_answer.find(
                            (a) => a.level_score === String(score)
                        );
                        if (matchedAnswer) {
                            savedAnswers[q.id] = {
                                description: matchedAnswer.level_description,
                                score: Number(matchedAnswer.level_score),
                            };
                        }
                    }

                    const dimension = q.dimension_name.charAt(0).toLowerCase();
                    const infoKey = `informasi_${dimension}`;
                    const fileInfo = answersData.data?.[infoKey];
                    if (fileInfo) {
                        savedFiles[q.id] = fileInfo;
                    }

                    const noteKey = `catatan_${columnCode}`;
                    const noteInfo = answersData.data?.[noteKey];
                    if (noteInfo) {
                        savedNotes[q.id] = noteInfo;
                    }
                });

                setSelectedAnswers(savedAnswers);
                setUploadedFiles(savedFiles);
                setVerifierNotes(savedNotes);
                setAdditionalInfoA(answersData.data?.informasi_a || "");
                setAdditionalInfoB(answersData.data?.informasi_b || "");
                setAdditionalInfoC(answersData.data?.informasi_c || "");
                setAdditionalInfoD(answersData.data?.informasi_d || "");
            } catch (error) {
                console.error("Gagal memuat jawaban lama:", error);
            }
        };

        loadSavedAnswers();
    }, [policyId, apiQuestions]);

    // Auto-save
    useEffect(() => {
        if (!policyId || Object.keys(selectedAnswers).length === 0) return;

        const timeout = setTimeout(async () => {
            const userId = localStorage.getItem("id");
            const answersToSubmit: Record<string, number> = {};
            const infoToSubmit: Record<string, string> = {};
            const notesToSubmit: Record<string, string> = {};

            apiQuestions.forEach((item) => {
                const answer = selectedAnswers[item.id];
                if (answer?.score !== undefined) {
                    answersToSubmit[item.indicator_column_code] = answer.score;
                }

                if (uploadedFiles[item.id]) {
                    infoToSubmit[`informasi_${item.dimension_name.charAt(0).toLowerCase()}`] =
                        uploadedFiles[item.id];
                }

                if (verifierNotes[item.id]) {
                    notesToSubmit[`catatan_${item.indicator_column_code}`] = verifierNotes[item.id];
                }
            });

            infoToSubmit.informasi_a = additionalInfoA;
            infoToSubmit.informasi_b = additionalInfoB;
            infoToSubmit.informasi_c = additionalInfoC;
            infoToSubmit.informasi_d = additionalInfoD;

            try {
                await fetch("/api/answers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        policy_id: policyId,
                        modified_by: userId,
                        active_year: 2025,
                        ...answersToSubmit,
                        ...infoToSubmit,
                        ...notesToSubmit,
                    }),
                });
            } catch (error) {
                console.error("Auto-save gagal:", error);
            }
        }, 1000); // debounce 1 detik

        return () => clearTimeout(timeout);
    }, [selectedAnswers, uploadedFiles, verifierNotes, policyId]);

    // Handler
    const handleAnswerChange = (questionId: string, answerDescription: string, answerScore: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: {
                description: answerDescription,
                score: answerScore
            }
        }));
    };

    const handleNoteChange = (questionId: string, note: string) => {
        setVerifierNotes((prev) => ({
            ...prev,
            [questionId]: note
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const userId = localStorage.getItem("id");
        const answersToSubmit: Record<string, number> = {};
        const infoToSubmit: Record<string, string> = {};
        const notesToSubmit: Record<string, string> = {};

        apiQuestions.forEach((item) => {
            const answer = selectedAnswers[item.id];
            if (answer?.score !== undefined) {
                answersToSubmit[item.indicator_column_code] = answer.score;
            }

            if (uploadedFiles[item.id]) {
                infoToSubmit[`informasi_${item.dimension_name.charAt(0).toLowerCase()}`] =
                    uploadedFiles[item.id];
            }

            if (verifierNotes[item.id]) {
                notesToSubmit[`catatan_${item.indicator_column_code}`] = verifierNotes[item.id];
            }
        });

        infoToSubmit.informasi_a = additionalInfoA;
        infoToSubmit.informasi_b = additionalInfoB;
        infoToSubmit.informasi_c = additionalInfoC;
        infoToSubmit.informasi_d = additionalInfoD;

        try {
            const saveResponse = await fetch("/api/save-ikk-ki-score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    policy_id: policyId,
                    modified_by: userId,
                    active_year: 2025,
                    ...answersToSubmit,
                    ...infoToSubmit,
                    ...notesToSubmit
                }),
            });

            if (!saveResponse.ok) throw new Error("Gagal menyimpan jawaban");

            toast.success("Jawaban berhasil disimpan");
            router.push(`/koordinator-instansi/daftar-kebijakan`);
        } catch (error: unknown) {
            console.error('Error:', error);
            if (error instanceof Error) {
                toast.error(error.message || "Gagal menyimpan jawaban");
            } else {
                toast.error("Gagal menyimpan jawaban");
            }
        } finally {
            setIsSaving(false);
            setOpen(false);
        }
    };

    // Informasi tambahan
    const activeDimensionName = stepDimensionMap[activeStep];
    const activeDimensionKey = activeDimensionName.charAt(0).toLowerCase();
    let currentAdditionalInfo = "";
    let setAdditionalInfoForCurrentDim = (_val: string) => {}; // 🛠️ Parameter renamed to _val

    switch (activeDimensionKey) {
        case "a":
            currentAdditionalInfo = additionalInfoA;
            setAdditionalInfoForCurrentDim = setAdditionalInfoA;
            break;
        case "b":
            currentAdditionalInfo = additionalInfoB;
            setAdditionalInfoForCurrentDim = setAdditionalInfoB;
            break;
        case "c":
            currentAdditionalInfo = additionalInfoC;
            setAdditionalInfoForCurrentDim = setAdditionalInfoC;
            break;
        case "d":
            currentAdditionalInfo = additionalInfoD;
            setAdditionalInfoForCurrentDim = setAdditionalInfoD;
            break;
        default:
            currentAdditionalInfo = "";
    }

    const handleSaveAdditionalInfo = async () => {
        try {
            const response = await fetch("/api/answers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    policy_id: policyId,
                    [`informasi_${activeDimensionKey}`]: currentAdditionalInfo
                })
            });

            if (!response.ok) throw new Error("Gagal menyimpan informasi tambahan");
            toast.success("Informasi tambahan berhasil disimpan");
        } catch (error) {
            console.error("Error saving additional info:", error);
            toast.error("Gagal menyimpan informasi tambahan");
        }
    };

    // Render UI
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
                    {/* Tombol Simpan */}
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
                                    {isSaving ? "Menyimpan..." : "Simpan Jawaban"}
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Simpan Jawaban</DialogTitle>
                                    <DialogDescription>
                                        Apakah Anda yakin ingin menyimpan jawaban?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        Ya, Simpan
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {/* Navigasi Step */}
                    <PolicyStepsNav activeStep={activeStep} onChangeStep={setActiveStep} />
                    {/* Daftar Pertanyaan */}
                    <QuestionList
                        activeStep={activeStep}
                        selectedAnswers={selectedAnswers}
                        onAnswerChange={handleAnswerChange}
                        uploadedFiles={uploadedFiles}
                        apiQuestions={apiQuestions}
                        isSubmitted={isSubmitted}
                        onLinkUpload={(questionId, fileLink) => {
                            setUploadedFiles((prev) => ({
                                ...prev,
                                [questionId]: fileLink,
                            }));
                        }}
                        verifierNotes={verifierNotes}
                        onNoteChange={handleNoteChange}
                    />
                    {/* Informasi Tambahan Dinamis */}
                    <AdditionalInfoSection
                        value={currentAdditionalInfo}
                        onChange={(e) => setAdditionalInfoForCurrentDim(e.target.value)}
                        onSave={handleSaveAdditionalInfo}
                        dimensionName={activeDimensionName}
                    />
                </div>
            </div>
        </Sidebar>
    );
}
