'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar'; // Make sure the path is correct
import Footer from '@/components/Footer';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('Unggul');

  const renderContent = () => {
    switch (activeTab) {
      case 'Kurang':
      return (
        <p>
        Predikat <strong>Kurang</strong> menunjukkan bahwa kualitas kebijakan masih jauh dari standar yang diharapkan.
        Proses pembuatan kebijakan, pengaturan agenda, formulasi, implementasi, dan evaluasi belum dilakukan secara
        memadai, sehingga kebijakan yang dihasilkan kurang relevan, tidak efektif, dan memiliki dampak yang minim.
        </p>
      );
      case 'Cukup':
      return (
        <p>
        Predikat <strong>Cukup</strong> menunjukkan bahwa kualitas kebijakan telah memenuhi beberapa aspek dasar,
        namun masih terdapat kekurangan dalam proses pembuatan kebijakan, formulasi, atau implementasi. Kebijakan
        dianggap cukup relevan, namun efektivitas dan efisiensinya masih perlu ditingkatkan.
        </p>
      );
      case 'Baik':
      return (
        <p>
        Predikat <strong>Baik</strong> menunjukkan bahwa kebijakan telah memenuhi sebagian besar standar kualitas.
        Proses pembuatan kebijakan dilakukan dengan baik, formulasi dan implementasi sudah cukup efektif, serta
        kebijakan memiliki dampak yang positif meskipun masih ada ruang untuk perbaikan.
        </p>
      );
      case 'Sangat Baik':
      return (
        <p>
        Predikat <strong>Sangat Baik</strong> menunjukkan bahwa kebijakan telah memenuhi hampir seluruh standar
        kualitas yang diharapkan. Proses pembuatan kebijakan dilakukan secara komprehensif, formulasi dan
        implementasi sangat efektif, serta kebijakan memberikan dampak yang signifikan dan relevan.
        </p>
      );
      case 'Unggul':
      return (
        <p>
        Predikat <strong>Unggul</strong> menunjukkan bahwa kebijakan telah mencapai tingkat kualitas tertinggi.
        Seluruh proses, mulai dari pengaturan agenda, formulasi, implementasi, hingga evaluasi, dilakukan dengan
        sangat baik. Kebijakan yang dihasilkan sangat relevan, efektif, efisien, dan memberikan dampak yang luar
        biasa dalam mendukung tata kelola pemerintahan yang baik.
        </p>
      );
      default:
      return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        {/* Section: Mengenal IKK */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#16578d] mb-6">MENGENAL INDEKS KUALITAS KEBIJAKAN (IKK)</h1>
            <p className="text-base mb-6">
            Era keterbukaan informasi semakin mendorong kesadaran publik terhadap kinerja pemerintah yang lebih baik,
            perhatian akan kualitas kebijakan menjadi bagian yang perlu terus diperbaiki secara berkelanjutan. Reformasi
            Birokrasi menjadi salah satu moto yang selalu digaungkan pemerintah dalam rangka meningkatkan kualitas
            pelayanannya kepada publik.
            </p>
            <p className="text-base mb-6">
            Pada tahun 2023 telah terbit Peraturan Menteri PANRB Nomor 3 Tahun 2023 tentang Perubahan Peraturan Menteri
            PANRB Nomor 25 Tahun 2020 tentang Road Map Reformasi Birokrasi 2020-2024 yang menetapkan di dalamnya Indeks
            Kualitas Kebijakan sebagai instrumen penting untuk mengukur kualitas kebijakan.
            </p>
            <div className="bg-[#f9f9f9] p-6 rounded-lg mb-6 shadow-md">
            <p className="text-base font-bold text-[#16578d]">
              Indeks Kualitas Kebijakan adalah instrumen untuk menilai kualitas kebijakan pemerintah dilihat dari proses
              pembuatan kebijakan dan bagaimana melakukan pengaturan agenda, formulasi, implementasi dan proses evaluasi.
              IKK menjadi salah satu indikator penilaian Reformasi Birokrasi (RB) terkait program/area perubahan penataan
              peraturan perundang-undangan/deregulasi kebijakan.
            </p>
            </div>
            <p className="text-base">
            Pemantauan dan Evaluasi Indeks Kualitas Kebijakan merupakan proses penilaian terhadap pelaksanaan kebijakan di
            Instansi Pemerintah Pusat dan Pemerintah Daerah untuk menghasilkan suatu nilai Indeks Kualitas Kebijakan yang
            menggambarkan tingkat kematangan (maturity level) dari kebijakan yang diimplementasikan.
            </p>
        </div>

        {/* Section: Tujuan IKK */}
        <div className="mb-12 bg-[#f3f9fb] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#16578d] mb-6">TUJUAN IKK</h2>
          <div className="border p-6 rounded-lg mb-8 flex items-center justify-center">
            <span className="text-[#16578D] text-4xl mr-1">&ldquo;</span>
            <p className="text-black font-semibold text-center flex-grow mx-1">
              Mendorong penguatan partisipasi publik dan prinsip-prinsip tata kelola yang baik dalam proses pembuatan
              kebijakan publik, khususnya dalam membangun kebijakan berbasis bukti (evidence-based policy)
            </p>
            <span className="text-[#16578D] text-4xl ml-1">&rdquo;</span>
          </div>
        </div>

        {/* Section: Peraturan Terkait */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#16578d] mb-6">Peraturan Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
                <p className="text-[#16578d] font-semibold mb-4">
                SURAT EDARAN KEPALA LAN NOMOR 22/K.1/HKM/02.2/2021 TENTANG PANDUAN PENGUKURAN KUALITAS KEBIJAKAN</p>
              <p className="text-base mb-6">
              Surat Edaran ini disusun sebagai panduan bagi Kementerian, Lembaga, dan Pemerintah Daerah dalam melakukan pengukuran kualitas kebijakan. Selain itu, surat edaran ini juga berfungsi sebagai instrumen untuk menilai <b>Indeks Kualitas Kebijakan (IKK)</b>, yang menjadi salah satu indikator dalam program atau area perubahan penataan regulasi. Penilaian ini dilakukan sesuai dengan arahan dalam Peraturan Menteri PANRB Nomor 25 Tahun 2020 tentang Road Map Reformasi Birokrasi 2020–2024.
              </p>
            </div>
            <div className="border p-4 rounded-lg">
                <iframe
                src="/files/se-kepala-lan-nomor-22-tahun-2021.pdf"
                width="100%"
                height="400"
                allow="autoplay"
                className="rounded-md"
                ></iframe>
            </div>
          </div>
        </div>

        {/* Section: Penilaian */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#16578d] mb-6">Tahapan IKK</h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
              <p className="text-base mb-6">
                Penyusunan dokumen Penilaian IKK melalui beberapa tahapan penting yang melibatkan berbagai pihak terkait.
                Berikut tahapan-tahapannya:
              </p>
              <ol className="list-decimal pl-6 mb-6">
                <li>
                  <strong>Identifikasi Kebijakan yang Dinilai:</strong> Tahap pertama dalam penyusunan dokumen penilaian IKK
                  adalah mengidentifikasi kebijakan yang akan dinilai.
                </li>
                <li>
                  <strong>Pengumpulan Data dan Informasi:</strong> Pengumpulan data dilakukan melalui survei, wawancara, dan
                  tinjauan dokumen.
                </li>
                <li>
                  <strong>Penilaian Kualitas Kebijakan:</strong> Penilaian ini mencakup relevansi, efektivitas, efisiensi, dan
                  dampak kebijakan.
                </li>
                <li>
                  <strong>Analisis dan Interpretasi Hasil Penilaian:</strong> Hasil penilaian dianalisis untuk mengevaluasi
                  kebijakan yang telah dibuat.
                </li>
              </ol>
            </div>
            <div className="md:w-1/2 bg-[#16578D] text-white rounded-lg p-6">
                <div className="flex mb-4 flex-wrap justify-center">
                {['Kurang', 'Cukup', 'Baik', 'Sangat Baik', 'Unggul'].map((label) => (
                  <button
                  key={label}
                  className={`py-1 px-4 text-sm md:text-base whitespace-nowrap rounded-lg ${
                    activeTab === label ? 'bg-white text-[#16578D] font-semibold' : 'bg-transparent'
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
