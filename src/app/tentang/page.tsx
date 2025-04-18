'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar'; // pastikan path-nya sesuai
import Footer from '@/components/Footer';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('Rintisan');

  const renderContent = () => {
    switch (activeTab) {
      case 'Kurang':
        return <p>Content for Kurang...</p>;
      case 'Cukup':
        return <p>Content for Cukup...</p>;
      case 'Baik':
        return <p>Content for Baik...</p>;
      case 'Sangat Baik':
        return <p>Content for Sangat Baik...</p>;
      case 'Unggul':
        return <p>Content for Unggul...</p>;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
    <div>
      {/* Section: Mengenal IKK */}
      <div className="container mx-auto p-20">
        <h1 className="text-2xl font-bold mb-4">MENGENAL IKK</h1>
        <p className="mb-4">
          Era keterbukaan informasi semakin mendorong kesadaran publik terhadap kinerja pemerintah yang lebih baik,
          perhatian akan kualitas kebijakan menjadi bagian yang perlu terus diperbaiki secara berkelanjutan. Reformasi
          Birokrasi menjadi salah satu moto yang selalu digaungkan pemerintah dalam rangka meningkatkan kualitas
          pelayanannya kepada publik.
        </p>
        <p className="mb-4">
          Pada tahun 2023 telah terbit Peraturan Menteri PANRB Nomor 3 Tahun 2023 tentang Perubahan Peraturan Menteri
          PANRB Nomor 25 Tahun 2020 tentang Road Map Reformasi Birokrasi 2020-2024 yang menetapkan di dalamnya Indeks
          Reformasi Hukum dan Indeks Kualitas Kebijakan dilanjutkan, disinergikan, dan disederhanakan untuk mengukur
          Area Perubahan Penataan Peraturan Perundangan/ Deregulasi Kebijakan.
        </p>
        <div className="bg-yellow-100 p-4 mb-4">
          <p className="text-lg font-bold text-orange-600">
            Indeks Kualitas Kebijakan adalah instrumen untuk menilai kualitas kebijakan pemerintah dilihat dari proses
            pembuatan kebijakan dan bagaimana melakukan pengaturan agenda, formulasi, implementasi dan proses evaluasi.
            IKK menjadi salah satu indikator penilaian Reformasi Birokrasi (RB) terkait program/area perubahan penataan
            peraturan perundang-undangan/deregulasi kebijakan.
          </p>
        </div>
        <p>
          Pemantauan dan Evaluasi Penyelenggaraan Statistik Sektoral merupakan proses penilaian terhadap pelaksanaan
          penyelenggaraan statistik sektoral di Instansi Pemerintah Pusat dan Pemerintah Daerah untuk menghasilkan
          suatu nilai Indeks Pembangunan Statistik (IPS) yang menggambarkan tingkat kematangan (maturity level) dari
          pelaksanaan penyelenggaraan statistik sektoral di Instansi Pemerintah Pusat dan Pemerintah Daerah.
        </p>
      </div>

      {/* Section: Tujuan IKK */}
      <div className="container mx-auto p-20 rounded-lg mb-8">
  <h1 className="text-2xl font-bold mb-4">TUJUAN IKK</h1>
  <div className="border p-4 rounded-lg mb-8 flex items-center justify-center">
    <span className="text-[#16578D] text-4xl mr-1">&ldquo;</span>
    <p className="text-black font-bold text-center flex-grow mx-1">
      Mendorong penguatan partisipasi publik dan prinsip-prinsip tata kelola yang baik dalam proses pembuatan kebijakan publik, khususnya dalam membangun kebijakan berbasis bukti (evidence-based policy)
    </p>
    <span className="text-[#16578D] text-4xl ml-1">&rdquo;</span>
  </div>
</div>

      {/* Section: Peraturan Terkait */}
      <div className="container mx-auto p-6"></div>
      <h2 className="text-xl font-bold mb-4 ml-40">Peraturan Terkait</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 ml-40">
        <div className="flex flex-col">
          <p className="text-[#16578D] font-bold mb-2">
            PERATURAN BADAN PUSAT STATISTIK NOMOR 3 TAHUN 2022 TENTANG EVALUASI PENYELENGGARAAN STATISTIK SEKTORAL (EPSS)
          </p>
          <p>
            Peraturan Badan Pusat Statistik Nomor 3 Tahun 2022 tentang Evaluasi Penyelenggaraan Statistik Sektoral
            merupakan wujud komitmen BPS dalam menghasilkan Indeks Pembangunan Statistik untuk mendukung Sistem Statistik Nasional yang andal, efektif, dan efisien. Peraturan tersebut juga berisi pedoman dalam rangka melaksanakan penilaian penyelenggaraan Statistik Sektoral pada Instansi Pusat dan Pemerintahan Daerah.
          </p>
        </div>
        <div className="border p-4 rounded-lg">
          <iframe
            src="https://drive.google.com/file/d/1Y-rq3pgWlXC2Fe4tMeFEwO7ENI0MF0sE/preview"
            width="640"
            height="480"
            allow="autoplay"
          ></iframe>
        </div>
      </div>

      {/* Section: Penilaian */}
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Tahapan IKK</h1>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 md:pr-4 mb-4 md:mb-0">
            <p className="mb-4">
              Penyusunan dokumen Penilaian IKK melalui beberapa tahapan penting yang melibatkan berbagai pihak terkait. Berikut tahapan-tahapannya:
            </p>
            <ol className="list-decimal pl-5 mb-4">
              <li>
                <strong>Identifikasi Kebijakan yang Dinilai:</strong> Tahap pertama dalam penyusunan dokumen penilaian IKK adalah mengidentifikasi kebijakan yang akan dinilai. Kebijakan yang dimaksud meliputi peraturan-peraturan yang dihasilkan oleh kementerian, lembaga, atau pemerintah daerah, yang secara langsung berdampak pada tata kelola pemerintahan atau masyarakat.
              </li>
              <li>
                <strong>Pengumpulan Data dan Informasi:</strong> Setelah kebijakan diidentifikasi, langkah berikutnya adalah pengumpulan data dan informasi terkait pelaksanaan kebijakan tersebut. Pengumpulan data dilakukan melalui survei, wawancara, dan tinjauan dokumen, untuk memastikan bahwa data yang diperoleh cukup komprehensif dan akurat.
              </li>
              <li>
                <strong>Penilaian Kualitas Kebijakan:</strong> Penilaian kualitas kebijakan dilakukan dengan menggunakan indikator yang telah ditetapkan dalam Permen PANRB No. 25 Tahun 2020. Penilaian ini mencakup aspek-aspek seperti relevansi, efektivitas, efisiensi, dan dampak kebijakan.
              </li>
              <li>
                <strong>Analisis dan Interpretasi Hasil Penilaian:</strong> Setelah penilaian dilakukan, data hasil penilaian diolah untuk dianalisis lebih lanjut. Analisis ini bertujuan untuk mengevaluasi kelemahan dan kekuatan dari kebijakan yang telah dibuat.
              </li>
            </ol>
          </div>
          <div className="md:w-1/2 bg-[#16578D] text-white rounded-lg p-4">
            <div className="flex mb-4 flex-wrap">
              {['Kurang', 'Cukup', 'Baik', 'Sangat Baik', 'Unggul'].map((label) => (
                <button
                  key={label}
                  className={`py-2 px-4 mb-2 mr-2 rounded ${
                    activeTab === label ? 'bg-white text-[#16578D] font-semibold' : ''
                  }`}
                  onClick={() => setActiveTab(label)}
                  aria-label={label}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="bg-white text-[#16578D] p-4 rounded-lg">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AboutPage;