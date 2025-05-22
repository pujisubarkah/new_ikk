'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import Flow from '@/components/flowstep'
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
  SwiperCore.use([Autoplay, Pagination])
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <main className="text-white px-4 text-center bg-[#16578d] py-20">
        <div className="max-w-4xl mx-auto">
        
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Sistem Informasi Pengukuran Kualitas Kebijakan
          </h2>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            Meningkatkan Kualitas Kebijakan Instansi Pemerintah berbasis bukti dukung{' '}
          </p>
        </div>
      </main>

      {/* Image Slider Section */}
      <section className="w-full py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <Swiper
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            slidesPerView={1}
            spaceBetween={20}
          >
            {bannerImages.map((url, index) => (
              <SwiperSlide key={index}>
                <img
                  src={url}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-[300px] md:h-[500px] object-cover rounded-xl shadow-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Flow Steps Section */}
      <section className="bg-white py-16 px-4">
        <Flow />
      </section>

      <Footer />
    </div>
  )
}
