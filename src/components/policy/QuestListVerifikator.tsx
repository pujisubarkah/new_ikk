'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Lightbulb } from 'lucide-react';

interface InstrumentAnswer {
  level_id: number;
  level_score: string;
  level_description: string;
}

interface Question {
  id: string;
  dimension_name: string;
  indicator_question: string;
  indicator_description: string;
  indicator_column_code: string;
  instrument_answer: InstrumentAnswer[];
}

type SelectedAnswer = {
  description: string;
  score: number;
};

interface QuestionListProps {
  policyId: string;
  activeStep: number;
  selectedAnswers: Record<string, { description: string; score: number }>;
  onAnswerChange: (code: string, desc: string, score: number) => void;
  uploadedFiles?: any;
  apiQuestions: Question[];
  isSubmitted: boolean;
  onLinkUpload?: (code: string, file: File) => void;
  verifierNotes?: Record<string, string>;
  onNoteChange?: (code: string, note: string) => void;
}


export default function QuestionList({ activeStep, policyId }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, SelectedAnswer>>({});
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});

  // Mapping kode_pertanyaan -> level_score -> level_description
  const questionLevelMap = Object.fromEntries(
    questions.map(q => [
      q.indicator_column_code,
      Object.fromEntries(
        q.instrument_answer.map(a => [a.level_score, a.level_description])
      )
    ])
  );

  // Ambil daftar pertanyaan dari /api/pertanyaan
  useEffect(() => {
    async function fetchQuestions() {
      const res = await fetch('/api/pertanyaan');
      const data = await res.json();
      setQuestions(data.data);
    }

    fetchQuestions();
  }, []);

  // Ambil jawaban lama dari /api/answers?policyId={id}
  useEffect(() => {
    if (questions.length === 0) return;

    async function fetchPreviousAnswers() {
      const res = await fetch(`/api/answers?policyId=${policyId}`);
      const data = await res.json();

      const answers: Record<string, SelectedAnswer> = {};
      for (const key in data.data) {
        const score = data.data[key];
        const description = questionLevelMap[key]?.[score];

        if (description) {
          answers[key] = { description, score: Number(score) };
        }
      }

      setSelectedAnswers(answers);
    }

    fetchPreviousAnswers();
  }, [questions]);

  // Trigger AI Recommendation untuk semua jawaban awal saat halaman dimuat
  useEffect(() => {
    if (questions.length === 0 || Object.keys(selectedAnswers).length === 0) return;

    const fetchInitialAIResponses = async () => {
      const newAiResponses: Record<string, string> = {};

      for (const questionCode in selectedAnswers) {
        const question = questions.find(q => q.indicator_column_code === questionCode);
        const answerDesc = selectedAnswers[questionCode]?.description;

        if (question && answerDesc) {
          const recommendation = await getAiRecommendation(question.indicator_question, answerDesc);
          newAiResponses[questionCode] = recommendation;
        }
      }

      setAiResponses(newAiResponses);
    };

    fetchInitialAIResponses();
  }, [questions, selectedAnswers]);

  // Fungsi AI via OpenRouter
  const getAiRecommendation = async (questionText: string, answerDescription: string) => {
    const prompt = `
Pertanyaan: "${questionText}"
Jawaban Pengguna: "${answerDescription}"

Berdasarkan jawaban tersebut, tuliskan rekomendasi bukti dukung yang relevan.
Format: Singkat, jelas, dan profesional.
`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions ", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.NEXT_PUBLIC_OPENROUTER_MODEL,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 200,
          temperature: 0.5
        })
      });

      const data = await response.json();
      return data.choices?.[0]?.message?.content.trim() || "Tidak ada rekomendasi.";
    } catch (error) {
      console.error("AI Error:", error);
      return "Gagal mendapatkan rekomendasi dari AI.";
    }
  };

  // Handle perubahan jawaban
  const handleAnswerChange = async (questionCode: string, description: string, score: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionCode]: { description, score }
    }));

    const question = questions.find(q => q.indicator_column_code === questionCode);
    if (!question) return;

    const recommendation = await getAiRecommendation(question.indicator_question, description);
    setAiResponses(prev => ({
      ...prev,
      [questionCode]: recommendation
    }));
  };

  // Filter berdasarkan step
  const dimensionList = [
    "Perencanaan Kebijakan",
    "Implementasi Kebijakan",
    "Evaluasi dan Keberlanjutan Kebijakan",
    "Transparansi dan Partisipasi Publik"
  ];

  const dimensionName = dimensionList[activeStep] || dimensionList[0];
  const filteredQuestions = questions.filter(q => q.dimension_name === dimensionName);

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Pertanyaan</h3>

      {filteredQuestions.map((item) => {
        const currentAnswer = selectedAnswers[item.indicator_column_code];
        const aiResponse = aiResponses[item.indicator_column_code];

        return (
          <div key={item.id} className="space-y-4 pb-4 border-b last:border-b-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{item.indicator_column_code}.</span>
              <p className="font-semibold text-gray-800">{item.indicator_question}</p>

              {/* Tooltip Info */}
              <button
                type="button"
                onClick={() =>
                  toast("Keterangan Indikator", {
                    description: item.indicator_description || 'Tidak ada deskripsi tambahan.',
                    icon: <Lightbulb className="text-yellow-500" />,
                    duration: 5000,
                  })
                }
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <Lightbulb className="w-5 h-5" />
              </button>
            </div>

            {/* Radio Buttons */}
            <div className="space-y-3">
              {item.instrument_answer
                .sort((a, b) => a.level_id - b.level_id)
                .map((opt) => (
                  <label key={opt.level_id} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${item.id}`}
                      checked={currentAnswer?.description === opt.level_description}
                      onChange={() => handleAnswerChange(item.indicator_column_code, opt.level_description, Number(opt.level_score))}
                      className="h-5 w-5 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-700">{opt.level_description}</span>
                  </label>
                ))}
            </div>

            {/* Rekomendasi AI */}
            {aiResponse && (
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>Rekomendasi Bukti Dukung:</strong> {aiResponse}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
