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
  User,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/ui/dropdown-menu'
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

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/login' // Sesuaikan dengan route login kamu
  }

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
      <div className="flex-1 ml-64 flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md fixed top-0 left-64 w-[calc(100%-16rem)] z-10">
          <div className="text-[#16578D] font-bold text-lg">{roleName}</div>
          <div className="flex items-center space-x-3 text-[#16578D]">
            <User className="w-8 h-8" />
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer">
                <span className="font-medium">{userName}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white text-[#16578D] shadow-md">
                <DropdownMenuItem onClick={() => alert('Edit Profil Clicked')}>
                  Edit Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="py-8 px-6 mt-20">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Sidebar

