'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'Panduan', href: '/panduan' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Helpdesk', href: '/helpdesk' },
  { label: 'Login', href: '/login' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-bold text-blue-700">Indeks Kualitas Kebijakan</div>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg md:text-xl text-gray-700 hover:text-blue-600 transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Logo di bagian kanan */}
          <div className="flex items-center space-x-4">
            <img src="lanri.png" alt="Lanri" className="h-12 w-auto" />
            <img src="tanoto.png" alt="tanoto" className="h-12 w-auto" />
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} className="text-gray-700 focus:outline-none">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-lg md:text-xl text-gray-700 hover:text-blue-600 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
