'use client';
import React from 'react';

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
  instrument_answer: AnswerOption[];
}

type SelectedAnswer = {
  description: string;
  score: number;
};

interface AnswerPreviewProps {
  apiQuestions: Question[];
  selectedAnswers: Record<string, SelectedAnswer>;
  uploadedFiles: Record<string, string>;
  dimensionNotes: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

const dimensionLabelMap: Record<string, string> = {
  'Perencanaan Kebijakan': 'a',
  'Implementasi Kebijakan': 'b',
  'Evaluasi dan Keberlanjutan Kebijakan': 'c',
  'Transparansi dan Partisipasi Publik': 'd',
};

export default function AnswerPreview({
  apiQuestions,
  selectedAnswers,
  uploadedFiles,
  dimensionNotes,
}: AnswerPreviewProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-8">
      <h2 className="text-xl font-bold text-gray-800">Preview Hasil Jawaban</h2>

      {/* Loop per dimensi */}
      {Object.keys(dimensionLabelMap).map((dimensionName) => {
        const dimensionKey = dimensionLabelMap[dimensionName] as keyof typeof dimensionNotes;
        const questions = apiQuestions.filter(q => q.dimension_name === dimensionName);

        if (questions.length === 0) return null;

        return (
          <div key={dimensionName} className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">{dimensionName}</h3>
            
            {/* Catatan Tambahan */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan Tambahan:
              </label>
              <div className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-3 rounded-md">
                {dimensionNotes[dimensionKey] || 'Tidak ada catatan'}
              </div>
            </div>

            {/* Tabel Jawaban */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border text-left">No.</th>
                    <th className="px-4 py-2 border text-left">Pertanyaan</th>
                    <th className="px-4 py-2 border text-left">Jawaban</th>
                    <th className="px-4 py-2 border text-left">File Pendukung</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((item) => {
                    const answer = selectedAnswers[item.id];
                    const fileLink = uploadedFiles[item.id];

                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{item.indicator_column_code}</td>
                        <td className="px-4 py-2 border">{item.indicator_question}</td>
                        <td className="px-4 py-2 border">
                          {answer?.description ? answer.description : 'Belum dijawab'}
                        </td>
                        <td className="px-4 py-2 border">
                          {fileLink ? (
                            <a href={fileLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Lihat File
                            </a>
                          ) : (
                            'Tidak ada file'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}