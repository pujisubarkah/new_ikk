'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const bannerImages = [
  '/banner/Banner1.jpg',
  '/banner/Banner2.jpg',
  '/banner/Banner3.jpg',
  '/banner/Banner4.jpg',
  '/banner/Banner5.jpg',
  '/banner/Banner6.jpg',
  '/banner/Banner7.jpg',
  '/banner/Banner8.jpg',
  '/banner/Banner9.jpg',
  '/banner/Banner10.jpg',
  '/banner/Banner11.jpg',
  '/banner/Banner12.jpg',
]

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length)
    }, 30000) // ganti setiap 30 detik
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-screen overflow-hidden flex flex-col">
      {/* Background carousel */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${bannerImages[currentImageIndex]})`,
          zIndex: -2,
        }}
      />
      {/* Dark overlay biar teks tetap kebaca */}
      <div className="absolute inset-0 bg-[#0f0f0f]/20 z-[-1]" />

      {/* Content */}
      <Navbar />

      <main className="flex-grow flex items-center justify-center text-white px-4 text-center">
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-lg max-w-4xl text-[#16578d]">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Selamat Datang di
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Sistem Informasi Indeks Kualitas Kebijakan
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Membangun kualitas kebijakan <span className="text-[#16578d] font-semibold">berbasis bukti dan berdampak</span> untuk masa depan yang lebih baik.  
            Sistem ini membantu Anda menilai, memantau, dan meningkatkan kualitas kebijakan dengan pendekatan analitik dan data yang solid.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
