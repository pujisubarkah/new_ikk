'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const sections = [
  {
    title: '📋 Pengisian Kebijakan',
    questions: [
      {
        question: 'Apa itu Indeks Kualitas Kebijakan (IKK)?',
        answer:
          'IKK adalah alat ukur untuk menilai sejauh mana kualitas suatu kebijakan berdasarkan pada bukti, proses perumusan, pelibatan pemangku kepentingan, dan dampaknya.',
      },
      {
        question: 'Bagaimana menyajikan bukti dukung dari beberapa dokumentasi yang tebal untuk menjawab pertanyaan IKK?',
        answer: `Jika jawaban pertanyaan IKK terdapat dalam suatu dokumen yang tebal (misalnya dokumen Renstra atau laporan), disarankan untuk mengambil atau memotong file pada bagian yang spesifik yang dapat menjelaskan jawaban pertanyaan dalam IKK. 
File bukti dukung tersebut dapat diunggah ke Google Drive, DropBox, atau layanan cloud lainnya. 
Pastikan tautan bukti dukung sudah diubah hak aksesnya menjadi "publik" agar bisa diakses oleh Admin Instansi dan Koordinator Instansi.`,
      },
    ],
  },
  {
    title: '👥 Enumerator & Pengguna',
    questions: [
      {
        question: 'Apa peran Enumerator dalam sistem ini?',
        answer:
          'Enumerator bertugas untuk mengisi dan mengelola data pada sistem IKK sesuai dengan unit kerja atau wilayahnya.',
      },
    ],
  },
  {
    title: '💡 Bantuan Teknis',
    questions: [
      {
        question: 'Siapa yang bisa saya hubungi jika mengalami kendala?',
        answer:
          'Anda dapat menghubungi tim Helpdesk kami melalui menu "Helpdesk" pada sidebar atau melalui email resmi yang tertera di halaman kontak.',
      },
    ],
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-10">FAQ - Pertanyaan yang Sering Diajukan</h1>

        {sections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-10">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.questions.map((q, qIdx) => {
                const index = `${sectionIdx}-${qIdx}`
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                  >
                    <button
                      className="w-full text-left font-medium text-gray-800 flex justify-between items-center"
                      onClick={() => toggleQuestion(+index.replace('-', ''))}
                    >
                      <span>{q.question}</span>
                      <span className="ml-4 text-blue-500">
                        {openIndex === +index.replace('-', '') ? '-' : '+'}
                      </span>
                    </button>
                    {openIndex === +index.replace('-', '') && (
                      <p className="mt-3 text-gray-600 whitespace-pre-line">{q.answer}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  )
}
