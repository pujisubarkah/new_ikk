"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar-admin"
import { withRoleGuard } from '@/lib/withRoleGuard'

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
    router.push("/pengguna")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <></>
      </Sidebar>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Tambah Pengguna</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ROLE */}
          <div className="md:col-span-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="" disabled>Pilih Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* KIRI */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="nip">NIP</Label>
              <Input id="nip" name="nip" value={formData.nip} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="nik">NIK</Label>
              <Input id="nik" name="nik" value={formData.nik} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="instansi">Nama Instansi</Label>
              <select
                id="instansi"
                name="instansi"
                value={formData.instansi}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2"
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
              <Label htmlFor="email">Email Aktif</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          {/* KANAN */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="nama">Nama</Label>
              <Input id="nama" name="nama" value={formData.nama} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="jabatan">Jabatan</Label>
              <Input id="jabatan" name="jabatan" value={formData.jabatan} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="telepon">Nomor Telepon Aktif</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">+62</span>
                <Input
                  id="telepon"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  required
                  className="pl-14"
                  placeholder="Nomor Telepon"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="" disabled>Pilih Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Non Aktif">Non Aktif</option>
              </select>
            </div>
          </div>

          {/* BUTTON */}
          <div className="col-span-1 md:col-span-2 flex justify-between mt-4">
            <Button type="button" onClick={handleBack}>
              Kembali
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Simpan 
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default withRoleGuard(TambahPengguna, [1])

