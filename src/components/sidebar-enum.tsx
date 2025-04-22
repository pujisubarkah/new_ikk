import React, { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Users, LifeBuoy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  children: ReactNode // pastikan children ada di sini
}

const sections = [
 
  {
       items: [
      { name: 'Kebijakan', icon: Users, href: '/enum/kebijakan' },
    ],
  },
  {
    label: 'Bantuan',
    items: [
      { name: 'Helpdesk', icon: LifeBuoy, href: '/helpdesk' },
    ],
  },
]

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
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

      {/* Content */}
      <main className="ml-64 flex-1 p-6 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default Sidebar
