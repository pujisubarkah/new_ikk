'use client'

import { useState, useEffect } from 'react'
import SidebarAdmin from '@/components/sidebar-admin'
import SidebarKoor from '@/components/sidebar-koornas'
import SidebarInst from '@/components/sidebar-verif'
import SidebarEnum from '@/components/sidebar-enum'
import Sidebar from '@/components/sidebar-koorins'
import axios from 'axios'
import { toast } from "sonner"

interface CustomFormData {
  name: string;
  email: string;
  unit: string;
  category: string;
  message: string;
}

interface MainContentProps {
  form: CustomFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

function MainContent({ form, handleChange, handleSubmit }: MainContentProps) {
  return (
    <div className="w-full px-8 py-10 bg-white shadow-md rounded-lg">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-[#16578d] mb-4">Helpdesk IKK</h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Jika Anda mengalami kendala dalam pengisian IKK, silakan isi formulir di bawah ini
          atau hubungi tim helpdesk kami melalui surel{' '}
          <a href="mailto:ikk@lan.go.id" className="text-[#16578d] underline">
            ikk@lan.go.id
          </a>.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 shadow-sm border border-gray-200 p-8 rounded-lg space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={form.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16578d] focus:outline-none"
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
              value={form.email}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16578d] focus:outline-none"
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
              value={form.unit}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16578d] focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Masalah</label>
            <select
              name="category"
              value={form.category}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16578d] focus:outline-none"
              onChange={handleChange}
              required
            >
              <option value="">Pilih Kategori Masalah</option>
              <option value="TEKNIS">Masalah Teknis</option>
              <option value="LOGIN/AKSES">Login / Akses IKK</option>
              <option value="INSTRUMEN">Pengisian Instrumen IKK</option>
              <option value="LAINNYA">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pesan / Permasalahan</label>
            <textarea
              name="message"
              rows={4}
              placeholder="Jelaskan permasalahan Anda..."
              value={form.message}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16578d] focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#16578d] hover:bg-[#134c77] text-white px-6 py-2 rounded-md font-medium transition-colors duration-300"
            >
              Kirim Permintaan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function HelpdeskPage() {
  const [form, setForm] = useState<CustomFormData>({
    name: '',
    email: '',
    unit: '',
    category: '',
    message: ''
  })

  const [roleId, setRoleId] = useState<number | null>(null)

  useEffect(() => {
    const savedRoleId = localStorage.getItem('role_id')
    if (savedRoleId) setRoleId(Number(savedRoleId))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      nama_lengkap: form.name,
      email_aktif: form.email,
      instansi: form.unit,
      masalah: form.category,
      pesan: form.message,
    }

    try {
      const response = await axios.post('/api/helpdesk', payload)

      if (response.status === 201) {
        toast.success('Pesan Anda telah dikirim, dapatkan pemberitahuan melalui email')
        setForm({
          name: '',
          email: '',
          unit: '',
          category: '',
          message: '',
        })
      } else {
        toast.error('Pesan Anda gagal dikirim, silakan coba lagi')
      }
    } catch (error) {
      toast.error('Pesan Anda gagal dikirim, silakan coba lagi')
      console.error('An error occurred:', error)
    }
  }

  const content = (
    <MainContent
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  )

  const renderSidebar = () => {
    switch (roleId) {
      case 1: return <SidebarAdmin>{content}</SidebarAdmin>
      case 2: return <SidebarKoor>{content}</SidebarKoor>
      case 3: return <SidebarInst>{content}</SidebarInst>
      case 5: return <SidebarEnum>{content}</SidebarEnum>
      case 4:
      default: return <Sidebar>{content}</Sidebar>
    }
  }

  return <div>{renderSidebar()}</div>
}
