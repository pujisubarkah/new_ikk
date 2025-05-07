"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar-koor"

interface FormData {
  nama: string
  nip: string
  nik: string
  instansi: string
  email: string
  role: string
  password: string
  jabatan: string
  telepon: string
  status: string
}

interface Role {
  id: string
  name: string
}

interface Instansi {
  id: string
  name: string
  category: string
}

const TambahPengguna: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    nip: "",
    nik: "",
    instansi: "",
    email: "",
    role: "",
    password: "",
    jabatan: "",
    telepon: "",
    status: "",
  })

  const [roles, setRoles] = useState<Role[]>([])
  const [instansis, setInstansis] = useState<Instansi[]>([])

  const router = useRouter()

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/role")
        const data = await res.json()
        setRoles(data)
      } catch (err) {
        console.error("Failed to fetch roles", err)
      }
    }

    const fetchInstansi = async () => {
      try {
        const res = await fetch("/api/instansi")
        const data = await res.json()
        setInstansis(data)
      } catch (err) {
        console.error("Failed to fetch instansi", err)
      }
    }

    fetchRoles()
    fetchInstansi()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Data:", formData)
    // TODO: Kirim data ke backend
    // Example: const res = await fetch("/api/user", { method: "POST", body: JSON.stringify(formData) })
  }

  const handleBack = () => {
    router.push("/koordinator-utama/pengguna")
  }

  return (
      <Sidebar>
    <div className="w-full px-8 py-10 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tambah Koordinator Instansi</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ROLE */}
        <div className="md:col-span-2">
        <Label htmlFor="role" className="block mb-2 font-medium">Role</Label>
        <Input
          id="role"
          name="role"
          value={roles.find((role) => role.id === '4')?.name || ""}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 focus:outline-none"
        />
        </div>

        {/* KIRI */}
        <div className="grid gap-6">
        <div>
          <Label htmlFor="nip" className="block mb-2 font-medium">NIP</Label>
          <Input id="nip" name="nip" value={formData.nip} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <Label htmlFor="nik" className="block mb-2 font-medium">NIK</Label>
          <Input id="nik" name="nik" value={formData.nik} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <Label htmlFor="instansi" className="block mb-2 font-medium">Nama Instansi</Label>
          <select
            id="instansi"
            name="instansi"
            value={formData.instansi}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Pilih Instansi</option>
            {instansis.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="email" className="block mb-2 font-medium">Email Aktif</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <Label htmlFor="password" className="block mb-2 font-medium">Password</Label>
          <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        </div>

        {/* KANAN */}
        <div className="grid gap-6">
        <div>
          <Label htmlFor="nama" className="block mb-2 font-medium">Nama</Label>
          <Input id="nama" name="nama" value={formData.nama} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <Label htmlFor="jabatan" className="block mb-2 font-medium">Jabatan</Label>
          <Input id="jabatan" name="jabatan" value={formData.jabatan} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <Label htmlFor="telepon" className="block mb-2 font-medium">Nomor Telepon Aktif</Label>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500">+62</span>
            <Input
              id="telepon"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nomor Telepon"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="status" className="block mb-2 font-medium">Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Pilih Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Non Aktif">Non Aktif</option>
          </select>
        </div>
        </div>

        {/* BUTTON */}
        <div className="col-span-1 md:col-span-2 flex justify-between mt-6">
        <Button type="button" onClick={handleBack} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">
          Kembali
        </Button>
        <Button type="submit" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md">
          Simpan
        </Button>
        </div>
      </form>
    </div>
      </Sidebar>
  )
}

export default TambahPengguna
