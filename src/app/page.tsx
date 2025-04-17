import Navbar from '@/components/Navbar'  // Import Navbar
import Footer from '@/components/Footer'  // Import Footer

export default function Home() {
  return (
    <>
      <Navbar />  {/* Menambahkan Navbar di bagian atas */}
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
        <div className="max-w-3xl text-center bg-white shadow-xl p-10 rounded-2xl border border-blue-100">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
            Selamat Datang di
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
            Sistem Informasi Indeks Kualitas Kebijakan
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Membangun kualitas kebijakan <span className="text-blue-600 font-semibold">berbasis bukti dan berdampak</span> untuk masa depan yang lebih baik.  
            Sistem ini membantu Anda menilai, memantau, dan meningkatkan kualitas kebijakan dengan pendekatan analitik dan data yang solid.
          </p>
        </div>
      </main>
      <Footer />  {/* Menambahkan Footer di bagian bawah */}
    </>
  );
}
