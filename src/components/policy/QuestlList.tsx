'use client';
import React from 'react';
import { toast } from 'sonner';
import { Lightbulb } from 'lucide-react';

interface AnswerOption {
  level_id: number;
  level_score: string;
  level_description: string;
}

export interface Question {
  id: string;
  dimension_name: string;
  indicator_question: string;
  indicator_column_code: string;
  indicator_description: string;
  instrument_answer: AnswerOption[];
}

export type QuestionListProps = {
  activeStep: number;
  selectedAnswers: Record<string, { description: string; score: number }>;
  onAnswerChange: (questionId: string, answerDescription: string, answerScore: number) => void;
  onLinkUpload: (questionId: string, link: string, questionIndex: number) => Promise<void>;
  onDimensionInfoChange?: (dimension: string, value: string) => void;
  uploadedFiles: Record<string, string>;
  apiQuestions: Question[];
  dimensionNotes?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  isReadOnly?: boolean;
};

const stepDimensionMap: Record<number, string> = {
  0: "Perencanaan Kebijakan",
  1: "Implementasi Kebijakan",
  2: "Evaluasi dan Keberlanjutan Kebijakan",
  3: "Transparansi dan Partisipasi Publik",
};

const dimensionCodeMap: Record<string, string> = {
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
  apiQuestions,
  dimensionNotes = { a: '', b: '', c: '', d: '' },
  onDimensionInfoChange = () => {},
  isReadOnly = false,
}: QuestionListProps) {
  const dimensionName = stepDimensionMap[activeStep];
  const dimensionCode = dimensionCodeMap[dimensionName];
  const filteredQuestions = apiQuestions.filter(q => q.dimension_name === dimensionName);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (dimensionCode && onDimensionInfoChange) {
      onDimensionInfoChange(dimensionCode, e.target.value);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      {/* Pesan hanya-baca */}
      {isReadOnly && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded mb-4">
          Jawaban sudah terkirim dan tidak dapat diedit.
        </div>
      )}

      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Pertanyaan</h3>

      {/* Daftar Pertanyaan */}
      {filteredQuestions.map((item, index) => (
        <div key={item.id} id={`question-${item.id}`} className="space-y-4 pb-4 border-b last:border-b-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{item.indicator_column_code}.</span>
            <p className="font-semibold text-gray-800">{item.indicator_question}</p>

            {/* Info Indikator */}
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
              disabled={isReadOnly}
            >
              <Lightbulb className="w-5 h-5" />
            </button>
          </div>

          {/* Jawaban Radio Button */}
          <fieldset className="space-y-3" disabled={isReadOnly}>
            {item.instrument_answer
              .sort((a, b) => a.level_id - b.level_id)
              .map((opt) => (
                <label key={opt.level_id} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${item.id}`}
                    checked={selectedAnswers[item.id]?.description === opt.level_description}
                    onChange={() => !isReadOnly && onAnswerChange(item.id, opt.level_description, Number(opt.level_score))}
                    disabled={isReadOnly}
                    className="h-5 w-5 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-700">{opt.level_description}</span>
                </label>
              ))}
          </fieldset>

          {/* File Pendukung */}
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
        </div>
      ))}

      {/* Catatan Tambahan Per Dimensi */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catatan Tambahan untuk Dimensi {dimensionName}
        </label>
        {isReadOnly ? (
          <div className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-3 rounded-md">
            {dimensionNotes[dimensionCode as keyof typeof dimensionNotes] || 'Tidak ada catatan'}
          </div>
        ) : (
          <textarea
            value={dimensionNotes[dimensionCode as keyof typeof dimensionNotes] || ''}
            onChange={handleNoteChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[100px]"
            placeholder="Tambahkan catatan untuk dimensi ini..."
          />
        )}
      </div>
    </div>
  );
}