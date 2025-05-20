'use client';
import React from 'react';
import { toast } from 'sonner';
import { Lightbulb } from 'lucide-react';

// Types
interface AnswerOption {
  level_id: number;
  level_score: string;
  level_description: string;
}

export interface Question {
  id: string;
  dimension_name: string;
  indicator_question: string;
  indicator_description: string;
  indicator_column_code: string;
  instrument_answer: AnswerOption[];
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
  onLinkUpload: (questionId: string, link: string, questionIndex: number) => void;
  onDimensionInfoChange: (dimensionKey: string, info: string) => void;
  apiQuestions: Question[];
  dimensionNotes: Record<string, string>;
  isSubmitted: boolean; // <-- Tambahin ini
}

// Mapping step ke nama dimensi
const stepDimensionMap: Record<number, string> = {
  0: "Perencanaan Kebijakan",
  1: "Implementasi Kebijakan",
  2: "Evaluasi dan Keberlanjutan Kebijakan",
  3: "Transparansi dan Partisipasi Publik",
};

// Mapping dimensi → key (a/b/c/d)
const dimensionKeyMap: Record<string, string> = {
  "Perencanaan Kebijakan": "a",
  "Implementasi Kebijakan": "b",
  "Evaluasi dan Keberlanjutan Kebijakan": "c",
  "Transparansi dan Partisipasi Publik": "d",
};

export default function QuestionList({
  activeStep,
  selectedAnswers,
  uploadedFiles,
  onAnswerChange,
  onLinkUpload,
  onDimensionInfoChange,
  apiQuestions,
  dimensionNotes,
}: QuestionListProps) {
  const dimensionName = stepDimensionMap[activeStep] ?? '';
  const dimensionKey = dimensionName ? dimensionKeyMap[dimensionName] : '';

  // Filter pertanyaan sesuai dimensi aktif
  const filteredQuestions = Array.isArray(apiQuestions)
    ? apiQuestions.filter(q => q.dimension_name === dimensionName)
    : [];

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Pertanyaan</h3>

      {/* Jika tidak ada pertanyaan */}
      {filteredQuestions.length === 0 ? (
        <div className="text-gray-500 italic py-4">
          {dimensionName
            ? 'Belum ada pertanyaan untuk dimensi ini.'
            : 'Silakan pilih dimensi terlebih dahulu.'}
        </div>
      ) : (
        filteredQuestions.map((item, index) => (
          <div key={item.id} id={`question-${item.id}`} className="space-y-4 pb-4 border-b last:border-b-0">
            {/* Judul & Info Pertanyaan */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{item.indicator_column_code}.</span>
              <p className="font-semibold text-gray-800">{item.indicator_question}</p>

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
                aria-label="Lihat keterangan indikator"
                title="Lihat keterangan indikator"
              >
                <Lightbulb className="w-5 h-5" />
              </button>
            </div>

            {/* Jawaban Pilihan Radio */}
            <fieldset className="space-y-3">
              <legend className="sr-only">Pilihan jawaban untuk {item.indicator_question}</legend>
              {item.instrument_answer
                .sort((a, b) => a.level_id - b.level_id)
                .map((opt) => (
                  <label key={opt.level_id} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${item.id}`}
                      checked={selectedAnswers[item.id]?.description === opt.level_description}
                      onChange={() =>
                        onAnswerChange(
                          item.id,
                          opt.level_description,
                          parseInt(opt.level_score, 10) || 0
                        )
                      }
                      className="h-5 w-5 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-700">{opt.level_description}</span>
                  </label>
                ))}
            </fieldset>

            {/* Upload Link Google Drive */}
            <div className="mt-4">
              <label htmlFor={`upload-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Unggah dokumen pendukung{" "}
                <span className="text-xs text-gray-500">(Google Drive link)</span>
              </label>
              <input
                id={`upload-${item.id}`}
                type="url"
                placeholder="https://drive.google.com/... "
                value={uploadedFiles[item.id] || ''}
                onChange={(e) => onLinkUpload(item.id, e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                pattern="https://drive\.google\.com/.*"
                required
              />
            </div>
          </div>
        ))
      )}

      {/* Catatan Tambahan Per Dimensi */}
      {dimensionKey && (
        <div className="mt-6 pt-4 border-t">
          <label htmlFor={`dimension-info-${dimensionKey}`} className="block text-sm font-medium text-gray-700 mb-1">
            Catatan Tambahan untuk Dimensi &quot;{dimensionName}&quot;
          </label>
          <textarea
            id={`dimension-info-${dimensionKey}`}
            value={dimensionNotes[dimensionKey] || ''}
            onChange={(e) => onDimensionInfoChange(dimensionKey, e.target.value)}
            placeholder="Masukkan penjelasan atau catatan tambahan untuk dimensi ini..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      )}
    </div>
  );
}
