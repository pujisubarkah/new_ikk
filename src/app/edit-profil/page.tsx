'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Sidebar from '@/components/sidebar-admin'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { toast } from 'sonner'

interface FormData {
  nama: string
  nip: string
  nik: string
  instansi: string
  email: string
  password: string
  jabatan: string
  unitKerja: string
  telepon: string
  status: string
  username?: string
  position?: string
  work_unit?: string
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

function EditUserPage(): React.ReactNode {
  const router = useRouter()
  const id = typeof window !== 'undefined' ? localStorage.getItem('id') || '' : ''
  // State utama
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    nip: '',
    nik: '',
    instansi: '',
    email: '',
    password: '',
    jabatan: '',
    unitKerja: '',
    telepon: '',
    status: '',
  })
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Validasi form
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validateForm = (): boolean => {
    const requiredFields: (keyof FormData)[] = ['nama', 'nip', 'nik', 'instansi', 'email', 'jabatan']
    const errors: string[] = []

    requiredFields.forEach((field) => {
      if (!formData[field]) {
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

  // Load data awal
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [agenciesRes] = await Promise.all([
          axios.get('/api/instansi'),
        ])

        setAgencies(agenciesRes.data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Gagal memuat data awal:', err.message)
        } else {
          console.error('Gagal memuat data awal:', err)
        }
      }
    }

    const fetchUserData = async () => {
      if (!id) return
      try {
        const response = await axios.get(`/api/users/${id}`)
        const userData = response.data

        setFormData({
          nama: userData.name || '',
          nip: userData.username || '',
          nik: userData.nik || '',
          instansi: userData.agency_id_panrb?.toString() || '',
          email: userData?.email || '',
          password: '',
          jabatan: userData.position || '',
          unitKerja: userData.work_unit || '',
          telepon: userData.telepon || '',
          status: userData.status || '',
        })
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Gagal memuat detail pengguna:', err.message)
        } else {
          console.error('Gagal memuat detail pengguna:', err)
        }
        setError('Gagal memuat detail pengguna')
      }
    }

    fetchInitialData()
    fetchUserData()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    const updateToast = toast.loading('Sedang memperbarui data...')

    try {
      const cleanedPhone = formData.telepon.replace(/^0+/, '')
      const phoneWithPrefix = cleanedPhone.startsWith('+62') 
        ? cleanedPhone 
        : `+62${cleanedPhone}`

      const payload: Partial<FormData & { agency_id_panrb: number }> = {
        nama: formData.nama,
        username: formData.nip,
        nik: formData.nik,
        agency_id_panrb: Number(formData.instansi),
        email: formData.email,
        position: formData.jabatan,
        work_unit: formData.unitKerja,
        telepon: phoneWithPrefix,
        status: formData.status,
      }

      if (formData.password) {
        payload.password = formData.password
      }

      await axios.put(`/api/users/${id}`, payload)
      toast.success('Data pengguna berhasil diperbarui', {
        id: updateToast
      })

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

  if (loading) {
    return (
      <Sidebar>
        <div className="w-full px-6 py-8">
          <p>Loading...</p>
        </div>
      </Sidebar>
    )
  }

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
          {/* Kolom Kiri */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="nip">NIP</Label>
              <Input
                id="nip"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                required
                placeholder="Masukkan NIP"
              />
            </div>
            <div>
              <Label htmlFor="nik">NIK</Label>
              <Input
                id="nik"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                required
                placeholder="Masukkan NIK"
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
                {agencies
                  .filter(
                    (item, index, self) =>
                      index ===
                      self.findIndex((t) => t.instansi?.agency_id === item.instansi?.agency_id)
                  )
                  .sort((a, b) => {
                    const idA = a.instansi?.agency_id || ''
                    const idB = b.instansi?.agency_id || ''
                    return idA.localeCompare(idB)
                  })
                  .map((item) => (
                    <option key={item.id} value={item.instansi?.agency_id || ''}>
                      {item.instansi?.agency_name || 'NA'}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <Label htmlFor="email">Email Aktif</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Masukkan email"
              />
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
                  placeholder="Biarkan kosong jika tidak ingin mengubah"
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

          {/* Kolom Kanan */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <Label htmlFor="jabatan">Jabatan</Label>
              <Input
                id="jabatan"
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                placeholder="Contoh: Kepala Dinas"
              />
            </div>
            <div>
              <Label htmlFor="unitKerja">Unit Kerja</Label>
              <Input
                id="unitKerja"
                name="unitKerja"
                value={formData.unitKerja}
                onChange={handleChange}
                placeholder="Contoh: Dinas"
              />
            </div>
            <div>
              <Label htmlFor="telepon">Telepon</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  +62
                </span>
                <Input
                  id="telepon"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  className="pl-14"
                  placeholder="8123456789"
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

          {/* Tombol Aksi */}
          <div className="col-span-1 md:col-span-2 flex justify-between mt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => router.push('/pengguna')}
              disabled={loading}
            >
              Kembali
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white" 
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
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
