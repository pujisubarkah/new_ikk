'use client'

import { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import SidebarAdmin from '@/components/sidebar-admin'
import SidebarKoor from '@/components/sidebar-koor'
import Sidebar from '@/components/sidebar'
import SidebarInst from '@/components/sidebar-inst'
import SidebarEnum from '@/components/sidebar-enum'

export default function Dashboard() {
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
        return <SidebarAdmin>Default Content</SidebarAdmin>
      case 2:
        return <SidebarKoor>Default Content</SidebarKoor>
      case 3:
        return <SidebarInst>Default Content</SidebarInst>
      case 5:
        return <SidebarEnum>Default Content</SidebarEnum>
      case 4: // bisa jadi default juga
      default:
        return <Sidebar>Default Content</Sidebar>
    }
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64">
        {renderSidebar()}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
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
        <main className="py-8 px-6">
            <section className="text-center bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-[#16578D] mb-4">
              Selamat Datang di Dashboard Penilaian Kualitas Kebijakan
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              Lembaga Administrasi Negara telah mengembangkan <span className="font-semibold">Indeks Kualitas Kebijakan</span> sebagai instrumen untuk menilai kualitas kebijakan pada Instansi Pemerintah. Kami sangat menghargai partisipasi Bapak/Ibu dalam memberikan penilaian yang objektif dan konstruktif untuk meningkatkan kualitas kebijakan di Indonesia.
            </p>
            </section>

            <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-[#16578D] mb-2">Panduan Penilaian</h2>
              <p className="text-gray-600 text-sm">
              Pelajari langkah-langkah untuk memberikan penilaian yang efektif dan sesuai dengan pedoman yang telah ditetapkan.
              </p>
              <button className="mt-4 px-4 py-2 bg-[#16578D] text-white rounded hover:bg-[#134a75]">
              Lihat Panduan
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-[#16578D] mb-2">Laporan Penilaian</h2>
              <p className="text-gray-600 text-sm">
              Akses laporan hasil penilaian yang telah dilakukan untuk melihat perkembangan kualitas kebijakan.
              </p>
              <button className="mt-4 px-4 py-2 bg-[#16578D] text-white rounded hover:bg-[#134a75]">
              Lihat Laporan
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-[#16578D] mb-2">Hubungi Kami</h2>
              <p className="text-gray-600 text-sm">
              Jika Anda memiliki pertanyaan atau membutuhkan bantuan, jangan ragu untuk menghubungi tim kami.
              </p>
              <button className="mt-4 px-4 py-2 bg-[#16578D] text-white rounded hover:bg-[#134a75]">
              Kontak Kami
              </button>
            </div>
            </section>
        </main>
      </div>
    </div>
  )
}


