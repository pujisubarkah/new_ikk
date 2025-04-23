'use client'

import React, { ReactNode, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  LifeBuoy,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  children: ReactNode
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [roleName, setRoleName] = useState<string>('')
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const savedRole = localStorage.getItem('role') || ''
    const savedName = localStorage.getItem('name') || ''
    setRoleName(savedRole)
    setUserName(savedName)
  }, [])

  const sections = [
    {
      label: '',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin-nasional/dashboard' },
        { name: 'Kebijakan', icon: FileText, href: '/admin-nasional/kebijakan' },
      ],
    },
    {
      label: 'Master Data',
      items: [
        { name: 'Tahun Aktif', icon: Calendar, href: '/tahun-aktif' },
        { name: 'Instansi', icon: Users, href: '/instansi' },
        { name: 'Wilayah Koordinasi', icon: Users, href: '/wilayah-koordinasi' },
        { name: 'Pengguna', icon: Users, href: '/pengguna' },
      ],
    },
    {
      label: 'Bantuan',
      items: [
        { name: 'Helpdesk', icon: LifeBuoy, href: '/helpdesk' },
      ],
    },
  ]

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen fixed top-0 left-0 bg-[#16578D] text-white p-6 shadow-lg">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/lanri.png"
            alt="Logo LAN"
            width={150}
            height={150}
            className="rounded-full"
          />
        </div>

        <nav className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx}>
              {section.label && (
                <div className="uppercase text-xs text-blue-100 tracking-wider mb-2 mt-4">
                  {section.label}
                </div>
              )}
              <div className="space-y-2">
                {section.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-white hover:text-[#16578D] transition-colors'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
          <div className="text-[#16578D] font-bold text-lg">
            {roleName} - {userName}
          </div>
          <div className="flex items-center gap-2 text-[#16578D]">
            <Users className="w-6 h-6" /> {/* Replace `User` with `Users` */}
            <span>{userName}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="py-8 px-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Sidebar
