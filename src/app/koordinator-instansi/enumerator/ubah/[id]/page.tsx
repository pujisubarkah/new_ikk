"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from 'next/navigation'
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar-koorins"
import { toast } from "sonner"

interface FormData {
  name: string
  username: string
  work_unit?: string
  instansi: string
  email: string
  role_id: number
  password?: string
  position: string
  phone: string
  status: "aktif" | "Nonaktif"
}

interface Instansi {
  id: string
  name: string
  category: string
}

const EditPengguna: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    work_unit: "",
    instansi: "",
    email: "",
    role_id: 5,
    password: "",
    position: "",
    phone: "",
    status: "aktif",
  })

  const [instansis, setInstansis] = useState<Instansi[]>([])
  const [koorInstansiId, setKoorInstansiId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAgencyIdAndInstansi = async () => {
      try {
        setIsLoading(true)
        const idFromStorage = localStorage.getItem("id")
        
        if (!idFromStorage) {
          toast.warning("ID koordinator instansi tidak ditemukan")
          setIsLoading(false)
          return
        }

        setKoorInstansiId(idFromStorage)
        console.log("Koordinator ID from storage:", idFromStorage)

        const response = await axios.get(`/api/koorinstansi/info?koor_instansi_id=${idFromStorage}`)
        const agencyId = response.data.agency_id?.agency_id_panrb

        if (agencyId) {
          setFormData(prev => ({ ...prev, instansi: agencyId }))

          const instansiDetail = await axios.get(`/api/instansi/${agencyId}/instansi`)
          
          setInstansis([{
            id: agencyId,
            name: instansiDetail.data.agency_name,
            category: "",
          }])
        }
      } catch (error) {
        console.error("Error fetching agency data:", error)
        toast.error("Gagal memuat data instansi")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchUserData = async () => {
          if (!id) return
    
          try {
            const response = await axios.get(`/api/users/${id}`)
            const userData = response.data
    
            setFormData({
              name: userData.name || '',
              username: userData.username || '',
              instansi: userData.agency_id_panrb?.toString() || '',
              email: userData?.email || '',
              password: '',
              position: userData.position || '',
              work_unit: userData.work_unit || '',
              phone: userData.phone || '',
              status: userData.status || '',
              role_id: formData.role_id, // Include the role_id property
            })
          } catch (error: unknown) {
            console.error("Error fetching user data:", error)
          }
        }

    fetchAgencyIdAndInstansi()
    fetchUserData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!koorInstansiId) {
      toast.error("ID Koordinator belum dimuat, silakan refresh halaman")
      return
    }

    const loadingToast = toast.loading("Sedang mengupdate pengguna...")

    try {
      const payload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        position: formData.position,
        phone: formData.phone,
        work_unit: formData.work_unit,
        password: formData.password || undefined,
      }

      console.log("Submitting payload:", payload)

      const response = await axios.put(`/api/users/${id}`, payload)
      console.log("Response from API:", response.data)
      
      toast.dismiss(loadingToast)
      toast.success('Data pengguna berhasil diperbarui')
      router.push("/koordinator-instansi/enumerator")
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error("Error submitting form:", error)
      
      if (axios.isAxiosError(error)) {
        console.error("API error details:", error.response?.data)
        toast.error(`Gagal menambahkan pengguna: ${error.response?.data?.error || error.message}`)
      } else {
        toast.error("Gagal menambahkan pengguna")
      }
    }
  }

  const handleBack = () => {
    router.push("/koordinator-instansi/enumerator")
  }

  if (isLoading) {
    return (
      <Sidebar>
        <div className="w-full px-6 py-8 bg-white shadow-md rounded-lg">
          <p>Memuat data...</p>
        </div>
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <div className="w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-semibold text-gray-800">Edit Analis Instansi</h1>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="username">NIP</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="work_unit">Unit Kerja</Label>
              <Input id="work_unit" name="work_unit" value={formData.work_unit} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="instansi">Nama Instansi</Label>
              <Input
                id="instansi"
                name="instansi"
                value={instansis[0]?.name || "Memuat instansi..."}
                disabled
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Aktif</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Kosongkan untuk password default (12345678)"
              />
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
              <Input
                id="status"
                name="status"
                value="Aktif"
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700"
              />
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

export default EditPengguna
