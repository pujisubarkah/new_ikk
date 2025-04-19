"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar"

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

const TambahEnumerator: React.FC = () => {
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

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Data:", formData)
    // Kirim data ke backend di sini kalau sudah siap
  }

  const handleBack = () => {
    router.push("/enumerator")
  }

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <Sidebar>
        {/* Add any valid children content here */}
        <></>
      </Sidebar>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Tambah Enumerator</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Input id="instansi" name="instansi" value={formData.instansi} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email Aktif</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" value={formData.role} onChange={handleChange} required />
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
              <Input id="telepon" name="telepon" value={formData.telepon} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" value={formData.status} onChange={handleChange} required />
            </div>
          </div>

          {/* TOMBOL SUBMIT & KEMBALI */}
          <div className="col-span-1 md:col-span-2 flex justify-between mt-4">
            <Button type="button" onClick={handleBack}>
              Kembali
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Simpan Enumerator
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default TambahEnumerator
