'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Sidebar from '@/components/sidebar-admin'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { toast } from 'sonner'

interface FormData {
  name: string
  nip: string
  nik: string
  instansi: string
  email: string
  role: string
  password: string
  jabatan: string
  unitKerja: string
  telepon: string
  status: string
  active_year: number
}

interface Role {
  id: string
  name: string
}

interface Agency {
  instansi?: {
    agency_id: string
    agency_name: string
  }
  id: string
  name: string
  category: string
}

interface ActiveYear {
  id: string
  active_year: number
}

function EditUserPage(): React.ReactNode {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [formData, setFormData] = useState<FormData>({
    name: '',
    nip: '',
    nik: '',
    instansi: '',
    email: '',
    role: '',
    password: '',
    jabatan: '',
    unitKerja: '',
    telepon: '',
    status: '',
    active_year: 0,
  })

  const [roles, setRoles] = useState<Role[]>([])
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [activeyears, setActiveyears] = useState<ActiveYear[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Validasi Email
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Validasi Form
  const validateForm = (): boolean => {
    const requiredFields: (keyof FormData)[] = [
      'name', 'nip', 'nik', 'instansi', 'email', 'jabatan'
    ]
    const errors: string[] = []

    requiredFields.forEach((field) => {
      if (
        (typeof formData[field] === 'string' && !formData[field]) ||
        (typeof formData[field] === 'number' && formData[field] === 0)
      ) {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} wajib diisi`)
      }
    })

    if (!validateEmail(formData.email)) {
      errors.push('Format email tidak valid')
    }

    if (errors.length > 0) {
      toast.error(errors.join(', '))
      return false
    }

    return true
  }

  // Fetch Data Awal
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [rolesRes, agenciesRes, activeyearRes] = await Promise.all([
          axios.get('/api/role'),
          axios.get('/api/instansi'),
          axios.get('/api/active_year'),
        ])

        setRoles(rolesRes.data)
        setAgencies(agenciesRes.data)
        setActiveyears(
          activeyearRes.data.map((item: ActiveYear) => ({
            ...item,
            active_year: Number(item.active_year),
          }))
        )
      } catch (err: unknown) {
        console.error('Gagal memuat data awal:', err)
        setError('Gagal memuat data roles atau instansi')
      }
    }

    const fetchUserData = async () => {
      if (!id) return

      try {
        const response = await axios.get(`/api/users/${id}`)
        const userData = response.data

        setFormData({
          name: userData.name || '',
          nip: userData.username || '',
          nik: userData.nik || '',
          instansi: userData.agency_id_panrb?.toString() || '',
          email: userData?.email || '',
          role: userData.role_user?.role_id?.toString() || '',
          password: '',
          jabatan: userData.position || '',
          unitKerja: userData.work_unit || '',
          telepon: userData.telepon || '',
          status: userData.status || '',
          active_year: Number(userData.active_year) || 0,
        })
      } catch (err: unknown) {
        console.error('Gagal memuat detail pengguna:', err)
        setError('Gagal memuat detail pengguna')
      }
    }

    fetchInitialData()
    fetchUserData()
  }, [id])

  // Handle Perubahan Input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'active_year' ? Number(value) : value,
    }))
  }

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    const updateToast = toast.loading('Sedang memperbarui data...')

    try {
      const cleanedPhone = formData.telepon.replace(/^0+/, '')
      const phoneWithPrefix = cleanedPhone.startsWith('+62') ? cleanedPhone : `+62${cleanedPhone}`

      const payload = {
        name: formData.name,
        username: formData.nip,
        nik: formData.nik,
        agency_id_panrb: Number(formData.instansi),
        email: formData.email,
        role_id: Number(formData.role),
        position: formData.jabatan,
        work_unit: formData.unitKerja,
        telepon: phoneWithPrefix,
        status: formData.status,
        active_year: Number(formData.active_year),
      }

      console.log('Payload dikirim:', payload)

      await axios.put(`/api/users/${id}`, payload)
      toast.success('Data pengguna berhasil diperbarui', { id: updateToast })

      setTimeout(() => {
        router.push('/pengguna')
      }, 1500)
    } catch (error: unknown) {
      toast.dismiss(updateToast)
      console.error('API Error:', error)

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (axios.isAxiosError(error) && error.request) {
        toast.error('Server tidak merespons. Periksa koneksi Anda.')
      } else {
        toast.error('Terjadi kesalahan saat mengirim permintaan.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Loading State
  if (loading) {
    return (
      <Sidebar>
        <div className="w-full px-6 py-8">
          <p>Loading...</p>
        </div>
      </Sidebar>
    )
  }

  // Error State
  if (error) {
    return (
      <Sidebar>
        <div className="w-full px-6 py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <div className="w-full px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Edit Pengguna</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TAHUN PENILAIAN */}
          <div className="md:col-span-2">
            <Label htmlFor="active_year" className="text-gray-700 font-medium">
              Tahun Penilaian
            </Label>
            <select
              id="active_year"
              name="active_year"
              value={formData.active_year}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
            >
              <option value={0} disabled>
                Pilih Tahun Penilaian
              </option>
              {activeyears
                .sort((a, b) => a.active_year - b.active_year)
                .map((item) => (
                  <option key={item.id} value={item.active_year}>
                    {item.active_year}
                  </option>
                ))}
            </select>
          </div>

          {/* ROLE */}
          <div className="md:col-span-2">
            <Label htmlFor="role" className="text-gray-700 font-medium">
              Role
            </Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
            >
              <option value="" disabled>
                Pilih Role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* INSTANSI */}
          <div className="md:col-span-2">
            <Label htmlFor="instansi" className="text-gray-700 font-medium">
              Instansi
            </Label>
            <select
              id="instansi"
              name="instansi"
              value={formData.instansi}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
            >
              <option value="" disabled>
                Pilih Instansi
              </option>
              {agencies.map((agency) => {
                const agencyId = agency.instansi?.agency_id ?? agency.id
                return (
                  <option key={agency.id} value={agencyId}>
                    {agency.instansi?.agency_name ?? agency.name}
                  </option>
                )
              })}
            </select>
          </div>

          {/* NAME */}
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Nama
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama"
              required
            />
          </div>

          {/* NIP */}
          <div>
            <Label htmlFor="nip" className="text-gray-700 font-medium">
              NIP
            </Label>
            <Input
              type="text"
              id="nip"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              placeholder="Masukkan NIP"
              required
            />
          </div>

          {/* NIK */}
          <div>
            <Label htmlFor="nik" className="text-gray-700 font-medium">
              NIK
            </Label>
            <Input
              type="text"
              id="nik"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              placeholder="Masukkan NIK"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password (kosongkan jika tidak diubah)
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* JABATAN */}
          <div>
            <Label htmlFor="jabatan" className="text-gray-700 font-medium">
              Jabatan
            </Label>
            <Input
              type="text"
              id="jabatan"
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              placeholder="Masukkan jabatan"
              required
            />
          </div>

          {/* UNIT KERJA */}
          <div>
            <Label htmlFor="unitKerja" className="text-gray-700 font-medium">
              Unit Kerja
            </Label>
            <Input
              type="text"
              id="unitKerja"
              name="unitKerja"
              value={formData.unitKerja}
              onChange={handleChange}
              placeholder="Masukkan unit kerja"
            />
          </div>

     {/* TELEPON */}
<div>
  <Label htmlFor="telepon" className="text-gray-700 font-medium">
    Nomor Telepon Aktif
  </Label>
  <div className="relative">
    <div className="flex items-center">
      <span className="text-gray-500 mr-2">+62</span>
      <Input
        type="text"
        id="telepon"
        name="telepon"
        value={formData.telepon}
        onChange={handleChange}
        placeholder="8xx xxx xxxx"
        pattern="[0-9]*"
        className="pl-2 border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300 w-full"
      />
    </div>
  </div>
</div>
          {/* STATUS */}
          <div>
            <Label htmlFor="status" className="text-gray-700 font-medium">
              Status
            </Label>
            <Input
              type="text"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Masukkan status"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/pengguna')}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Memproses...' : 'Update'}
            </Button>
          </div>
        </form>
      </div>
    </Sidebar>
  )
}

const ProtectedPage = withRoleGuard(EditUserPage, [1])
export default function Page() {
  return <ProtectedPage />
}
