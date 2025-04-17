'use client';
import React, { useState } from 'react';

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
    <div>
      {/* Section: Mengenal IKK */}
      <div className="container mx-auto p-6">
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
            Indeks Kualitas Kebijakan (IKK) masih menjadi salah satu indikator pencapaian Reformasi Birokrasi Nasional.
            Oleh karena itu, Kementerian/Lembaga/Pemerintah Daerah perlu secara aktif bergerak untuk dapat mendukung
            keberhasilan Reformasi Birokrasi dengan meningkatkan kualitas kebijakan di instansinya.
          </p>
        </div>
        <p>
          Pemantauan dan Evaluasi Penyelenggaraan Statistik Sektoral merupakan proses penilaian terhadap pelaksanaan
          penyelenggaraan statistik sektoral di Instansi Pemerintah Pusat dan Pemerintah Daerah untuk menghasilkan
          suatu nilai Indeks Pembangunan Statistik (IPS) yang menggambarkan tingkat kematangan (maturity level) dari
          pelaksanaan penyelenggaraan statistik sektoral di Instansi Pemerintah Pusat dan Pemerintah Daerah.
        </p>
      </div>

      {/* Section: Tujuan EPSS */}
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">TUJUAN IKK</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border p-4 rounded-lg">
            <p className="text-[#16578D] font-bold">Mengukur capaian kemajuan</p>
            <p>penyelenggaraan Statistik Sektoral pada Instansi Pusat dan Pemerintahan Daerah</p>
          </div>
          <div className="border p-4 rounded-lg">
            <p className="text-[#16578D] font-bold">Meningkatkan kualitas penyelenggaraan Statistik Sektoral</p>
            <p>pada Instansi Pusat dan Pemerintahan Daerah</p>
          </div>
          <div className="border p-4 rounded-lg">
            <p className="text-[#16578D] font-bold">Meningkatkan kualitas pelayanan publik</p>
            <p>di bidang statistik pada Instansi Pusat dan Pemerintahan Daerah</p>
          </div>
        </div>

        {/* Section: Peraturan Terkait */}
        <h2 className="text-xl font-bold mb-4">Peraturan Terkait</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-[#16578D] font-bold mb-2">
              PERATURAN BADAN PUSAT STATISTIK NOMOR 3 TAHUN 2022 TENTANG EVALUASI PENYELENGGARAAN STATISTIK SEKTORAL (EPSS)
            </p>
            <p>
              Peraturan Badan Pusat Statistik Nomor 3 Tahun 2022 tentang Evaluasi Penyelenggaraan Statistik Sektoral
              merupakan wujud komitmen BPS dalam menghasilkan Indeks Pembangunan Statistik untuk mendukung Sistem
              Statistik Nasional yang andal, efektif, dan efisien. Peraturan tersebut juga berisi pedoman dalam rangka
              melaksanakan penilaian penyelenggaraan Statistik Sektoral pada Instansi Pusat dan Pemerintahan Daerah.
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
      </div>

      {/* Section: Penilaian */}
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Penilaian</h1>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 md:pr-4 mb-4 md:mb-0">
            <p className="mb-4">
              Dalam menilai perkembangan kapabilitas organisasi dalam penyelenggaraan Statistik Sektoral, Badan Pusat
              Statistik menggunakan <i>Capability Maturity Model</i> (CMM). Model ini telah dikembangkan untuk mengukur
              berbagai tingkat kematangan lain, seperti tingkat kematangan tata kelola teknologi informasi dan
              komunikasi, tingkat kematangan manajemen pengetahuan, dan lain-lain.
            </p>
            <p className="mb-4">
              Tingkat kematangan kapabilitas proses merupakan pengukuran kemampuan organisasi pada suatu proses yang
              digunakan untuk pengukuran tingkat kematangan kebijakan, tata kelola, dan manajemen penyelenggaraan
              Statistik Sektoral. Tingkat kematangan kapabilitas proses diukur dengan 5 tingkatan yaitu rintisan,
              terkelola, terdefinisi, terpadu dan terukur, dan optimum.
            </p>
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
  );
};

export default AboutPage;
