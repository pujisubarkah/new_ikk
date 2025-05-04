"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import Sidebar from "@/components/sidebar-admin"
import { withRoleGuard } from '@/lib/withRoleGuard'
import axios from "axios"
import { toast } from "sonner"

interface FormData {
  name: string // Changed from 'nama' to match DB
  username: string // Changed from 'nip' to match DB (using NIP as username)
  nik: string
  instansi: string
  email: string
  role: string
  password: string
  position: string // Changed from 'jabatan' to match DB
  phone: string // Changed from 'telepon' to match DB
  status: string
  active_year: string // Added for active year selection
}

interface Role {
  id: string
  name: string
}

interface Instansi {
  instansi: {
    agency_id: string
    agency_name: string
  } | null
  id: string
  name: string
  category: string
}

interface ActiveYear {
  id: string
  active_year: string
}

const TambahPengguna: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    nik: "",
    instansi: "",
    email: "",
    role: "",
    password: "",
    position: "",
    phone: "",
    active_year: "",
    status: "active", // Changed to match DB values
  })

  const [roles, setRoles] = useState<Role[]>([])
  const [instansis, setInstansis] = useState<Instansi[]>([])
  const [activeyears, setActiveyears] = useState<ActiveYear[]>([])
  const [usernameValid, setUsernameValid] = useState(true) // Changed from nipValid
  const [emailValid, setEmailValid] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, instansisRes, activeyearRes] = await Promise.all([
          axios.get("/api/role"),
          axios.get("/api/instansi"),
          axios.get("/api/active_year"),
        ])
        setRoles(rolesRes.data)
        setInstansis(instansisRes.data)
        setActiveyears(activeyearRes.data)
      } catch (err) {
        console.error("Failed to fetch data", err)
        toast.error("Gagal memuat data")
      }
    }

    fetchData()
  }, [])

  const checkUsernameAvailability = async (username: string) => {
    try {
      const res = await axios.get("/api/users/check-nip", { params: { username } })
      const available = !res.data.exists
      setUsernameValid(available)
      if (!available) toast.error("Username/NIP sudah digunakan")
    } catch (error) {
      console.error("Gagal cek Username:", error)
      setUsernameValid(false)
      toast.error("Gagal memeriksa Username")
    }
  }

  const checkEmailAvailability = async (email: string) => {
    try {
      if (!email.includes('@') || !email.includes('.')) {
        setEmailValid(false)
        return
      }

      const res = await axios.get("/api/users/check-email", { params: { email } })
      const available = !res.data.exists
      setEmailValid(available)
      if (!available) toast.error("Email sudah digunakan")
    } catch (error) {
      console.error("Gagal cek Email:", error)
      setEmailValid(false)
      toast.error("Gagal memeriksa email")
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formData.username.length >= 8) {
        checkUsernameAvailability(formData.username)
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [formData.username])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formData.email.includes('@') && formData.email.includes('.')) {
        checkEmailAvailability(formData.email)
      }
    }, 800)

    return () => clearTimeout(timeout)
  }, [formData.email])

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      toast.error("Password harus minimal 8 karakter")
      return false
    }
    return true
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{8,13}$/
    if (!phoneRegex.test(phone)) {
      toast.error("Nomor telepon harus 8-13 digit angka")
      return false
    }
    return true
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Revalidate before submit
    if (formData.username.length >= 8) await checkUsernameAvailability(formData.username)
    if (formData.email) await checkEmailAvailability(formData.email)

    if (!usernameValid) {
      toast.error("Username/NIP sudah digunakan, silakan gunakan yang lain")
      return
    }

    if (!emailValid) {
      toast.error("Email sudah digunakan atau tidak valid")
      return
    }

    if (!validatePassword(formData.password)) return
    if (!validatePhone(formData.phone)) return

    setIsSubmitting(true)

    try {
      const formattedData = {
        name: formData.name,
        username: formData.username, // NIP will be used as username
        email: formData.email,
        password: formData.password,
        position: formData.position, // jabatan -> position
        phone: formData.phone.startsWith('+62') ? formData.phone : `+62${formData.phone}`,
        status: formData.status.toLowerCase(), // Aktif -> active
        nik: formData.nik,
        agency_id_panrb: formData.instansi,
        active_year: formData.active_year,
        role_id: formData.role
      }

      const response = await axios.post("/api/users", formattedData)

      if (response.status === 201) {
        toast.success("Data pengguna berhasil ditambahkan")
        setTimeout(() => {
          router.push("/pengguna")
        }, 1500)
      }
    } catch (error: unknown) {
      console.error("Failed to submit form", error)
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Terjadi kesalahan saat menyimpan data")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push("/pengguna")
  }

  return (
      <Sidebar>
      <div className="w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-semibold text-gray-800">Tambah Pengguna</h1>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ACTIVE YEAR */}
        <div className="md:col-span-2">
        <Label htmlFor="role" className="text-gray-700 font-medium">Tahun Penilaian</Label>
        <select
            id="active_year"
            name="active_year"
            value={formData.active_year || "2025"}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
            >
            <option value="" disabled>Pilih Tahun Penilaian</option>
            {activeyears
              .sort((a, b) => a.active_year.localeCompare(b.active_year))
              .map((active_year) => (
              <option key={active_year.id} value={active_year.active_year}>
              {active_year.active_year}
              </option>
              ))}
            </select>
          </div>
          {/* ROLE */}
          <div className="md:col-span-2">
        <Label htmlFor="role" className="text-gray-700 font-medium">Role</Label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
        >
            <option value="" disabled>Pilih Role</option>
            {roles
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((role) => (
              <option key={role.id} value={role.id}>
              {role.name}
              </option>
            ))}
        </select>
          </div>

          {/* LEFT COLUMN */}
          <div className="grid gap-4">
        <div>
          <Label htmlFor="username" className="text-gray-700 font-medium">NIP (Username)</Label>
          <Input 
            id="username" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
            className="border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
          />
          {!usernameValid && (
            <p className="text-sm text-red-500 mt-1">NIP sudah digunakan</p>
          )}
        </div>
        <div>
          <Label htmlFor="nik" className="text-gray-700 font-medium">NIK</Label>
          <Input 
            id="nik" 
            name="nik" 
            value={formData.nik} 
            onChange={handleChange} 
            required 
            className="border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
          />
        </div>
        <div>
          <Label htmlFor="instansi" className="text-gray-700 font-medium">Nama Instansi</Label>
          <select
            id="instansi"
            name="instansi"
            value={formData.instansi}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
          >
            <option value="" disabled>Pilih Instansi</option>
                 {instansis
                 .filter((item, index, self) => 
                   index === self.findIndex((t) => t.instansi?.agency_id === item.instansi?.agency_id)
                 )
                 .sort((a, b) => {
                   const idA = a.instansi?.agency_id || '';
                   const idB = b.instansi?.agency_id || '';
                   return idA.localeCompare(idB);
                 })
                 .map((item) => (
                   <option key={item.id} value={item.instansi?.agency_id || ''}>
                   {item.instansi?.agency_name || "NA"}
                   </option>
                 ))}
          </select>
        </div>
        <div>
          <Label htmlFor="email" className="text-gray-700 font-medium">Email Aktif</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
          />
          {!emailValid && (
            <p className="text-sm text-red-500 mt-1">
          {formData.email.includes('@') ? "Email sudah digunakan" : "Format email tidak valid"}
            </p>
          )}
        </div>
        <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimal 8 karakter"
                      />
                      <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                      </div>
                    </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="grid gap-4">
        <div>
          <Label htmlFor="name" className="text-gray-700 font-medium">Nama</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
          />
        </div>
        <div>
          <Label htmlFor="position" className="text-gray-700 font-medium">Jabatan</Label>
          <Input 
            id="position" 
            name="position" 
            value={formData.position} 
            onChange={handleChange} 
            required 
            className="border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-gray-700 font-medium">Nomor Telepon Aktif</Label>
          <div className="relative">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">+62</span>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
                placeholder="8123456789"
                pattern="[0-9]*"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Contoh: 8123456789</p>
        </div>
        <div>
          <Label htmlFor="status" className="text-gray-700 font-medium">Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Non Aktif</option>
          </select>
        </div>
          </div>

          {/* BUTTONS */}
          <div className="col-span-1 md:col-span-2 flex justify-between mt-6">
        <Button 
          type="button" 
          onClick={handleBack} 
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
        >
          Kembali
        </Button>
        <Button 
          type="submit" 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
          disabled={isSubmitting || !usernameValid || !emailValid}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
          </div>
        </form>
      </div>
      </Sidebar>
  )
}

const ProtectedPage = withRoleGuard(TambahPengguna, [1])
export default function Page() {
  return <ProtectedPage />
}
