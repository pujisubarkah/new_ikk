// components/AddPolicyFormDialog.tsx
"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddPolicyFormDialogProps {
  onPolicyAdded: () => void;
}

export default function AddPolicyFormDialog({ onPolicyAdded }: AddPolicyFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [sektorLainnya, setSektorLainnya] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);

  try {
    const userId = localStorage.getItem("id");
    if (!userId) throw new Error("User ID tidak ditemukan");

    const tanggalBerlaku = formData.get("tanggal_berlaku") as string;
    const dateInput = new Date(tanggalBerlaku);
    const today = new Date();
    const minDate = new Date(today);
    const maxDate = new Date(today);

    minDate.setFullYear(today.getFullYear() - 2); // Maksimum 2 tahun yang lalu
    maxDate.setFullYear(today.getFullYear() - 1); // Minimum 1 tahun yang lalu

    // Validasi tanggal
    if (dateInput < minDate || dateInput > maxDate) {
      toast.dismiss();
      toast.error("Tanggal kebijakan harus berada di antara 1 hingga 2 tahun terakhir.");
      return;
    }

    const payload = {
      nama_kebijakan: formData.get("nama_kebijakan") as string,
      detail_nama_kebijakan: formData.get("detail_nama_kebijakan") as string,
      sektor_kebijakan: formData.get("sektor_kebijakan") as string,
      sektor_kebijakan_lain: sektorLainnya
        ? formData.get("sektor_kebijakan_lain") as string
        : null,
      tanggal_berlaku: formData.get("tanggal_berlaku") as string,
      link_drive: formData.get("link_drive") as string,
      created_by: userId, // 🔥 Tambahkan ini
    };

    toast.loading("Menyimpan kebijakan...");
    const res = await fetch("/api/policies/create", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan data.");
    }

    toast.dismiss();
    toast.success("Kebijakan berhasil ditambahkan!");
    setOpen(false);
    form.reset();
    setSektorLainnya(false);
    onPolicyAdded(); // Trigger refresh di parent component
  } catch (err) {
    toast.dismiss();
    const errorMessage =
      err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim data.";
    toast.error(errorMessage);
  }
};


  const handleSektorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSektorLainnya(e.target.value === "Lainnya");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md">
          + Tambah Populasi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropdown Nama Kebijakan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama dan Detail Kebijakan
            </label>
            <div className="flex gap-4">
              <select
                id="nama_kebijakan"
                name="nama_kebijakan"
                required
                className="w-1/3 text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih</option>
                <option value="UU">UNDANG UNDANG</option>
                <option value="PP">PERATURAN PEMERINTAH</option>
                <option value="PERPRES">PERATURAN PRESIDEN</option>
                <option value="PERMEN">PERATURAN MENTERI</option>
                <option value="PERDA">PERATURAN DAERAH</option>
                <option value="PERKADA">PERATURAN KEPALA DAERAH</option>
                <option value="PERKAINS">PERATURAN KEPALA INSTANSI</option>
                <option value="LAINNYA">LAINNYA</option>
              </select>
              <input
                type="text"
                id="detail_nama_kebijakan"
                name="detail_nama_kebijakan"
                required
                placeholder="Contoh: UU No. 11 Tahun 2020"
                className="flex-1 text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Sektor Kebijakan */}
          <div>
            <label htmlFor="sektor_kebijakan" className="block text-sm font-medium text-gray-700 mb-2">
              Sektor Kebijakan
            </label>
            <select
              id="sektor_kebijakan"
              name="sektor_kebijakan"
              required
              onChange={handleSektorChange}
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih Sektor</option>
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Pangan">Pangan</option>
              <option value="Ketenagakerjaan">Ketenagakerjaan</option>
              <option value="Sosial">Sosial</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Aparatur Negara">Aparatur Negara</option>
              <option value="Perencana">Perencana</option>
              <option value="Lingkungan">Lingkungan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {sektorLainnya && (
              <input
                type="text"
                id="sektor_kebijakan_lain"
                name="sektor_kebijakan_lain"
                placeholder="Sebutkan sektor lainnya"
                className="mt-3 w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>

          {/* Tanggal Berlaku */}
          <div>
            <label htmlFor="tanggal_berlaku" className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Berlaku
            </label>
            <input
              type="date"
              id="tanggal_berlaku"
              name="tanggal_berlaku"
              required
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Hanya untuk kebijakan yang telah berlaku efektif minimal 1 tahun dan maksimal 2 tahun terakhir.
            </p>
          </div>

          {/* Link Drive */}
          <div>
            <label htmlFor="link_drive" className="block text-sm font-medium text-gray-700 mb-2">
              Link Dokumen (Google Drive)
            </label>
            <input
              type="url"
              id="link_drive"
              name="link_drive"
              required
              placeholder="https://drive.google.com/... "
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}