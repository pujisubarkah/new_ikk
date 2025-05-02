"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

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
  suratPenunjukkan: string
}

interface Instansi {
  id: string
  name: string
  category: string
}

const TambahPengguna: React.FC = () => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    nip: "",
    nik: "",
    instansi: "",
    email: "",
    role: "Admin Instansi",
    password: "",
    jabatan: "",
    telepon: "",
    status: "Aktif",
    suratPenunjukkan: ""
  })

  const [instansis, setInstansis] = useState<Instansi[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  // Daftar field yang wajib diisi
  const mandatoryFields = [
    'nama', 'nip', 'nik', 'instansi', 'email', 
    'password', 'jabatan', 'telepon', 'suratPenunjukkan'
  ]

  useEffect(() => {
    const fetchInstansi = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/instansi")
        if (!res.ok) {
          throw new Error("Failed to fetch instansi")
        }
        const data = await res.json()
        setInstansis(data)
      } catch (err) {
        console.error("Failed to fetch instansi", err)
        setError("Gagal memuat data instansi")
      } finally {
        setIsLoading(false)
      }
    }
    fetchInstansi()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear error ketika user mulai mengisi
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    // Validasi field wajib
    mandatoryFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = "Field ini wajib diisi"
        isValid = false
      }
    })

    // Validasi format khusus
    if (formData.nip && !/^\d+$/.test(formData.nip)) {
      newErrors.nip = "NIP harus berupa angka"
      isValid = false
    }

    if (formData.nik && !/^\d+$/.test(formData.nik)) {
      newErrors.nik = "NIK harus berupa angka"
      isValid = false
    }

    if (formData.telepon && !/^\d+$/.test(formData.telepon)) {
      newErrors.telepon = "Nomor telepon harus berupa angka"
      isValid = false
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter"
      isValid = false
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid"
      isValid = false
    }

    if (formData.suratPenunjukkan && !formData.suratPenunjukkan.includes("drive.google.com")) {
      newErrors.suratPenunjukkan = "Harus berupa link Google Drive yang valid"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Error Validasi",
        description: "Harap perbaiki field yang ditandai",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      console.log("Form Data:", formData)
      // TODO: kirim ke API
      // const res = await fetch("/api/user", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData)
      // })
      // if (!res.ok) throw new Error(await res.text())

      toast({
        title: "Registrasi Berhasil",
        description: "Admin akan segera memverifikasi data anda.",
      })

      // router.push("/halaman-berikutnya") // kalau mau redirect
    } catch (err) {
      console.error("Failed to submit form", err)
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui"
      toast({
        description: (
          <div>
            <strong>Gagal menyimpan data</strong>
            <p>{errorMessage}</p>
          </div>
        ),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Registrasi Koordinator Instansi</h1>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ROLE */}
            <div className="md:col-span-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value="Admin Instansi"
                readOnly
                className="w-full bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* KIRI */}
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nip">NIP*</Label>
                <Input 
                  id="nip" 
                  name="nip" 
                  value={formData.nip} 
                  onChange={handleChange} 
                  required
                  className={errors.nip ? "border-red-500" : ""}
                />
                {errors.nip && <p className="text-red-500 text-sm mt-1">{errors.nip}</p>}
              </div>
              <div>
                <Label htmlFor="nik">NIK*</Label>
                <Input 
                  id="nik" 
                  name="nik" 
                  value={formData.nik} 
                  onChange={handleChange} 
                  required
                  className={errors.nik ? "border-red-500" : ""}
                />
                {errors.nik && <p className="text-red-500 text-sm mt-1">{errors.nik}</p>}
              </div>
              <div>
                <Label htmlFor="instansi">Nama Instansi*</Label>
                <select
                  id="instansi"
                  name="instansi"
                  value={formData.instansi}
                  onChange={handleChange}
                  required
                  disabled={isLoading || instansis.length === 0}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.instansi ? "border-red-500" : "border-input"}`}
                >
                  <option value="">{isLoading ? "Memuat..." : instansis.length === 0 ? "Tidak ada instansi" : "Pilih Instansi"}</option>
                  {instansis.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.instansi && <p className="text-red-500 text-sm mt-1">{errors.instansi}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email Aktif*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>

            {/* KANAN */}
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nama">Nama*</Label>
                <Input 
                  id="nama" 
                  name="nama" 
                  value={formData.nama} 
                  onChange={handleChange} 
                  required
                  className={errors.nama ? "border-red-500" : ""}
                />
                {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
              </div>
              <div>
                <Label htmlFor="jabatan">Jabatan*</Label>
                <Input 
                  id="jabatan" 
                  name="jabatan" 
                  value={formData.jabatan} 
                  onChange={handleChange} 
                  required
                  className={errors.jabatan ? "border-red-500" : ""}
                />
                {errors.jabatan && <p className="text-red-500 text-sm mt-1">{errors.jabatan}</p>}
              </div>
              <div>
                <Label htmlFor="telepon">Nomor Telepon Aktif*</Label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background h-10">
                    +62
                  </span>
                  <Input
                    id="telepon"
                    name="telepon"
                    type="tel"
                    value={formData.telepon}
                    onChange={handleChange}
                    required
                    className={`flex-1 ${errors.telepon ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.telepon && <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>}
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  name="status"
                  value="Aktif"
                  readOnly
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            {/* SURAT PENUNJUKKAN */}
            <div className="md:col-span-2">
              <Label htmlFor="suratPenunjukkan">
                Link Google Drive Surat Penunjukkan*
                <span className="text-xs text-gray-500 ml-2">(Pastikan file dapat diakses oleh semua)</span>
              </Label>
              <Input
                id="suratPenunjukkan"
                name="suratPenunjukkan"
                value={formData.suratPenunjukkan}
                onChange={handleChange}
                required
                placeholder="https://drive.google.com/..."
                className={errors.suratPenunjukkan ? "border-red-500" : ""}
              />
              {errors.suratPenunjukkan && (
                <p className="text-red-500 text-sm mt-1">{errors.suratPenunjukkan}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Cara membuat link shareable: Buka file di Google Drive → Klik "Bagikan" → Pilih "Siapa saja dengan link" → Salin link
              </p>
            </div>

            {/* BUTTONS */}
            <div className="md:col-span-2 flex justify-between">
              <Button type="button" variant="secondary" onClick={handleBack}>
                Kembali
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Pengguna"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TambahPengguna