'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt with:', username, password)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-6xl w-full">
          
          {/* Left welcome message */}
          <div className="flex-1 max-w-3xl text-center bg-white shadow-xl p-10 rounded-2xl border border-blue-100">
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

          {/* Right login form */}
          <div className="flex-1 max-w-md w-full bg-white shadow-xl p-8 rounded-2xl border border-blue-200">
         

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="yourusername"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>

              <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              
              </div>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
