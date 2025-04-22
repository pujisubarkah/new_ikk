'use client'

import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown-menu'

// Assuming you have a function to get user data from your backend or context
const fetchUserData = async () => {
  try {
    const response = await fetch('/api/user')  // Replace with your API endpoint
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    return null
  }
}

const HeaderProfile: React.FC = () => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData()
      if (userData) {
        setUser(userData)  // Update state with user data after fetching
      }
    }
    
    getUserData()
  }, [])

  const handleLogout = () => {
    console.log('User logged out!')
    // Implement actual logout logic, such as clearing user data or redirecting
  }

  if (!user) {
    return <div>Loading...</div> // Display loading state while user data is being fetched
  }

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* Kiri: Role */}
      <div className="font-bold text-lg text-[#16578D]">
        {user.role}
      </div>

      {/* Kanan: Ikon Avatar dan Username */}
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-3 cursor-pointer">
            {/* Ikon Avatar */}
            <User className="w-10 h-10 text-[#16578D]" />
            <span>{user.name}</span>
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
