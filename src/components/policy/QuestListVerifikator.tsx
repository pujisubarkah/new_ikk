'use client';
import React from 'react';
import { toast } from 'sonner';

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
    isSubmitted: boolean; // mode readonly
    onLinkUpload: (questionId: string, fileLink: string) => void;
    verifierNotes: Record<number, string>; // Catatan per dimensi
    onNoteChange: (step: number, note: string) => void;
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
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
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
                </div>
            ))}

            {/* Catatan Verifikator per Dimensi */}
            <div className="pt-6 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan Verifikator untuk Dimensi: {dimensionName}
                </label>
                {isSubmitted ? (
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {verifierNotes[activeStep] || 'Tidak ada catatan'}
                    </p>
                ) : (
                    <textarea
                        value={verifierNotes[activeStep] || ''}
                        onChange={(e) => onNoteChange(activeStep, e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Tuliskan catatan untuk dimensi "${dimensionName}"...`}
                        rows={4}
                    />
                )}
            </div>
        </div>
    );
}
