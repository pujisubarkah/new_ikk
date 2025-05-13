"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar-koornas";
import { toast } from "sonner"; // Hanya import toast, tidak perlu Toaster

interface FormData {
  name: string;
  username: string;
  email: string;
  position: string;
  phone: string;
  work_unit: string;
  agency_id_panrb: string;
  password: string;
  koorNasionalId: string;
  status: "aktif" | "non_aktif";
}

interface Instansi {
  id: string;
  name: string;
  instansi: {
    agency_id: string;
    agency_name: string;
  };
}

interface ErrorResponse {
  message?: string;
}

const isErrorResponse = (data: unknown): data is ErrorResponse => {
  return typeof data === "object" && data !== null && "message" in data;
};

export default function TambahVerifikator() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    position: "",
    phone: "",
    work_unit: "",
    agency_id_panrb: "",
    password: "",
    koorNasionalId: "",
    status: "aktif",
  });

  const [instansis, setInstansis] = useState<Instansi[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Ambil ID koordinator nasional dari localStorage
  useEffect(() => {
    const koorId = localStorage.getItem("id");
    if (koorId) {
      setFormData((prev) => ({
        ...prev,
        koorNasionalId: koorId,
      }));
    }
  }, []);

  // Fetch instansi
  useEffect(() => {
    const fetchInstansi = async () => {
      try {
        const res = await fetch("/api/instansi");
        const data = await res.json();
        setInstansis(data);
      } catch (err) {
        console.error("Gagal memuat instansi", err);
      }
    };

    fetchInstansi();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "agency_id_panrb") {
      const selected = instansis.find((inst) => inst.id === value);
      setFormData((prev) => ({
        ...prev,
        agency_id_panrb: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    const errors: Partial<Record<keyof FormData, string>> = {};

    // Validasi manual
    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = "Nama minimal 3 karakter";
    }

    if (!formData.username || formData.username.trim().length < 3) {
      errors.username = "Username minimal 3 karakter";
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Email tidak valid";
    }

    if (!formData.position || formData.position.trim().length < 2) {
      errors.position = "Jabatan minimal 2 karakter";
    }

    if (!formData.phone || formData.phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Nomor telepon minimal 10 angka";
    }

    if (!formData.agency_id_panrb) {
      errors.agency_id_panrb = "Pilih instansi";
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = "Password minimal 8 karakter";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);

      Object.values(errors).forEach((msg) => {
        toast.error(msg); // Hanya gunakan toast.error
      });

      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/verifikator/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData: unknown = await res.json();
        let errorMessage = "Gagal menambahkan verifikator";

        if (isErrorResponse(errorData)) {
          errorMessage = errorData.message || errorMessage;
        }

        throw new Error(errorMessage);
      }

      toast.success("Verifikator berhasil ditambahkan!");
      router.push("/koordinator-utama/pengguna");
    } catch (err: unknown) {
      let errorMessage = "Gagal menambahkan verifikator";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Error", {
        description: errorMessage,
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <></>
      </Sidebar>
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Tambah Verifikator</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow">
          {/* KIRI */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="username">NIP</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
              )}
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
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
              )}
            </div>
            <div>
              <Label htmlFor="agency_id_panrb">Instansi</Label>
              <select
                id="agency_id_panrb"
                name="agency_id_panrb"
                value={formData.agency_id_panrb}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="" disabled>Pilih Instansi</option>
                {instansis
                  .filter((item) => item.instansi && item.instansi.agency_name)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.instansi.agency_name}
                    </option>
                  ))}
              </select>
              {formErrors.agency_id_panrb && (
                <p className="text-red-500 text-sm mt-1">{formErrors.agency_id_panrb}</p>
              )}
            </div>
          </div>

          {/* KANAN */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="position">Jabatan</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
              {formErrors.position && (
                <p className="text-red-500 text-sm mt-1">{formErrors.position}</p>
              )}
            </div>
            <div>
              <Label htmlFor="work_unit">Unit Kerja</Label>
              <Input
                id="work_unit"
                name="work_unit"
                value={formData.work_unit}
                onChange={handleChange}
                required
                placeholder="Contoh: BPSDM Kemenkes"
              />
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
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
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
                <option value="aktif">Aktif</option>
                <option value="non_aktif">Non Aktif</option>
              </select>
            </div>
          </div>

          {/* BUTTON */}
          <div className="col-span-1 md:col-span-2 flex justify-between mt-4 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={handleBack}>
              Kembali
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan Verifikator"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
