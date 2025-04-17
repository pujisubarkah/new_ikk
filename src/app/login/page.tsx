'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementasikan logika login di sini
    console.log('Login attempt with:', email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-md w-full bg-white shadow-xl p-8 rounded-2xl border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="youremail@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
          
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <Link href="/forgot-password" className="hover:text-blue-600">Forgot Password?</Link>
            <Link href="/register" className="hover:text-blue-600">Don't have an account? Register</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
