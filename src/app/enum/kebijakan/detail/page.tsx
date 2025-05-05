'use client';

import { useState } from "react";
import Sidebar from "@/components/sidebar-enum";

const steps = [
  "1. Perencanaan Kebijakan",
  "2. Implementasi Kebijakan",
  "3. Evaluasi Keberlanjutan",
  "4. Transparansi dan Partisipasi",
];

// Dummy data pertanyaan multiple choice per step
const questionsPerStep: Record<number, { question: string, options: string[] }[]> = {
  0: [
    {
      question: "Apa tujuan utama dari kebijakan ini?",
      options: [
        "Meningkatkan kualitas pendidikan",
        "Mencegah korupsi",
        "Mengurangi kemiskinan",
        "Pembangunan infrastruktur"
      ]
    },
    {
      question: "Siapa yang terlibat dalam proses perencanaan?",
      options: [
        "Pemerintah daerah",
        "Masyarakat",
        "Pihak swasta",
        "Semua pihak terkait"
      ]
    }
  ],
  1: [
    {
      question: "Sudahkah kebijakan diterapkan di lapangan?",
      options: [
        "Sudah diterapkan sepenuhnya",
        "Sedang dalam proses penerapan",
        "Belum diterapkan",
        "Tidak tahu"
      ]
    },
    {
      question: "Apa saja hambatan implementasi yang ditemukan?",
      options: [
        "Kurangnya anggaran",
        "Kurangnya sosialisasi",
        "Kendala infrastruktur",
        "Tidak ada hambatan"
      ]
    }
  ],
  2: [
    {
      question: "Bagaimana evaluasi dampak kebijakan dilakukan?",
      options: [
        "Melalui survei kepada masyarakat",
        "Melalui laporan resmi",
        "Melalui analisis data",
        "Tidak dilakukan evaluasi"
      ]
    },
    {
      question: "Apa indikator keberlanjutan yang digunakan?",
      options: [
        "Tingkat partisipasi masyarakat",
        "Keberhasilan program",
        "Indikator ekonomi",
        "Semua jawaban benar"
      ]
    }
  ],
  3: [
    {
      question: "Apakah ada forum partisipatif untuk publik?",
      options: [
        "Ada dan aktif",
        "Ada tapi kurang aktif",
        "Tidak ada",
        "Tidak tahu"
      ]
    },
    {
      question: "Bagaimana data transparansi dipublikasikan?",
      options: [
        "Melalui website pemerintah",
        "Melalui media sosial",
        "Melalui laporan tahunan",
        "Tidak dipublikasikan"
      ]
    }
  ],
};

export default function PolicyPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<number, string>>({});

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleLinkUpload = (questionIndex: number, link: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [questionIndex]: link,
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white">
        <Sidebar>
          <div>Sidebar Content</div>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-8 bg-gray-50">
        <PolicyCard />
        <PolicyStepsNav activeStep={activeStep} onChangeStep={setActiveStep} />
        <QuestionList 
          activeStep={activeStep} 
          selectedAnswers={selectedAnswers} 
          onAnswerChange={handleAnswerChange}
          onLinkUpload={handleLinkUpload}
          uploadedFiles={uploadedFiles}
        />
        
        {/* Card Body with additional question and textarea */}
        <div className="card-body bg-white p-8 rounded-xl shadow-xl">
          <ol className="kebijakan__list space-y-6">
            <li className="kebijakan__list-ask">
              <h6 className="text-xl font-semibold text-gray-800">
                Silahkan untuk menambahkan informasi penting terkait 
              </h6>
              <div className="kebijakan__list-answer mt-4 space-y-4">
                <li>
                  <textarea
                    name="informasiA3"
                    cols={30}
                    rows={10}
                    disabled
                    className="form-control block w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan informasi penting di sini..."
                  />
                </li>
                <li>
                  <button
                    type="button"
                    disabled
                    className="btn btn-primary btn-secondary disabled bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 cursor-not-allowed"
                  >
                    Simpan
                  </button>
                </li>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function PolicyCard() {
  return (
    <div className="p-6 lg:p-10 mb-6 rounded-xl shadow-md bg-white">
      <div className="flex flex-col mb-3">
        <small className="text-gray-600">Kabupaten Tapanuli Utara</small>
        <h5 className="text-lg font-semibold">
          Peraturan Bupati Tapanuli Utara Nomor 55 Tahun 2020 tentang Implementasi Pendidikan Karakter Anti Korupsi pada Satuan Pendidikan Dasar
        </h5>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <small className="text-gray-600">Status Kebijakan</small>
          <span className="inline-block w-fit px-3 py-1 rounded-full text-white bg-yellow-500 text-sm">
            PROSES
          </span>
        </div>

        <div className="flex flex-col">
          <small className="text-gray-600">Tanggal Pengesahan</small>
          <strong>05-05-2025</strong>
        </div>

        <div className="flex flex-col">
          <small className="text-gray-600">Progres Pengisian</small>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: "62.82%" }}
              role="progressbar"
              aria-valuenow={62.82}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span className="sr-only">62.82%</span>
            </div>
          </div>
          <div className="text-right text-sm text-blue-600 font-medium mt-1">
            62.82%
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicyStepsNav({
  activeStep,
  onChangeStep,
}: {
  activeStep: number;
  onChangeStep: (step: number) => void;
}) {
  return (
    <ul className="flex flex-wrap gap-2">
      {steps.map((step, index) => (
        <li key={index}>
          <button
            onClick={() => onChangeStep(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              index === activeStep
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {step}
          </button>
        </li>
      ))}
    </ul>
  );
}

function QuestionList({
  activeStep,
  selectedAnswers,
  uploadedFiles,
  onAnswerChange,
  onLinkUpload,
}: {
  activeStep: number;
  selectedAnswers: Record<number, string>;
  uploadedFiles: Record<number, string>;
  onAnswerChange: (questionIndex: number, answer: string) => void;
  onLinkUpload: (questionIndex: number, link: string) => void;
}) {
  const questions = questionsPerStep[activeStep] || [];

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Pertanyaan</h3>
      {questions.map((item, idx) => (
        <div key={idx}>
          <p className="font-semibold text-gray-700">{item.question}</p>
          <div className="space-y-2 mt-2">
            {item.options.map((option, i) => (
              <label key={i} className="block">
                <input
                  type="radio"
                  name={`question-${idx}`}
                  value={option}
                  checked={selectedAnswers[idx] === option}
                  onChange={() => onAnswerChange(idx, option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>

          {/* Input untuk Link Google Drive */}
          <div className="mt-4">
            <div className="md:col-span-2">
              <label htmlFor={`linkDrive-${idx}`} className="block text-sm font-medium text-gray-700">
                Link Google Drive {item.question}
                <span className="text-xs text-gray-500 ml-2">(Pastikan file dapat diakses oleh semua)</span>
              </label>
              <input
                id={`linkDrive-${idx}`}
                name={`linkDrive-${idx}`}
                type="text"
                placeholder="https://drive.google.com/..."
                value={uploadedFiles[idx] || ""}
                onChange={(e) => onLinkUpload(idx, e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                Cara membuat link shareable: Buka file di Google Drive → Klik "Bagikan" → Pilih "Siapa saja dengan link" → Salin link
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}