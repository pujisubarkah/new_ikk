'use client';
import React from 'react';
import { toast } from 'sonner';
import { Lightbulb } from 'lucide-react';

interface Question {
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
}

type SelectedAnswer = {
  description: string;
  score: number;
};

interface QuestionListProps {
  activeStep: number;
  selectedAnswers: Record<string, SelectedAnswer>;
  uploadedFiles: Record<string, string>;
  onAnswerChange: (questionId: string, description: string, score: number) => void;
  apiQuestions: Question[];
  isSubmitted: boolean;
  verifierNotes?: Record<string, string>;
  onNoteChange?: (questionId: string, note: string) => void;
  onLinkUpload: (questionId: string, fileLink: string) => void; // Added this property
}

const stepDimensionMap: Record<number, string> = {
  0: "Perencanaan Kebijakan",
  1: "Implementasi Kebijakan",
  2: "Evaluasi dan Keberlanjutan Kebijakan",
  3: "Transparansi dan Partisipasi Publik",
};

export default function QuestionList({
  activeStep,
  selectedAnswers,
  uploadedFiles,
  onAnswerChange,
  apiQuestions,
  isSubmitted,
  verifierNotes,
  onNoteChange,
}: QuestionListProps) {
  const dimensionName = stepDimensionMap[activeStep];
  const filteredQuestions = apiQuestions.filter(q => q.dimension_name === dimensionName);

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Pertanyaan</h3>

      {filteredQuestions.map((item) => (
        <div key={item.id} id={`question-${item.id}`} className="space-y-4 pb-4 border-b last:border-b-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{item.indicator_column_code}.</span>
            <p className="font-semibold text-gray-800">{item.indicator_question}</p>

            {/* Lightbulb Icon */}
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
              title="Lihat keterangan indikator"
            >
              <Lightbulb className="w-5 h-5" />
            </button>
          </div>

          {/* Jawaban Radio Button */}
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
                    className="h-5 w-5 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                    disabled={isSubmitted}
                  />
                  <span className="text-gray-700">{opt.level_description}</span>
                </label>
              ))}
          </div>

          {/* Preview File Pendukung */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File Pendukung
            </label>
            {uploadedFiles[item.id] ? (
              <a
                href={uploadedFiles[item.id]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Lihat File Pendukung
              </a>
            ) : (
              <p className="text-gray-500 text-sm">Belum ada file pendukung</p>
            )}
          </div>

          {/* Catatan Verifikator per Pertanyaan */}
          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan Verifikator
            </label>
            {isSubmitted ? (
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {verifierNotes?.[item.id] || 'Tidak ada catatan'}
              </p>
            ) : (
              <textarea
                value={verifierNotes?.[item.id] || ''}
                onChange={(e) => onNoteChange?.(item.id, e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tuliskan catatan..."
                rows={3}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
