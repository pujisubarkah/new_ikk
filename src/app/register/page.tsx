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
  suratTugasJFAnalis?: string; // ← Tambahan
  penunjukkan_id?: number;
  role_id: number;
  melibatkanJFAnalis?: string; // ← Tambahan untuk radio button
}

interface Instansi {
  id: string;
  name: string;
  category: string;
  instansi?: {
    agency_id: string;
    agency_name: string;
  };
}

// ================== MAIN COMPONENT ==================
const TambahPengguna: React.FC = () => {
  // ================== HOOKS ==================
  const { toast } = useToast();
  const router = useRouter();

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
    melibatkanJFAnalis: "tidak", // default value
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstansi();
  }, []);

  // ================== HELPER FUNCTIONS ==================
  const formatNipDisplay = (nip: string): string => {
    return nip.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const isValidUrl = (url: string): boolean => {
    try {
      const newUrl = new URL(url);
      return ["http:", "https:"].includes(newUrl.protocol);
    } catch (e) {
      return false;
    }
  };

  // ================== EVENT HANDLERS ==================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      melibatkanJFAnalis: value,
      suratTugasJFAnalis: value === "tidak" ? undefined : prev.suratTugasJFAnalis || "",
    }));
  };

  // ================== VALIDATION ==================
  const validateForm = async () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validasi field wajib
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
    if (formData.suratPenunjukkan && !isValidUrl(formData.suratPenunjukkan)) {
      newErrors.suratPenunjukkan = "Harus berupa URL yang valid";
      isValid = false;
    }

    // Validasi jika melibatkan JF Analis dan belum upload surat tugas
    if (formData.melibatkanJFAnalis === "ya") {
      if (!formData.suratTugasJFAnalis?.trim()) {
        newErrors.suratTugasJFAnalis = "Surat tugas jabatan fungsional wajib diisi";
        isValid = false;
      } else if (!isValidUrl(formData.suratTugasJFAnalis)) {
        newErrors.suratTugasJFAnalis = "Harus berupa URL yang valid";
        isValid = false;
      }
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
      // Upload surat penunjukkan
      const suratResponse = await axios.post("/api/surat_penunjukkan", {
        file: formData.suratPenunjukkan,
      });
      const penunjukkanId = suratResponse.data.id;

      // Simpan user
      await axios.post("/api/users/register", {
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
        status: "inaktif",
        password: formData.password,
        penunjukkan_id: penunjukkanId,
        surat_tugas_jf_analis: formData.suratTugasJFAnalis, // ← Kirim juga surat tugas JF Analis
      });

      router.push("/registrasi-berhasil");
    } catch (error: unknown) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak diketahui",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => router.push("/");

  // ================== RENDER ==================
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow px-6 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-xl font-bold mb-6">Tambah Pengguna</h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama */}
            <div className="md:col-span-1">
              <Label htmlFor="nama">Nama Lengkap *</Label>
              <Input
                id="nama"
                name="nama"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={handleChange}
                className={errors.nama ? "border-red-500" : ""}
              />
              {errors.nama && (
                <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
              )}
            </div>

            {/* NIP */}
            <div className="md:col-span-1">
              <Label htmlFor="nip">NIP *</Label>
              <Input
                id="nip"
                name="nip"
                type="text"
                placeholder="Masukkan NIP"
                value={formatNipDisplay(formData.nip)}
                onChange={handleChange}
                className={errors.nip ? "border-red-500" : ""}
              />
              {errors.nip && (
                <p className="text-red-500 text-sm mt-1">{errors.nip}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="Masukkan email aktif"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Jabatan */}
            <div className="md:col-span-2">
              <Label htmlFor="jabatan">Jabatan *</Label>
              <Input
                id="jabatan"
                name="jabatan"
                type="text"
                placeholder="Masukkan jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                className={errors.jabatan ? "border-red-500" : ""}
              />
              {errors.jabatan && (
                <p className="text-red-500 text-sm mt-1">{errors.jabatan}</p>
              )}
            </div>

            {/* Unit Kerja */}
            <div className="md:col-span-2">
              <Label htmlFor="unitKerja">Unit Kerja *</Label>
              <Input
                id="unitKerja"
                name="unitKerja"
                type="text"
                placeholder="Masukkan unit kerja"
                value={formData.unitKerja}
                onChange={handleChange}
                className={errors.unitKerja ? "border-red-500" : ""}
              />
              {errors.unitKerja && (
                <p className="text-red-500 text-sm mt-1">{errors.unitKerja}</p>
              )}
            </div>

            {/* Telepon */}
            <div className="md:col-span-2">
              <Label htmlFor="telepon">Telepon *</Label>
              <Input
                id="telepon"
                name="telepon"
                type="text"
                placeholder="Masukkan nomor telepon"
                value={formData.telepon}
                onChange={handleChange}
                className={errors.telepon ? "border-red-500" : ""}
              />
              {errors.telepon && (
                <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>
              )}
            </div>

            {/* Instansi */}
            <div className="md:col-span-2">
              <Label htmlFor="instansi">Instansi *</Label>
              <select
                id="instansi"
                name="instansi"
                value={formData.instansi}
                onChange={handleChange}
                className={`w-full border rounded-md h-10 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.instansi ? "border-red-500" : "border-input"
                }`}
              >
                <option value="" disabled>
                  Pilih Instansi
                </option>
                {instansis
                  .filter(
                    (item, index, self) =>
                      index ===
                      self.findIndex(
                        (t) => t.instansi?.agency_id === item.instansi?.agency_id
                      )
                  )
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((instansi) => (
                    <option key={instansi.id} value={instansi.instansi?.agency_id || instansi.id}>
                      {instansi.name}
                    </option>
                  ))}
              </select>
              {errors.instansi && (
                <p className="text-red-500 text-sm mt-1">{errors.instansi}</p>
              )}
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Surat Penunjukkan */}
            <div className="md:col-span-2">
              <Label htmlFor="suratPenunjukkan">Surat Penunjukkan *</Label>
              <Input
                id="suratPenunjukkan"
                name="suratPenunjukkan"
                type="text"
                placeholder="Masukkan link Google Drive/Sheets"
                value={formData.suratPenunjukkan}
                onChange={handleChange}
                onBlur={async () => {
                  if (formData.suratPenunjukkan && !isValidUrl(formData.suratPenunjukkan)) {
                    setErrors((prev) => ({
                      ...prev,
                      suratPenunjukkan: "Harus berupa URL yang valid",
                    }));
                  }
                }}
                className={errors.suratPenunjukkan ? "border-red-500" : ""}
              />
              {errors.suratPenunjukkan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.suratPenunjukkan}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Masukkan link file yang dapat diakses publik (misalnya Google Drive atau Sheets).
              </p>
            </div>

            {/* Pertanyaan Jabatan Fungsional Analis Kebijakan */}
            <div className="md:col-span-2">
              <Label>
                Apakah dalam penilaian indeks kualitas kebijakan ini, Anda melibatkan jabatan fungsional analis kebijakan?
              </Label>

              <div className="flex items-center mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="jf_analis"
                    value="ya"
                    checked={formData.melibatkanJFAnalis === "ya"}
                    onChange={() => handleRadioChange("ya")}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Ya</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="jf_analis"
                    value="tidak"
                    checked={formData.melibatkanJFAnalis === "tidak"}
                    onChange={() => handleRadioChange("tidak")}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Tidak</span>
                </label>
              </div>
            </div>

            {/* Upload Surat Tugas Jika Jawab YA */}
            {formData.melibatkanJFAnalis === "ya" && (
              <div className="md:col-span-2">
                <Label htmlFor="suratTugasJFAnalis">
                  Surat Tugas Jabatan Fungsional Analis Kebijakan *
                </Label>
                <Input
                  id="suratTugasJFAnalis"
                  name="suratTugasJFAnalis"
                  type="text"
                  placeholder="Masukkan link Google Drive/Sheets"
                  value={formData.suratTugasJFAnalis || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      suratTugasJFAnalis: e.target.value,
                    })
                  }
                  onBlur={async () => {
                    if (formData.melibatkanJFAnalis === "ya" && formData.suratTugasJFAnalis) {
                      const isValid = isValidUrl(formData.suratTugasJFAnalis);
                      if (!isValid) {
                        setErrors((prev) => ({
                          ...prev,
                          suratTugasJFAnalis: "Harus berupa URL yang valid",
                        }));
                      }
                    }
                  }}
                  className={errors.suratTugasJFAnalis ? "border-red-500" : ""}
                />
                {errors.suratTugasJFAnalis && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.suratTugasJFAnalis}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Masukkan link file yang dapat diakses publik (misalnya Google Drive atau Sheets).
                </p>
              </div>
            )}

            {/* Submit & Back Buttons */}
            <div className="md:col-span-2 flex justify-between mt-6">
              <Button
                type="button"
                onClick={handleBack}
                variant="secondary"
                disabled={isLoading}
              >
                Kembali
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
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
