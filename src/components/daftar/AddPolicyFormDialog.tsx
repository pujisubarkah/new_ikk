// components/AddPolicyFormDialog.tsx
"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DASAR_HUKUM_OPTIONS = [
  "UNDANG UNDANG",
  "PERATURAN PEMERINTAH",
  "PERATURAN PRESIDEN",
  "PERATURAN MENTERI",
  "PERATURAN DAERAH",
  "PERATURAN KEPALA DAERAH",
  "PERATURAN KEPALA INSTANSI",
  "LAINNYA",
];

interface AddPolicyFormDialogProps {
  onPolicyAdded: () => void;
}

export default function AddPolicyFormDialog({ onPolicyAdded }: AddPolicyFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [sektorLainnya, setSektorLainnya] = useState(false);
  const [dasarHukumDipilih, setDasarHukumDipilih] = useState<string[]>([]);

  const handleCheckboxChange = (value: string) => {
    setDasarHukumDipilih((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

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
      minDate.setFullYear(today.getFullYear() - 2);
      maxDate.setFullYear(today.getFullYear() - 1);

      if (dateInput < minDate || dateInput > maxDate) {
        toast.dismiss();
        toast.error("Tanggal kebijakan harus berada di antara 1 hingga 2 tahun terakhir.");
        return;
      }

      const payload = {
        nama_kebijakan: formData.get("nama_kebijakan") as string,
        sektor_kebijakan: formData.get("sektor_kebijakan") as string,
        sektor_kebijakan_lain: sektorLainnya
          ? formData.get("sektor_kebijakan_lain") as string
          : null,
        tanggal_berlaku: formData.get("tanggal_berlaku") as string,
        link_drive: formData.get("link_drive") as string,
        program: formData.get("program") as string,
        link_bukti: formData.get("link_bukti") as string,
        dasar_hukum: dasarHukumDipilih.map((item) => ({
          jenis: item,
          nomor: formData.get(`nomor_${item}`),
        })),
        created_by: userId,
      };

      toast.loading("Menyimpan kebijakan...");
      const res = await fetch("/api/policies/create", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Gagal menyimpan data.");

      toast.dismiss();
      toast.success("Kebijakan berhasil ditambahkan!");
      setOpen(false);
      form.reset();
      setSektorLainnya(false);
      setDasarHukumDipilih([]);
      onPolicyAdded();
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
          + Tambah Kebijakan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nama Kebijakan */}
          <div>
            <label htmlFor="nama_kebijakan" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kebijakan
            </label>
            <input
              type="text"
              id="nama_kebijakan"
              name="nama_kebijakan"
              required
              placeholder="Contoh: Kebijakan Perlindungan Sosial"
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
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

          {/* Dasar Hukum Kebijakan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dasar Hukum Kebijakan
            </label>
            <div className="space-y-2">
              {DASAR_HUKUM_OPTIONS.map((option) => (
                <div key={option} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={option}
                    value={option}
                    onChange={() => handleCheckboxChange(option)}
                    checked={dasarHukumDipilih.includes(option)}
                  />
                  <label htmlFor={option} className="text-sm font-medium text-gray-700 w-48">
                    {option}
                  </label>
                  {dasarHukumDipilih.includes(option) && (
                    <input
                      type="text"
                      name={`nomor_${option}`}
                      placeholder={`Nomor ${option}`}
                      className="flex-1 text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Program/Kegiatan */}
          <div>
            <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Program/Kegiatan
            </label>
            <input
              type="text"
              id="program"
              name="program"
              placeholder="Contoh: Program Perlindungan Lansia"
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Link Bukti Program/Kegiatan */}
          <div>
            <label htmlFor="link_bukti" className="block text-sm font-medium text-gray-700 mb-2">
              Link Bukti Program/Kegiatan (Google Drive)
            </label>
            <input
              type="url"
              id="link_bukti"
              name="link_bukti"
              placeholder="https://drive.google.com/..."
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tanggal Berlaku */}
          <div>
            <label htmlFor="tanggal_berlaku" className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Berlaku Kebijakan
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

          {/* Link Dokumen Drive */}
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
