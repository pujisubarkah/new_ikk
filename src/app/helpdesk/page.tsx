'use client'

import { useState, useEffect } from 'react'
import SidebarAdmin from '@/components/sidebar-admin'
import SidebarKoor from '@/components/sidebar-koornas'
import SidebarInst from '@/components/sidebar-verif'
import SidebarEnum from '@/components/sidebar-enum'
import Sidebar from '@/components/sidebar-koorins'
import { User } from 'lucide-react'

export default function HelpdeskPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    unit: '',
    category: '',
    message: ''
  })
  
  const [roleId, setRoleId] = useState<number | null>(null)
  const [roleName, setRoleName] = useState<string>('')
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const savedRoleId = localStorage.getItem('role_id')
    const savedRole = localStorage.getItem('role') || ''
    const savedName = localStorage.getItem('name') || ''

    if (savedRoleId) setRoleId(Number(savedRoleId))
    setRoleName(savedRole)
    setUserName(savedName)
  }, [])

  const renderSidebar = () => {
    switch (roleId) {
      case 1:
        return <SidebarAdmin>{null}</SidebarAdmin>
      case 2:
        return <SidebarKoor>{null}</SidebarKoor>
      case 3:
        return <SidebarInst>{null}</SidebarInst>
      case 5:
        return <SidebarEnum>{null}</SidebarEnum>
      case 4: // bisa jadi default juga
      default:
        return <Sidebar>{null}</Sidebar>
    }
  }

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 h-full bg-white shadow-lg">
        {renderSidebar()}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
      

        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
          <div className="text-[#16578D] font-bold text-lg">
            {roleName} - {userName}
          </div>
          <div className="flex items-center gap-2 text-[#16578D]">
            <User className="w-6 h-6" />
            <span>{userName}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="py-8 px-6 flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-[#16578d] mb-8">Helpdesk IKK</h1>
            <p className="text-gray-700 mb-6 text-lg">
              Jika Anda mengalami kendala dalam pengisian IKK, silakan isi formulir di bawah ini
              atau hubungi tim helpdesk kami melalui surel{' '}
              <a href="mailto:ikk@lan.go.id" className="text-[#16578d] underline">
                ikk@lan.go.id
              </a>.
            </p>

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
        </main>

      </div>
    </div>
  )
}
