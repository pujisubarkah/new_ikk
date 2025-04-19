'use client'

import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown-menu'

interface UserProfile {
  name: string
  role: string
}

const HeaderProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    // Simulasi data user yang login
    setUser({
      name: 'John Doe',
      role: 'Administrator',
    })
  }, [])

  // Fungsi untuk logout (dapat diganti dengan logika sebenarnya)
  const handleLogout = () => {
    console.log('User logged out!')
  }

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* Kiri: Role */}
      <div className="font-bold text-lg text-[#16578D]">
        {user?.role}
      </div>

      {/* Kanan: Ikon Avatar dan Username */}
      <div className="flex items-center space-x-3">
        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-3 cursor-pointer">
            {/* Ikon Avatar */}
            <User className="w-10 h-10 text-[#16578D]" />
            <span>{user?.name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white text-[#16578D] shadow-md">
            <DropdownMenuItem onClick={() => alert('Ubah Sandi Clicked')}>Ubah Sandi</DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert('Ubah No Telepon Clicked')}>Ubah No Telepon</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default HeaderProfile
