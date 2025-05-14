"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar-koorins"
import { toast } from "sonner"

interface FormData {
  name: string
  username: string
  work_unit: string
  email: string
  role_id: number
  password: string
  position: string
  phone: string
  status: "Aktif" | "Non Aktif"
}

interface Instansi {
  id: string
  name: string
  category: string
}

const TambahPengguna: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    work_unit: "",
    email: "",
    role_id: 5,
    password: "",
    position: "",
    phone: "",
    status: "Aktif",
  })

  const [instansis, setInstansis] = useState<Instansi[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchAgencyIdAndInstansi = async () => {
      try {
        const koorInstansiId = localStorage.getItem("id") // Mengambil koorInstansiId dari localStorage

        if (!koorInstansiId) {
          toast.warning("ID koordinator instansi tidak ditemukan")
          return
        }

        // Menambahkan koorInstansiId ke dalam formData secara otomatis
        setFormData((prev) => ({ ...prev, koorInstansiId })) // Update koorInstansiId ke dalam form data

        const response = await axios.get(`/api/koorinstansi/info?koor_instansi_id=${koorInstansiId}`)
        const agencyId = response.data.agency_id?.agency_id_panrb

        if (agencyId) {
          setFormData((prev) => ({ ...prev, instansi: agencyId }))

          const instansiDetail = await axios.get(`/api/instansi/${agencyId}`)
          setInstansis([instansiDetail.data])
        }
      } catch (err) {
        toast.error("Gagal memuat data instansi")
        console.error("Gagal memuat data instansi", err)
      }
    }

    fetchAgencyIdAndInstansi()
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
    
    const loadingToast = toast.loading("Sedang menambahkan pengguna...")
    
    try {
      await axios.post("/api/analis_instansi/create", formData)
      toast.dismiss(loadingToast)
      toast.success("Pengguna berhasil ditambahkan!")
      router.push("/koordinator-instansi/enumerator")
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Gagal menambahkan pengguna")
      console.error("Gagal menambahkan pengguna:", error)
    }
  }

  const handleBack = () => {
    router.push("/koordinator-instansi/enumerator")
  }

  return (
    <Sidebar>
      <div className="w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-semibold text-gray-800">Tambah Analis Instansi</h1>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="username">NIP</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="nik">Unit Kerja</Label>
              <Input id="Work_unit" name="work_unit" value={formData.work_unit} onChange={handleChange} required />
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

          {/* Right Section */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="position">Jabatan</Label>
              <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Nomor Telepon Aktif</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">+62</span>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
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
                <option value="Aktif">Aktif</option>
                <option value="Non Aktif">Non Aktif</option>
              </select>
            </div>
          </div>

          {/* Role Dropdown */}
          <div className="grid gap-4 md:col-span-2">
            <div>
              <Label htmlFor="role">Role (Terkunci)</Label>
              <select
                id="role"
                name="role"
                value={formData.role_id}
                disabled
                className="w-full max-w-xs border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700"
              >
                <option value={5}>Analis Instansi</option>
              </select>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="col-span-1 md:col-span-2 flex justify-between mt-4">
            <Button type="button" onClick={handleBack}>
              Kembali
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </Sidebar>
  )
}

export default TambahPengguna
