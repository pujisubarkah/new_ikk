'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Sidebar from '@/components/sidebar-admin'
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

interface Agency {
  id: string
  name: string
  category: string
}

function EditUserPage() {
  const router = useRouter()
  const params = useParams()

  const id = params?.id as string

  const [formData, setFormData] = useState<FormData>({
    nama: '',
    nip: '',
    nik: '',
    instansi: '',
    email: '',
    role: '',
    password: '',
    jabatan: '',
    telepon: '',
    status: '',
  })

  const [roles, setRoles] = useState<Role[]>([])
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [rolesRes, agenciesRes] = await Promise.all([
          axios.get('/api/role'),
          axios.get('/api/instansi'),
        ])
        setRoles(rolesRes.data)
        setAgencies(agenciesRes.data)
      } catch {
        setError('Gagal memuat data awal (roles / agencies)')
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
          instansi: userData.agency_id.toString() || '',
          email: userData.email || '',
          role: userData.role_user?.role_id.toString() || '',
          password: '',
          jabatan: userData.work_unit || '',
          telepon: userData.telepon || '',
          status: userData.status || '',
        })
      } catch {
        setError('Gagal memuat detail pengguna')
      } finally {
        setLoading(false)
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

    try {
      await axios.put(`/api/users/${id}`, formData)
      alert('Pengguna berhasil diperbarui')
      router.back()
    } catch {
      alert('Gagal memperbarui pengguna')
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <Sidebar>
      <div className="w-full px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Edit Pengguna</h1>
        </div>

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

          {/* KIRI */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="nip">NIP</Label>
              <Input
                id="nip"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                required
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
              />
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
                <option value="" disabled>
                  Pilih Instansi
                </option>
                {agencies.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
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
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* KANAN */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="jabatan">Jabatan</Label>
              <Input
                id="jabatan"
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="telepon">Nomor Telepon Aktif</Label>
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
                <option value="" disabled>
                  Pilih Status
                </option>
                <option value="Aktif">Aktif</option>
                <option value="Non Aktif">Non Aktif</option>
              </select>
            </div>
          </div>

          {/* BUTTON */}
          <div className="col-span-1 md:col-span-2 flex justify-between mt-4">
            <Button type="button" variant="secondary" onClick={router.back}>
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

const ProtectedPage = withRoleGuard(EditUserPage, [1])
export default function Page() {
  return <ProtectedPage />
}