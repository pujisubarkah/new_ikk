'use client';
import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { useRouter, useParams } from 'next/navigation';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Sidebar from '@/components/sidebar-koorins';
import PolicyCard from '@/components/policy/PolicyCard';
import PolicyStepsNav from '@/components/policy/PolicyStepsNav';
import QuestionList from '@/components/policy/QuestlList';
import AnswerPreview from '@/components/policy/AnswerPreview';
import { FaRegSave, FaEye, FaEdit } from 'react-icons/fa';

const fetcher = (url: string) => fetch(url).then(res => res.json());

type AnswerOption = {
  level_id: number;
  level_score: string;
  level_description: string;
};

type Question = {
  id: string;
  dimension_name: string;
  indicator_question: string;
  indicator_description: string;
  indicator_column_code: string;
  instrument_answer: AnswerOption[];
};

export default function PolicyPage() {
  const params = useParams();
  const router = useRouter();
  const policyId = params?.id as string;

  // State
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, { description: string; score: number }>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [verifierNotes, setVerifierNotes] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Load data dari API
  const { data: policyData, error: policyError } = useSWR(policyId ? `/api/policies/${policyId}` : null, fetcher);
  const { data: questionsData, error: questionsError } = useSWR('/api/pertanyaan', fetcher);
  const { data: answersData, error: answersError } = useSWR(policyId ? `/api/answers?policyId=${policyId}` : null, fetcher);

  const policy = policyData?.data;
  const apiQuestions = questionsData?.data || [];

  if (policyError || questionsError || answersError) {
    const errorMessage =
      policyError?.message ||
      questionsError?.message ||
      answersError?.message ||
      'Terjadi kesalahan saat memuat data';

    return (
      <Sidebar>
        <div className="w-full px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-600 font-medium">Error</h3>
            <p className="text-red-500 mt-1">{errorMessage}</p>
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

 // Load saved answers from API
useEffect(() => {
  if (!answersData || !apiQuestions.length) return;

  const savedAnswers: Record<string, { description: string; score: number }> = {};
  const savedFiles: Record<string, string> = {};
  const savedNotes: Record<string, string> = {};

  

  // Process file_url_* mappings
  for (const key in answersData.data) {
    if (key.startsWith('file_url_')) {
      const columnCode = key.replace('file_url_', '');
      const matchedQuestion = apiQuestions.find(
        (q: Question) => q.indicator_column_code === columnCode
      );
      if (matchedQuestion) {
        const url = answersData.data[key]?.trim();
        if (url) {
          savedFiles[matchedQuestion.id] = url;
        }
      }
    }
  }

  // Process answers and additional info
  apiQuestions.forEach((q: Question) => {
    const columnCode = q.indicator_column_code;
    const score = answersData.data?.[columnCode];

    // Map answers
    if (score !== undefined && q.instrument_answer?.length > 0) {
      const matchedAnswer = q.instrument_answer.find(
        (a: AnswerOption) => String(a.level_score) === String(score)
      );
      if (matchedAnswer) {
        savedAnswers[q.id] = {
          description: matchedAnswer.level_description,
          score: Number(matchedAnswer.level_score),
        };
      }
    }
  });

  // Map additional info (informasi_a, informasi_b, etc.)
  const additionalInfo = {
    a: answersData.data?.informasi_a || '',
    b: answersData.data?.informasi_b || '',
    c: answersData.data?.informasi_c || '',
    d: answersData.data?.informasi_d || '',
  };

  // Convert to verifierNotes format (dim_a, dim_b, etc.)
  Object.entries(additionalInfo).forEach(([dimension, value]) => {
    if (value !== undefined && value !== null) {
      savedNotes[`dim_${dimension}`] = String(value);
      
    } else {
      
    }
  });

  setSelectedAnswers(savedAnswers);
  setUploadedFiles(savedFiles);
  setVerifierNotes(savedNotes);

  if (policy?.status_kebijakan === 'terkirim') {
    setIsReadOnly(true);
  }
}, [answersData, apiQuestions, policy]);

// Auto-save answers
useEffect(() => {
  if (!policyId || Object.keys(selectedAnswers).length === 0 || isReadOnly) return;

  const timeout = setTimeout(async () => {
    const userId = localStorage.getItem('id');
    const answersToSubmit: Record<string, number> = {};
    const infoToSubmit: Record<string, string> = {};

    // Prepare answers
    apiQuestions.forEach((item: Question) => {
      const answer = selectedAnswers[item.id];
      if (answer?.score !== undefined) {
        answersToSubmit[item.indicator_column_code] = answer.score;
      }
    });

    // Prepare additional info
    infoToSubmit.informasi_a = verifierNotes.dim_a || '';
    infoToSubmit.informasi_b = verifierNotes.dim_b || '';
    infoToSubmit.informasi_c = verifierNotes.dim_c || '';
    infoToSubmit.informasi_d = verifierNotes.dim_d || '';

    try {
      const response = await fetch('/api/save-ikk-ki-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policy_id: policyId,
          created_by: userId,
          active_year: 2025,
          ...answersToSubmit,
          ...infoToSubmit,
          // Explicitly include all fields for clarity
          a1: answersToSubmit['a1'],
          a2: answersToSubmit['a2'],
          a3: answersToSubmit['a3'],
          b1: answersToSubmit['b1'],
          b2: answersToSubmit['b2'],
          b3: answersToSubmit['b3'],
          c1: answersToSubmit['c1'],
          c2: answersToSubmit['c2'],
          c3: answersToSubmit['c3'],
          d1: answersToSubmit['d1'],
          d2: answersToSubmit['d2'],
          jf: answersToSubmit['jf'] === 1 || false,
          informasi_a: infoToSubmit.informasi_a,
          informasi_b: infoToSubmit.informasi_b,
          informasi_c: infoToSubmit.informasi_c,
          informasi_d: infoToSubmit.informasi_d,
          informasi_jf: infoToSubmit.informasi_jf || '',
        }),
      });

      if (!response.ok) throw new Error('Save failed');
      mutate(`/api/answers?policyId=${policyId}`);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, 1000);

  return () => clearTimeout(timeout);
}, [selectedAnswers, uploadedFiles, policyId, apiQuestions, isReadOnly, verifierNotes]);

  // Ubah jawaban radio button
  const handleAnswerChange = (questionId: string, answerDescription: string, answerScore: number) => {
    if (isReadOnly) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: {
        description: answerDescription,
        score: answerScore,
      },
    }));
  };

  // Unggah file/link bukti dukung
  const handleLinkUpload = async (questionId: string, link: string, questionIndex: number) => {
    if (isReadOnly) return;
    const question = apiQuestions.find((q: Question) => q.id === questionId);
    if (!question) return;

    const fileName = getFileNameFromQuestion(question.dimension_name, questionIndex);
    if (!fileName) return;

    try {
      const userId = localStorage.getItem('id');
      await fetch('/api/save-ikk-ki-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policy_id: policyId,
          created_by: userId,
          active_year: 2025,
          ikk_file: {
            [fileName]: link,
          },
        }),
      });

      setUploadedFiles(prev => ({
        ...prev,
        [questionId]: link,
      }));

      toast.success('Link/file berhasil disimpan');
      mutate(`/api/answers?policyId=${policyId}`);
    } catch (error) {
      console.error('Gagal menyimpan link/file:', error);
      toast.error('Gagal menyimpan link/file');
    }
  };

  const getFileNameFromQuestion = (dimension: string, questionIndex: number): string | null => {
    const prefixMap: Record<string, string> = {
      'Perencanaan Kebijakan': 'a',
      'Implementasi Kebijakan': 'b',
      'Evaluasi dan Keberlanjutan Kebijakan': 'c',
      'Transparansi dan Partisipasi Publik': 'd',
    };

    const prefix = prefixMap[dimension];
    if (!prefix) return null;

    const order = questionIndex % 3 + 1;
    return `file_url_${prefix}${order}`;
  };

  // Simpan & kirim ke koordinator
  const handleConfirm = async () => {
    const unanswered = apiQuestions.filter((q: Question) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      alert(`Masih ada ${unanswered.length} pertanyaan yang belum dijawab`);
      const firstUnansweredId = unanswered[0].id;
      const elemen = document.getElementById(`question-${firstUnansweredId}`);
      if (elemen) {
        elemen.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSaving(true);
    const userId = localStorage.getItem('id');

    try {
      const saveResponse = await fetch('/api/save-ikk-ki-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policy_id: policyId,
          modified_by: userId,
          active_year: 2025,
          a1: selectedAnswers['a1']?.score,
          a2: selectedAnswers['a2']?.score,
          a3: selectedAnswers['a3']?.score,
          b1: selectedAnswers['b1']?.score,
          b2: selectedAnswers['b2']?.score,
          b3: selectedAnswers['b3']?.score,
          c1: selectedAnswers['c1']?.score,
          c2: selectedAnswers['c2']?.score,
          c3: selectedAnswers['c3']?.score,
          d1: selectedAnswers['d1']?.score,
          d2: selectedAnswers['d2']?.score,
          jf: selectedAnswers['jf']?.score === 1,
          informasi_a: verifierNotes.dim_a || '',
          informasi_b: verifierNotes.dim_b || '',
          informasi_c: verifierNotes.dim_c || '',
          informasi_d: verifierNotes.dim_d || '',
          informasi_jf: '',
        }),
      });

      if (!saveResponse.ok) throw new Error('Gagal menyimpan jawaban');
      toast.success('Jawaban berhasil disimpan');
      setOpen(false);
      mutate(`/api/answers?policyId=${policyId}`);
      setIsReadOnly(true);
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan jawaban');
    } finally {
      setIsSaving(false);
    }
  };

  // Render UI
  if (!policy || !apiQuestions.length) {
    return (
      <Sidebar>
        <div className="w-full px-6 py-8">
          <p>Memuat data kebijakan...</p>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="w-full px-6 py-8">
        <div className="space-y-8">
          <PolicyCard policy={policy} />

          {/* Tombol Preview/Edit */}
          <div className="flex justify-between items-center">
            {!isReadOnly ? (
              <button
                type="button"
                onClick={() => setIsReadOnly(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
              >
                <FaEye />
                Lihat Hasil Pernyataan Analis Instansi
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsReadOnly(false)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                <FaEdit />
                Edit Pernyataan
              </button>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  disabled={isSaving}
                  className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded shadow transition-all ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <FaRegSave className="text-white" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Jawaban'}
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Simpan Jawaban</DialogTitle>
                  <DialogDescription>Pastikan semua jawaban sudah benar sebelum menyimpan.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
                  <Button onClick={handleConfirm} disabled={isReadOnly || isSaving}>
                    Ya, Simpan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Navigasi Step */}
          <PolicyStepsNav activeStep={activeStep} onChangeStep={setActiveStep} />

          {/* Tampilkan jawaban sesuai mode */}
          {isReadOnly ? (
            <AnswerPreview
              apiQuestions={apiQuestions}
              selectedAnswers={selectedAnswers}
              uploadedFiles={uploadedFiles}
              dimensionNotes={{
                a: verifierNotes.dim_a || '',
                b: verifierNotes.dim_b || '',
                c: verifierNotes.dim_c || '',
                d: verifierNotes.dim_d || '',
              }}
            />
          ) : (
          <QuestionList
  activeStep={activeStep}
  selectedAnswers={selectedAnswers}
  onAnswerChange={handleAnswerChange}
  onLinkUpload={handleLinkUpload}
  uploadedFiles={uploadedFiles}
  apiQuestions={apiQuestions}
  dimensionNotes={{
    a: verifierNotes.dim_a || '',
    b: verifierNotes.dim_b || '',
    c: verifierNotes.dim_c || '',
    d: verifierNotes.dim_d || '',
  }}
  onDimensionInfoChange={(dimension: string, value: string) =>
    setVerifierNotes(prev => ({ ...prev, [`dim_${dimension}`]: value }))
  }
  isReadOnly={isReadOnly}
/>
          )}
        </div>
      </div>
    </Sidebar>
  );
}