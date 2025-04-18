'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function PanduanIKKPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-white via-[#f6f9fc] to-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-[#16578d] mb-10 text-center">
            Panduan Pengukuran Indeks Kualitas Kebijakan (IKK)
          </h1>

          {/* Buku Panduan */}
          <section className="mb-16">
            <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 border border-[#16578d]/10">
              <Image
                src="/images/panduan-cover.png" // Ganti path sesuai lokasi file cover
                alt="Cover Panduan IKK"
                width={180}
                height={240}
                className="rounded-lg shadow-md object-cover"
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-[#16578d] mb-2">📘 Buku Panduan IKK</h2>
                <p className="text-gray-700 mb-4">
                  Panduan resmi pelaksanaan dan pengisian Indeks Kualitas Kebijakan. Baca untuk memahami proses, peran, dan kriteria penilaian.
                </p>
                <div className="flex justify-center sm:justify-start gap-3">
                  <a
                    href="/files/panduan-ikk.pdf"
                    target="_blank"
                    className="bg-[#16578d] text-white font-semibold px-5 py-2 rounded-lg hover:bg-[#134c77] transition"
                  >
                    📖 Baca Panduan
                  </a>
                  <a
                    href="/files/panduan-ikk.pdf"
                    download
                    className="bg-white border border-[#16578d] text-[#16578d] font-semibold px-5 py-2 rounded-lg hover:bg-[#f0f4f8] transition"
                  >
                    ⬇️ Unduh PDF
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Konten Informasi */}
          <section className="space-y-10 text-gray-800 leading-relaxed">
            <div>
              <h2 className="text-2xl font-semibold text-[#16578d] mb-2">🎯 Tujuan IKK</h2>
              <p>
                Mendorong penguatan partisipasi publik dan prinsip tata kelola yang baik dalam proses pembuatan kebijakan publik,
                khususnya kebijakan berbasis bukti (*evidence-based policy*) di seluruh instansi pemerintah.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#16578d] mb-2">📌 Kebijakan yang Dinilai</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Diambil dari 3 tahun terakhir dan telah diimplementasikan minimal 1 tahun.</li>
                <li>Dikecualikan: kebijakan internal (SOP, struktur organisasi, dll) dan kebijakan periodik rutin.</li>
                <li>Sampling dilakukan otomatis oleh sistem SI IKK.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#16578d] mb-2">🧪 Proses Pengukuran</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Self assessment oleh Enumerator via SI IKK (ikk.lan.go.id)</li>
                <li>Validasi oleh Koordinator Instansi (LAN)</li>
                <li>Review oleh Board Member dalam forum</li>
                <li>Finalisasi & pemeringkatan hasil</li>
                <li>Diseminasi praktik baik dari instansi dengan skor terbaik</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#16578d] mb-2">👥 Peran dalam Sistem</h2>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Koordinator Instansi:</strong> LAN, fasilitasi dan validasi penilaian</li>
                <li><strong>Admin Instansi:</strong> Tentukan populasi, kelola akun enumerator, pantau progress</li>
                <li><strong>Enumerator:</strong> Lakukan pengisian dan unggah bukti penilaian kebijakan</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#16578d] mb-2">📂 Bukti Dukung</h2>
              <p className="mb-2">
                Jika dokumen terlalu besar (misalnya Renstra/laporan), potong bagian spesifik saja dan unggah dalam bentuk:
              </p>
              <ul className="list-disc list-inside mb-2">
                <li>1 file PDF per pertanyaan</li>
                <li>Jika butuh beberapa file, gabungkan dulu (merge PDF)</li>
                <li>Jika disimpan di cloud, upload tautan file PDF yang berisi link Drive/Dropbox, pastikan akses publik</li>
              </ul>
              <p>
                Enumerator juga dapat menambahkan penjelasan jawaban pada kolom input teks di halaman pengisian.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#16578d] mb-2">📥 Akses Sistem</h2>
              <p>
                Sistem dapat diakses melalui <a href="https://ikk.lan.go.id" target="_blank" className="text-blue-700 underline font-medium">ikk.lan.go.id</a>. 
                Akun diberikan oleh Koordinator Instansi LAN ke Admin Instansi.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#16578d] mb-2">📞 Kontak Helpdesk</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Layanan Sedulur PUSAKA (WA): 0812-3510-0050</li>
                <li>Email: <a href="mailto:pusaka@lan.go.id" className="text-blue-700 underline">pusaka@lan.go.id</a></li>
                <li>Email alternatif: <a href="mailto:indekskualitaskebijakan@gmail.com" className="text-blue-700 underline">indekskualitaskebijakan@gmail.com</a></li>
                <li>Website: <a href="https://ikk.lan.go.id" target="_blank" className="text-blue-700 underline">ikk.lan.go.id</a></li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
