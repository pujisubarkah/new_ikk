'use client'

import { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import SidebarAdmin from '@/components/sidebar-admin'
import SidebarKoor from '@/components/sidebar-koor'
import Sidebar from '@/components/sidebar'

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
    if (roleId === 1) {
      return <SidebarAdmin>Default Content</SidebarAdmin>
    }
    if (roleId === 2) {
      return <SidebarKoor>Default Content</SidebarKoor>
    }
    return <Sidebar>Default Content</Sidebar>
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
          <h1 className="text-3xl font-semibold text-[#16578D]">Dashboard</h1>
          {/* Tambahkan konten dashboard lainnya di sini */}
        </main>
      </div>
    </div>
  )
}


