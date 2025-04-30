'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function Login() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setShowErrorModal(false)

    try {
      const response = await axios.post('/api/login', {
        username,
        password,
      })

      const { id, role_id, username: resUsername, name, role } = response.data

      // Simpan ke localStorage
      localStorage.setItem('id', id.toString())
      localStorage.setItem('role_id', role_id.toString())
      localStorage.setItem('username', resUsername)
      localStorage.setItem('name', name)
      localStorage.setItem('role', role)

      setShowSuccessModal(true)

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || 'Login failed')
      } else {
        setError('An unexpected error occurred')
      }
      setShowErrorModal(true)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Carousel */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${bannerImages[currentImageIndex]})`,
          zIndex: -2,
        }}
      />
      <div className="absolute inset-0 bg-black/30 z-[-1]" />

      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-6xl w-full">
          {/* Welcome Text */}
          <div className="flex-1 max-w-3xl text-center bg-white/90 backdrop-blur-sm shadow-xl p-10 rounded-2xl border border-[#16578d]/20 text-[#16578d]">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Selamat Datang di
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
              Sistem Informasi Indeks Kualitas Kebijakan
            </h2>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              Membangun kualitas kebijakan{' '}
              <span className="text-[#16578d] font-semibold">
                berbasis bukti dan berdampak
              </span>{' '}
              untuk masa depan yang lebih baik.
              Sistem ini membantu Anda menilai, memantau, dan meningkatkan kualitas kebijakan dengan pendekatan analitik dan data yang solid.
            </p>
          </div>

          {/* Login Form */}
          <div className="flex-1 max-w-md w-full bg-white/90 backdrop-blur-sm shadow-xl p-8 rounded-2xl border border-[#16578d]/30 text-[#16578d]">
            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
  {/* Username Input */}
  <div>
    <label htmlFor="username" className="block text-sm font-medium">
      Username
    </label>
    <input
      type="text"
      id="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
      className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16578d]"
      placeholder="yourusername"
    />
  </div>

  {/* Password Input */}
  <div>
    <label htmlFor="password" className="block text-sm font-medium">
      Password
    </label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16578d]"
      placeholder="Your password"
    />
  </div>

  {/* Login Button */}
  <button
    type="submit"
    className="w-full py-3 bg-[#16578d] text-white font-semibold rounded-md hover:bg-[#12466f] focus:outline-none focus:ring-2 focus:ring-[#16578d]"
  >
    Login
  </button>

  {/* Tambahkan ini */}
  <p className="text-center text-sm text-gray-600 mt-4">
    Koordinator Instansi?{' '}
    <a
      href="/register"
      className="text-[#16578d] font-semibold hover:underline"
    >
      Daftar di sini
    </a>
  </p>
</form>

          </div>
        </div>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-lg font-semibold text-green-600">Login Berhasil!</h2>
              <p className="text-sm text-gray-600 mt-4">Anda akan diarahkan ke Dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-lg font-semibold text-red-600">Login Gagal!</h2>
              <p className="text-sm text-gray-600 mt-4">{error}</p>
              <button
                className="mt-4 px-4 py-2 bg-[#16578d] text-white rounded-md"
                onClick={() => setShowErrorModal(false)}
              >
                Coba Lagi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
