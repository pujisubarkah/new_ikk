"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";

// ================== TYPES ==================
interface FormData {
  nama: string;
  nip: string;
  nik: string;
  instansi: string;
  email: string;
  role: string;
  password: string;
  jabatan: string;
  unitKerja: string;
  telepon: string;
  status: string;
  suratPenunjukkan: string;
  penunjukkan_id?: number;
  role_id: number;
}

interface Instansi {
  instansi: {
    agency_id: string
    agency_name: string
  } | null
  id: string;
  name: string;
  category: string;
}

// ================== HELPER FUNCTIONS ==================
const formatNipDisplay = (nip: string): string => {
  return nip.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const isValidGoogleDriveLink = (url: string): boolean => {
  // Mencakup berbagai format tautan Google Drive/Sheets
  const driveRegex = /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+/;
  const sheetsRegex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]+(\/edit#gid=\d+)?/;
  return driveRegex.test(url) || sheetsRegex.test(url);
};

// ================== MAIN COMPONENT ==================
const TambahPengguna: React.FC = () => {
  // ================== HOOKS ==================
  const { toast } = useToast();
  const router = useRouter();

  // ================== STATE ==================
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    nip: "",
    nik: "",
    instansi: "",
    email: "",
    role: "Koordinator Instansi",
    password: "",
    jabatan: "",
    unitKerja: "",
    telepon: "",
    status: "Nonaktif",
    suratPenunjukkan: "",
    role_id: 4,
  });

  const [instansis, setInstansis] = useState<Instansi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ================== CONSTANTS ==================
  const mandatoryFields = [
    "nama",
    "nip",
    "instansi",
    "email",
    "password",
    "jabatan",
    "unitKerja",
    "telepon",
    "suratPenunjukkan",
  ];

  // ================== EFFECTS ==================
  useEffect(() => {
    const fetchInstansi = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/instansi");
        setInstansis(response.data);
      } catch (err) {
        console.error("Failed to fetch instansi:", err);
        setError("Gagal memuat data instansi");
        toast({
          title: "Error",
          description: "Gagal memuat data instansi",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInstansi();
  }, [toast]);

  // ================== EVENT HANDLERS ==================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "nip" && { username: value.replace(/[^0-9]/g, '') })
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // ================== VALIDATION ==================
  const validateForm = async () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validasi required fields
    mandatoryFields.forEach((field) => {
      if (!formData[field as keyof FormData]?.toString().trim()) {
        newErrors[field] = "Field ini wajib diisi";
        isValid = false;
      }
    });

    // Validasi telepon
    if (formData.telepon && !/^\d+$/.test(formData.telepon)) {
      newErrors.telepon = "Nomor telepon harus berupa angka";
      isValid = false;
    }

    // Validasi password
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
      isValid = false;
    }

    // Validasi email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
      isValid = false;
    }

    // Validasi link surat penunjukkan
    if (formData.suratPenunjukkan && !isValidGoogleDriveLink(formData.suratPenunjukkan)) {
      newErrors.suratPenunjukkan = "Harus berupa link Google Drive/Sheets yang valid";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ================== FORM SUBMISSION ==================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) {
      toast({
        title: "Error Validasi",
        description: "Harap perbaiki field yang ditandai",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // 1. Upload surat penunjukkan
      const suratResponse = await axios.post('/api/surat_penunjukkan', {
        file: formData.suratPenunjukkan
      });
      
      const penunjukkanId = suratResponse.data.id;

      // 2. Simpan user
      await axios.post('/api/users/register', {
        name: formData.nama,
        username: formData.nip,
        nik: formData.nik,
        agency_id_panrb: formData.instansi,
        active_year: 2025,
        email: formData.email,
        phone: formData.telepon,
        position: formData.jabatan,
        work_unit: formData.unitKerja,
        role_id: 4,
        status: 'inaktif',
        password: formData.password,
        penunjukkan_id: penunjukkanId
      });
      
      router.push('/registrasi-berhasil');
    } catch (error: unknown) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan tidak diketahui",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ================== NAVIGATION ==================
  const handleBack = () => router.push("/");

  // ================== RENDER ==================
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Registrasi Koordinator Instansi</h1>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ROLE - Tampilkan sebagai Koordinator Instansi */}
            <div className="md:col-span-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value="Koordinator Instansi"
                readOnly
                className="w-full bg-gray-100 cursor-not-allowed"
              />
              {/* Tambahkan input hidden untuk mengirim role_id */}
              <input type="hidden" name="role_id" value={formData.role_id} />
            </div>
            
            {/* BAGIAN KIRI */}
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nip">Nomor Induk Pegawai (NIP)*</Label>
                <Input
                  id="nip"
                  name="nip"
                  value={formatNipDisplay(formData.nip)}
                  onChange={handleChange}
                  onBlur={async (e) => {
                    const cleanNip = e.target.value.replace(/[^0-9]/g, '');
                    setFormData(prev => ({ ...prev, nip: cleanNip }));
                    
                    // Validasi real-time saat blur
                    if (cleanNip.length === 18) {
                      try {
                        const response = await fetch(`/api/users/check-nip?nip=${cleanNip}`);
                        const data = await response.json();
                        if (data.exists) {
                          setErrors(prev => ({ ...prev, nip: "NIP ini sudah terdaftar" }));
                        }
                      } catch (error) {
                        console.error("Gagal memverifikasi NIP:", error);
                      }
                    }
                  }}
                />
                {errors.nip && <p className="text-red-500 text-sm mt-1">{errors.nip}</p>}
              </div>
              
              <div>
                <Label htmlFor="nik">NIK (opsional)</Label>
                <Input 
                  id="nik" 
                  name="nik" 
                  value={formData.nik} 
                  onChange={handleChange}
                  className={errors.nik ? "border-red-500" : ""}
                />
                <p className="text-sm text-gray-500 mt-1"> Tidak wajib diisi </p>
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
            
            {/* BAGIAN KANAN */}
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
                <Label htmlFor="unitKerja">Unit Kerja*</Label>
                <Input 
                  id="unitKerja" 
                  name="unitKerja" 
                  value={formData.unitKerja} 
                  onChange={handleChange} 
                  required
                  className={errors.unitKerja ? "border-red-500" : ""}
                />
                {errors.unitKerja && <p className="text-red-500 text-sm mt-1">{errors.unitKerja}</p>}
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
                  value="inaktif"
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
    Cara membuat link shareable: Buka file di Google Drive → Klik &quot;Bagikan&quot; → Pilih &quot;Siapa saja dengan link&quot; → Salin link
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
  );
};

export default TambahPengguna;
