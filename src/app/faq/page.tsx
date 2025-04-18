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
      {
        question: 'Apakah harus mengunggah bukti dukung pada setiap pertanyaan atau bisa menggunakan tautan terpisah di luar SI IKK untuk mengumpulkan bukti dukung jawaban pertanyaan dalam instrumen IKK?',
        answer: `Enumerator tetap mengunggah sebuah file bukti dukung pada kolom bukti dukung di bawah setiap pertanyaan IKK karena progres pengisian akan dihitung oleh SI IKK berdasarkan pengisian jawaban dan unggah bukti jawaban pada kolom yang tersedia. Namun, Enumerator dapat menyediakan tautan di luar SI IKK misalnya Google Drive atau Drop Box untuk menambah bukti dukung.`,
      },
      {
        question: 'Apakah Enumerator bisa unggah lebih dari 1 (satu) file sebagai bukti dukung untuk menjawab 1 (satu) pertanyaan?',
        answer: `Setiap pertanyaan hanya diberikan 1 file bukti dukung dengan format PDF dan tidak ada batasan ukuran file. Jika Enumerator memiliki beberapa file bukti dukung, disarankan untuk mengambil/memotong file pada bagian yang spesifik dapat menjelaskan jawaban pertanyaan dalam IKK. File yang lain jika diperlukan dapat diunggah ke tautan Google Drive atau Drop Box.`,
      },
      {
        question: 'Jika Enumerator menyediakan tautan untuk mengumpulkan bukti dukung, di mana Enumerator dapat menginformasikan tautan bukti dukung tersebut?',
        answer: `Terdapat beberapa alternatif antara lain:
- Enumerator dapat menginformasikan tautan bukti dukung misalnya tautan Google Drive atau Drop Box kepada Admin Instansi agar diteruskan kepada Koordinator IKK di LAN; atau
- Enumerator dapat menuliskan tautan dalam suatu file dokumen kemudian disimpan dalam format PDF kemudian diunggah dalam kolom bukti dukung pada pertanyaan terkait; atau
- Enumerator dapat memberikan penjelasan dan menuliskan tautan bukti dukung tambahan pada kolom input jawaban terbuka pada setiap bagian akhir pertanyaan di masing-masing sub dimensi IKK (agenda setting, formulasi kebijakan, implementasi kebijakan, dan evaluasi kebijakan).`,
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
      {
        question: 'Siapa dan apa peran Enumerator dalam penilaian IKK?',
        answer: `- Enumerator ditentukan oleh Admin Instansi dan bekerja di bawah koordinasi dan supervisi Admin Instansi.\n
- Dapat ditugaskan lebih dari satu orang dari Eselon 3/4/5, Fungsional, atau Pelaksana di bidang kebijakan.\n
- Jumlahnya menyesuaikan kebijakan yang dinilai atau hasil random sampling dalam SI IKK.\n
- Bertugas sesuai panduan/toolkit pelaksanaan pengukuran IKK.`,
      },
      {
        question: 'Siapa dan apa peran Admin Instansi dalam penilaian IKK?',
        answer: `- Admin Instansi ditunjuk 1 orang dari Eselon 2/3 atau pejabat fungsional kebijakan.\n
- Bisa berasal dari Biro Hukum, Pusat Kebijakan, atau unit lain yang relevan.\n
- Koordinasi langsung dengan Koordinator Instansi di LAN.\n
- Melaksanakan peran sesuai toolkit pelaksanaan IKK.`,
      },
      {
        question: 'Bagaimana berpartisipasi dalam pengukuran IKK dan menggunakan sistem informasi IKK?',
        answer: `Instansi pemerintah mengirimkan lembar konfirmasi data Admin Instansi ke LAN. Selanjutnya LAN akan mengaktifkan akun Admin Instansi di SI IKK untuk memulai proses pengisian.`,
      },
    ],
  },
  {
    title: '🧠 Proses Penilaian & Sampling',
    questions: [
      {
        question: 'Apabila daftar kebijakan yang menjadi populasi kebijakan sudah dikirim ke Koordinator IKK di LAN, apakah Admin Instansi dapat mengubah usulan Daftar Populasi kembali?',
        answer: `Admin Instansi tidak bisa mengubah daftar populasi setelah dikirim ke Koordinator IKK. Namun, bisa meminta penundaan verifikasi ke Koordinator IKK. Setelah itu, daftar bisa diperbaiki.`,
      },
      {
        question: 'Siapa yang melakukan pemilihan sampel kebijakan yang dinilai dalam IKK?',
        answer: `Pemilihan sampel dilakukan otomatis oleh SI IKK melalui proses random sampling dari populasi kebijakan yang telah disetujui Koordinator IKK.`,
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
];


const primaryColor = '#16578d'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const toggleQuestion = (index: string) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1
          className="text-4xl font-bold text-center mb-12"
          style={{ color: primaryColor }}
        >
          FAQ - Pertanyaan yang Sering Diajukan
        </h1>

        {sections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-12">
            <h2
              className="text-2xl font-semibold mb-6 border-b pb-2"
              style={{ color: primaryColor, borderColor: '#dce7f2' }}
            >
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.questions.map((q, qIdx) => {
                const index = `${sectionIdx}-${qIdx}`
                const isOpen = openIndex === index

                return (
                  <div
                    key={index}
                    className="border rounded-xl p-5 bg-white shadow transition-all duration-300 ease-in-out hover:shadow-md"
                    style={{
                      borderColor: isOpen ? primaryColor : '#e2e8f0',
                      backgroundColor: isOpen ? '#f1f8fd' : 'white',
                    }}
                  >
                    <button
                      className="w-full flex justify-between items-center text-left text-lg font-medium focus:outline-none"
                      style={{ color: primaryColor }}
                      onClick={() => toggleQuestion(index)}
                    >
                      <span>{q.question}</span>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: isOpen ? '#c0392b' : primaryColor }}
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
                        {q.answer}
                      </p>
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