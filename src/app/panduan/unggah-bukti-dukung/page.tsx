'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PanduanIKKPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-white via-[#f6f9fc] to-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-[#16578d] mb-10 text-center">
            Panduan Unggah Dokumen Bukti Dukung
          </h1>

        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-semibold text-[#16578d] mb-4">Google Drive</h2>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Buka GoogleDrive dan login ke akun Anda.</li>
                    <li>Unggah dokumen/kumpulan dokumen dalam folder yang ingin Anda bagikan.</li>
                    <li>Pilih file/folder yang ingin Anda bagikan.</li>
                    <li>Klik <strong>Bagikan</strong> atau <strong>Bagikan Bagikan</strong>.</li>
                    <li>Pada bagian <strong>Akses umum</strong>, klik <strong>Panah bawah</strong>.</li>
                    <li>Pilih <strong>Siapa saja yang memiliki link (Anyone with the link)</strong>.</li>
                    <li>Untuk menentukan peran orang lain, pilih sebagai <strong>Pelihat (Viewer)</strong></li>
                    <li>Klik <strong>Salin link</strong>.</li>
                    <li>Klik <strong>Selesai</strong>.</li>
                    <li>Salin link yang tersedia, lalu tempelkan di field bukti dukung yang diminta.</li>
                </ol>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#16578d] mb-4">OneDrive</h2>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Buka OneDrive dan login ke akun Anda.</li>
                    <li>Unggah dokumen yang ingin Anda bagikan.</li>
                    <li>Klik kanan pada dokumen tersebut, lalu pilih <strong>Bagikan</strong>.</li>
                    <li>Pilih opsi <strong>Siapa saja yang memiliki link</strong> untuk berbagi secara publik.</li>
                    <li>Salin link yang tersedia, lalu tempelkan di field bukti dukung yang diminta.</li>
                </ol>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#16578d] mb-4">Dropbox</h2>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Buka Dropbox dan login ke akun Anda.</li>
                    <li>Unggah dokumen yang ingin Anda bagikan.</li>
                    <li>Klik ikon <strong>Bagikan</strong> di sebelah dokumen tersebut.</li>
                    <li>Pilih opsi untuk membuat link berbagi, lalu pastikan pengaturan berbagi diatur ke <strong>Siapa saja yang memiliki link</strong>.</li>
                    <li>Salin link yang tersedia, lalu tempelkan di tempat yang diperlukan.</li>
                </ol>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#16578d] mb-4">Nextcloud</h2>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Buka Nextcloud dan login ke akun Anda.</li>
                    <li>Unggah dokumen yang ingin Anda bagikan.</li>
                    <li>Klik ikon <strong>Bagikan</strong> di sebelah dokumen tersebut.</li>
                    <li>Aktifkan opsi <strong>Bagikan link</strong> dan pastikan pengaturan berbagi diatur ke <strong>Publik</strong>.</li>
                    <li>Salin link yang tersedia, lalu tempelkan di tempat yang diperlukan.</li>
                </ol>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-[#16578d] mb-4">Penyimpanan Cloud Lainnya</h2>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Buka layanan penyimpanan cloud pilihan Anda dan login ke akun Anda.</li>
                    <li>Unggah dokumen yang ingin Anda bagikan.</li>
                    <li>Cari opsi <strong>Bagikan</strong> atau <strong>Dapatkan link</strong>.</li>
                    <li>Pastikan pengaturan berbagi diatur ke <strong>Siapa saja yang memiliki link</strong> atau <strong>Publik</strong>.</li>
                    <li>Salin link yang tersedia, lalu tempelkan di tempat yang diperlukan.</li>
                </ol>
            </section>
        </div>

</div>
      </main>
      <Footer />
    </>
  )
}