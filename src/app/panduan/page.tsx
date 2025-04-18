'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PanduanIKKPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Panduan Pengukuran Indeks Kualitas Kebijakan (IKK)</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">🎯 Tujuan IKK</h2>
          <p>
            Mendorong penguatan partisipasi publik dan prinsip tata kelola yang baik dalam proses pembuatan kebijakan publik,
            khususnya kebijakan berbasis bukti (*evidence-based policy*) di seluruh instansi pemerintah.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">📌 Kebijakan yang Dinilai</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Diambil dari 3 tahun terakhir dan telah diimplementasikan minimal 1 tahun.</li>
            <li>Dikecualikan: kebijakan internal (SOP, struktur organisasi, dll) dan kebijakan periodik rutin.</li>
            <li>Sampling dilakukan otomatis oleh sistem SI IKK.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">🧪 Proses Pengukuran</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Self assessment oleh Enumerator via SI IKK (ikk.lan.go.id)</li>
            <li>Validasi oleh Koordinator Instansi (LAN)</li>
            <li>Review oleh Board Member dalam forum</li>
            <li>Finalisasi & pemeringkatan hasil</li>
            <li>Diseminasi praktik baik dari instansi dengan skor terbaik</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">👥 Peran dalam Sistem</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Koordinator Instansi:</strong> LAN, fasilitasi dan validasi penilaian</li>
            <li><strong>Admin Instansi:</strong> Tentukan populasi, kelola akun enumerator, pantau progress</li>
            <li><strong>Enumerator:</strong> Lakukan pengisian dan unggah bukti penilaian kebijakan</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">📂 Bukti Dukung</h2>
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
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">📥 Akses Sistem</h2>
          <p>
            Sistem dapat diakses melalui <a href="https://ikk.lan.go.id" target="_blank" className="text-blue-600 underline">ikk.lan.go.id</a>. 
            Akun diberikan oleh Koordinator Instansi LAN ke Admin Instansi.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">📞 Kontak Helpdesk</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Layanan Sedulur PUSAKA (WA): 0812-3510-0050</li>
            <li>Email: <a href="mailto:pusaka@lan.go.id" className="text-blue-600 underline">pusaka@lan.go.id</a></li>
            <li>Email alternatif: <a href="mailto:indekskualitaskebijakan@gmail.com" className="text-blue-600 underline">indekskualitaskebijakan@gmail.com</a></li>
            <li>Website: <a href="https://ikk.lan.go.id" target="_blank" className="text-blue-600 underline">ikk.lan.go.id</a></li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}
