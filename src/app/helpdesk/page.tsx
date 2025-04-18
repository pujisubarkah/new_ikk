'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function HelpdeskPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    unit: '',
    category: '',
    message: ''
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form)
  }

  return (
    <>
      <Navbar />
      <div className="relative py-16 bg-gradient-to-br from-white via-[#f4f8fb] to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#16578d]">Helpdesk IKK</h1>
            <p className="text-gray-700 mt-4 text-lg">
              Jika Anda mengalami kendala dalam pengisian IKK, silakan isi formulir di bawah ini
              atau hubungi tim helpdesk kami melalui surel{' '}
              <a href="mailto:ikk@lan.go.id" className="text-[#16578d] underline">
              ikk@lan.go.id
              </a>.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-sm shadow-xl border border-[#16578d]/10 p-8 rounded-2xl space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16578d] focus:outline-none"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Aktif</label>
              <input
                type="email"
                name="email"
                placeholder="Email Aktif"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16578d] focus:outline-none"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja/Instansi</label>
              <input
                type="text"
                name="unit"
                placeholder="Unit Kerja/Instansi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16578d] focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Masalah</label>
              <select
                name="category"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16578d] focus:outline-none"
                onChange={handleChange}
                required
              >
                <option value="">Pilih Kategori Masalah</option>
                <option value="teknis">Masalah Teknis</option>
                <option value="login">Login & Akses</option>
                <option value="pengisian">Pengisian IKK</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pesan / Permasalahan
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="Jelaskan permasalahan Anda..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16578d] focus:outline-none"
                onChange={handleChange}
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-[#16578d] hover:bg-[#134c77] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Kirim Permintaan
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
