'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar-enum';
import { FaPaperPlane } from 'react-icons/fa';
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
// Komponen terpisah
import PolicyCard from '@/components/policy/PolicyCard';
import PolicyStepsNav from '@/components/policy/PolicyStepsNav';
import QuestionList from '@/components/policy/QuestionList';

type Policy = {
  id: string;
  nama_kebijakan: string;
  status_kebijakan: string;
  tanggal_proses: string;
  instansi: string;
  progress_pengisian: number;
  nilai_akhir: number;
};

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

  // Catatan tambahan per dimensi
  const [additionalInfoA, setAdditionalInfoA] = useState('');
  const [additionalInfoB, setAdditionalInfoB] = useState('');
  const [additionalInfoC, setAdditionalInfoC] = useState('');
  const [additionalInfoD, setAdditionalInfoD] = useState('');

  // Load data awal (policy & pertanyaan)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!policyId) throw new Error('Policy ID tidak ditemukan di URL');

        const policyRes = await fetch(`/api/policies/${policyId}`);
        if (!policyRes.ok) throw new Error('Gagal memuat data kebijakan');
        const policyData = await policyRes.json();
        setPolicyData(policyData.data);

        const questionsRes = await fetch('/api/pertanyaan');
        if (!questionsRes.ok) throw new Error('Gagal memuat pertanyaan');
        const questionsData = await questionsRes.json();

        if (Array.isArray(questionsData.data)) {
          setApiQuestions(questionsData.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [policyId]);

  // Load jawaban dan file pendukung lama dari /api/answers
  useEffect(() => {
    if (!policyId || !apiQuestions.length) return;

    const loadSavedAnswers = async () => {
      try {
        const answersRes = await fetch(`/api/answers?policyId=${policyId}`);
        if (!answersRes.ok) return;

        const answersData = await answersRes.json();

        const savedAnswers: Record<string, { description: string; score: number }> = {};
        const savedFiles: Record<string, string> = {};

        Object.entries(answersData.data).forEach(([key, value]) => {
          const question = apiQuestions.find(q => q.indicator_column_code === key);
          if (!question) return;

          if (key.startsWith('file_url_')) {
            savedFiles[question.id] = String(value);
            return;
          }

          const answerOption = question.instrument_answer.find(
            a => a.level_score === String(value)
          );

          if (answerOption) {
            savedAnswers[question.id] = {
              description: answerOption.level_description,
              score: parseInt(answerOption.level_score, 10),
            };
          }
        });

        setSelectedAnswers(savedAnswers);
        setUploadedFiles(savedFiles);

        // Load informasi tambahan
        setAdditionalInfoA(answersData.data?.informasi_a || '');
        setAdditionalInfoB(answersData.data?.informasi_b || '');
        setAdditionalInfoC(answersData.data?.informasi_c || '');
        setAdditionalInfoD(answersData.data?.informasi_d || '');

      } catch (error) {
        console.error('Gagal memuat jawaban lama:', error);
      }
    };

    loadSavedAnswers();
  }, [policyId, apiQuestions]);

  // Auto-save jawaban dan file pendukung
  useEffect(() => {
    if (!policyId || Object.keys(selectedAnswers).length === 0) return;

    const timeout = setTimeout(async () => {
      const userId = localStorage.getItem('id');
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

      infoToSubmit.informasi_a = additionalInfoA;
      infoToSubmit.informasi_b = additionalInfoB;
      infoToSubmit.informasi_c = additionalInfoC;
      infoToSubmit.informasi_d = additionalInfoD;

      try {
        await fetch('/api/save-ikk-ki-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            policy_id: policyId,
            created_by: userId,
            active_year: 2025,
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
            informasi_jf: infoToSubmit.informasi_jf,
          }),
        });
      } catch (error) {
        console.error('Auto-save gagal:', error);
      }
    }, 1000); // debounce 1 detik

    return () => clearTimeout(timeout);
  }, [
    selectedAnswers,
    uploadedFiles,
    policyId,
    additionalInfoA,
    additionalInfoB,
    additionalInfoC,
    additionalInfoD,
    apiQuestions,
  ]);

  // Ubah jawaban
  const handleAnswerChange = (questionId: string, answerDescription: string, answerScore: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: {
        description: answerDescription,
        score: answerScore,
      },
    }));
  };

  // Unggah link bukti dukung
  const handleLinkUpload = (questionId: string, link: string, questionIndex: number) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [questionId]: link,
    }));
  };

  // Simpan semua jawaban dan kirim ke koordinator
  const handleConfirm = async () => {
    const unansweredQuestions = apiQuestions.filter((item) => !selectedAnswers[item.id]);
    if (unansweredQuestions.length > 0) {
      const pesan = `Masih ada ${unansweredQuestions.length} pertanyaan yang belum dijawab:
${unansweredQuestions.map((q) => `- ${q.indicator_question}`).join('\n')}`;
      alert(pesan);
      const firstUnansweredId = unansweredQuestions[0].id;
      const elemen = document.getElementById(`question-${firstUnansweredId}`);
      if (elemen) {
        elemen.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSaving(true);
    const userId = localStorage.getItem('id');

    const answersToSubmit: Record<string, number> = {};
    const infoToSubmit: Record<string, string> = {};

    apiQuestions.forEach((item) => {
      const answer = selectedAnswers[item.id];
      if (answer?.score !== undefined) {
        answersToSubmit[item.indicator_column_code] = answer.score;
      }
      if (uploadedFiles[item.id]) {
        infoToSubmit[`file_url_${item.indicator_column_code}`] = uploadedFiles[item.id];
      }
    });

    infoToSubmit.informasi_a = additionalInfoA;
    infoToSubmit.informasi_b = additionalInfoB;
    infoToSubmit.informasi_c = additionalInfoC;
    infoToSubmit.informasi_d = additionalInfoD;

    try {
      const saveResponse = await fetch('/api/save-ikk-ki-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policy_id: policyId,
          created_by: userId,
          active_year: 2025,
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
          informasi_jf: infoToSubmit.informasi_jf,
        }),
      });

      if (!saveResponse.ok) throw new Error('Gagal menyimpan jawaban');

      const sendResponse = await fetch('/api/policies/send_to_ki', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-enumerator-id': userId || '',
        },
        body: JSON.stringify({ id: policyId }),
      });

      if (!sendResponse.ok) {
        const errorData = await sendResponse.json();
        throw new Error(errorData.error || 'Gagal mengirim ke koordinator');
      }

      toast.success('Jawaban berhasil dikirim ke koordinator');
      router.push(`/enumerator/kebijakan`);
    } catch (error: unknown) {
      console.error('Error:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Gagal mengirim ke koordinator');
      } else {
        toast.error('Gagal mengirim ke koordinator');
      }
    } finally {
      setIsSaving(false);
      setOpen(false);
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

          {/* Tombol Kirim */}
          <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  disabled={isSaving}
                  className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow transition-all ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <FaPaperPlane className="text-white" />
                  {isSaving ? 'Menyimpan...' : 'Simpan & Kirim ke Koordinator'}
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
                  <Button variant="secondary" onClick={() => setOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleConfirm} disabled={isSaving}>
                    Ya, Kirim Sekarang
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
            uploadedFiles={uploadedFiles}
            onAnswerChange={handleAnswerChange}
            onLinkUpload={handleLinkUpload}
            onDimensionInfoChange={(dimension: string, value: string) => {
              switch (dimension) {
                case 'a': setAdditionalInfoA(value); break;
                case 'b': setAdditionalInfoB(value); break;
                case 'c': setAdditionalInfoC(value); break;
                case 'd': setAdditionalInfoD(value); break;
              }
            }}
            apiQuestions={apiQuestions}
            dimensionNotes={{
              a: additionalInfoA,
              b: additionalInfoB,
              c: additionalInfoC,
              d: additionalInfoD,
            }}
            isReadOnly={policyData.status_kebijakan === 'terkirim'}
          />
        </div>
      </div>
    </Sidebar>
  );
}