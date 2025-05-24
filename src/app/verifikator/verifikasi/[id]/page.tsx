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
import QuestionList from '@/components/policy/QuestlList'; // ✅ Pastikan nama file benar
import AnswerPreview from '@/components/policy/AnswerPreview';
import { FaPaperPlane, FaEye, FaEdit } from 'react-icons/fa';

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

  const [activeStep, setActiveStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, { description: string; score: number }>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [verifierNotes, setVerifierNotes] = useState<Record<string, string>>({}); // 👈 Tambahkan state ini
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const { data: policyData, error: policyError } = useSWR(policyId ? `/api/policies/${policyId}` : null, fetcher);
  const { data: questionsData, error: questionsError } = useSWR('/api/pertanyaan', fetcher);
  const { data: answersData, error: answersError } = useSWR(policyId ? `/api/answers?policyId=${policyId}` : null, fetcher);

  const policy = policyData?.data;
  const apiQuestions = questionsData?.data || [];

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

        apiQuestions.forEach((q: Question) => {
          const columnCode = q.indicator_column_code;
          const score = answersData.data?.[columnCode];

          // Mapping jawaban
          if (score !== undefined && q.instrument_answer) {
            const matchedAnswer = q.instrument_answer.find(a => a.level_score === String(score));
            if (matchedAnswer) {
              savedAnswers[q.id] = {
                description: matchedAnswer.level_description,
                score: Number(matchedAnswer.level_score),
              };
            }
          }

          // Mapping file_url_* → uploadedFiles
          const fileKey = `file_url_${columnCode}`;
          const fileUrl = answersData.data?.[fileKey];
          if (fileUrl) {
            savedFiles[q.id] = fileUrl;
          }

          // Mapping catatan dimensi
          const dimension = q.dimension_name.charAt(0).toLowerCase();
          const noteKey = `catatan_${dimension}`;
          const noteValue = answersData.data?.[noteKey];
          if (noteValue) {
            savedNotes[`dim_${dimension}`] = noteValue;
          }

          // Mapping catatan per soal
          const questionNoteKey = `catatan_${columnCode}`;
          const questionNoteValue = answersData.data?.[questionNoteKey];
          if (questionNoteValue) {
            savedNotes[q.id] = questionNoteValue;
          }
        });

        setSelectedAnswers(savedAnswers);
        setUploadedFiles(savedFiles);
        setVerifierNotes(savedNotes);
      } catch (error) {
        console.error('Gagal memuat jawaban lama:', error);
      }
    };

    loadSavedAnswers();
  }, [policyId, apiQuestions]);

  // Auto-save
  useEffect(() => {
    if (!policyId || Object.keys(selectedAnswers).length === 0 || isReadOnly) return;

    const timeout = setTimeout(async () => {
      const userId = localStorage.getItem('id');
      const answersToSubmit: Record<string, number> = {};
      const infoToSubmit: Record<string, string> = {};

      apiQuestions.forEach((item: Question) => {
        const answer = selectedAnswers[item.id];
        if (answer?.score !== undefined) {
          answersToSubmit[item.indicator_column_code] = answer.score;
        }
        if (uploadedFiles[item.id]) {
          infoToSubmit[`informasi_${item.dimension_name.charAt(0).toLowerCase()}`] = uploadedFiles[item.id];
        }
      });

      // Kirim informasi tambahan
      infoToSubmit.informasi_a = verifierNotes.dim_a || '';
      infoToSubmit.informasi_b = verifierNotes.dim_b || '';
      infoToSubmit.informasi_c = verifierNotes.dim_c || '';
      infoToSubmit.informasi_d = verifierNotes.dim_d || '';

      try {
        await fetch('/api/save-ikk-ki-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            policy_id: policyId,
            created_by: userId,
            active_year: 2025,
            ...answersToSubmit,
            ...infoToSubmit,
          }),
        });
        mutate(`/api/answers?policyId=${policyId}`);
      } catch (error) {
        console.error('Auto-save gagal:', error);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [selectedAnswers, uploadedFiles, policyId, apiQuestions, isReadOnly]);

  // Ubah jawaban
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

  // Unggah link bukti dukung
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

      toast.success('File berhasil disimpan');
      mutate(`/api/answers?policyId=${policyId}`);
    } catch (error) {
      console.error('Gagal menyimpan file:', error);
      toast.error('Gagal menyimpan file');
    }
  };

  // Mapping nama file berdasarkan dimensi
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

  // Simpan jawaban dan kirim ke koordinator
  const handleConfirm = async () => {
    const unanswered = apiQuestions.filter((q: Question) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      alert(`Masih ada ${unanswered.length} pertanyaan yang belum dijawab`);
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
          created_by: userId,
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
          informasi_a: verifierNotes.dim_a,
          informasi_b: verifierNotes.dim_b,
          informasi_c: verifierNotes.dim_c,
          informasi_d: verifierNotes.dim_d,
          informasi_jf: '', // sesuaikan kalau ada
        }),
      });

      if (!saveResponse.ok) throw new Error('Gagal menyimpan jawaban');

      const sendResponse = await fetch('/api/policies/send_to_ku', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-enumerator-id': userId || '',
        },
        body: JSON.stringify({ id: policyId }),
      });

      if (!sendResponse.ok) throw new Error('Gagal mengirim ke koordinator');

      toast.success('Jawaban berhasil dikirim ke koordinator nasional');
      router.push(`/koordinator-instansi/daftar-kebijakan`);
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim ke koordinator');
    } finally {
      setIsSaving(false);
      setOpen(false);
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
              <button onClick={() => setIsReadOnly(true)}>Lihat Hasil</button>
            ) : (
              <button onClick={() => setIsReadOnly(false)}>Edit</button>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button disabled={isSaving}>Kirim ke Koornas</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yakin ingin mengirim?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
                  <Button onClick={handleConfirm} disabled={isReadOnly || isSaving}>
                    Ya, Kirim Sekarang
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
              uploadedFiles={uploadedFiles}
              onAnswerChange={handleAnswerChange}
              onLinkUpload={handleLinkUpload}
              dimensionNotes={{
                a: verifierNotes.dim_a || '',
                b: verifierNotes.dim_b || '',
                c: verifierNotes.dim_c || '',
                d: verifierNotes.dim_d || '',
              }}
              apiQuestions={apiQuestions}
              isSubmitted={isReadOnly}
            />
          )}
        </div>
      </div>
    </Sidebar>
  );
}