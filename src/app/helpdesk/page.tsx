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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Kirim data ke Supabase atau email
    console.log(form)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Helpdesk</h1>
        <p className="text-gray-600 text-center mb-8">
          Silakan isi formulir di bawah atau hubungi tim helpdesk jika mengalami kendala dalam pengisian IKK.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Aktif"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="unit"
            placeholder="Unit Kerja"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            onChange={handleChange}
          />
          <select
            name="category"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            onChange={handleChange}
            required
          >
            <option value="">Pilih Kategori Masalah</option>
            <option value="teknis">Masalah Teknis</option>
            <option value="login">Login & Akses</option>
            <option value="pengisian">Pengisian IKK</option>
            <option value="lainnya">Lainnya</option>
          </select>
          <textarea
            name="message"
            placeholder="Jelaskan permasalahan Anda..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Kirim
          </button>
        </form>
      </div>
      <Footer />
    </>
  )
}
