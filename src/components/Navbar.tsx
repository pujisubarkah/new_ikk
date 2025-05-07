'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'Panduan', href: '/panduan' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Helpdesk', href: '/desk' },
  { label: 'Login', href: '/login' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-semibold text-[#16578d] tracking-wide">
            Indeks Kualitas Kebijakan
          </div>

          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base text-gray-700 hover:text-[#16578d] font-medium transition duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <img src="/lanri_.png" alt="LAN RI" className="h-10 w-auto object-contain" />
            <img src="/tanoto.png" alt="Tanoto Foundation" className="h-10 w-auto object-contain" />
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} className="text-[#16578d] focus:outline-none">
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 bg-white border-t border-gray-100">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-base text-gray-700 hover:text-[#16578d] font-medium transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
