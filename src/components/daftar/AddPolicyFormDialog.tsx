'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// --- OPTIONS ---
const sektorOptions = [
  'Infrastruktur',
  'Pangan',
  'Ketenagakerjaan',
  'Sosial',
  'Pendidikan',
  'Kesehatan',
  'Aparatur Negara',
  'Perencana',
  'Lingkungan',
  'Lainnya',
] as const;

const dasarHukumOptions = ['UNDANG-UNDANG', 'PERATURAN PEMERINTAH', 'PERATURAN PRESIDEN','PERATURAN MENTERI','PERATURAN BADAN/LEMBAGA/KOMISI', 'PREATURAN DAERAH', 'PERATURAN GUBERNUR', 'PERATURAN BUPATI','PERATURAN WALIKOTA','PERATURAN LAIN'] as const;

// --- SCHEMA ---
const formSchema = z.object({
  nama_kebijakan: z.string().min(1, 'Nama kebijakan wajib diisi'),
  detail_nama_kebijakan: z.string().min(1, 'Detail nama kebijakan wajib diisi'),
  sektor_kebijakan: z.enum(sektorOptions),
  sektor_kebijakan_lain: z.string().optional(),
  tanggal_berlaku: z.string().min(1, 'Tanggal berlaku wajib diisi'),
  link_drive: z.string().url('Link Drive tidak valid'),
  created_by: z.string().min(1, 'User ID tidak ditemukan'),
  program_detail: z.object({
    program: z.string().min(1, 'Nama program wajib diisi'),
    file_url: z.string().url('Link file tidak valid'),
    dasar_hukum: z.array(
      z.object({
        jenis: z.enum(dasarHukumOptions),
        nomor: z.string().min(1, 'Nomor dasar hukum wajib diisi'),
      })
    ),
  }),
});

export type PolicyFormData = z.infer<typeof formSchema>;

export default function AddPolicyForm() {
  const [open, setOpen] = useState(false);
  const [selectedDasarHukum, setSelectedDasarHukum] = useState<string[]>([]);
  const [nomorDasarHukum, setNomorDasarHukum] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sektor_kebijakan: undefined,
      sektor_kebijakan_lain: '',
      nama_kebijakan: '',
      detail_nama_kebijakan: '',
      tanggal_berlaku: '',
      link_drive: '',
      created_by: '',
      program_detail: {
        program: '',
        file_url: '',
        dasar_hukum: [],
      },
    },
  });

  const sektor = watch('sektor_kebijakan');

  // Load user ID from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('id');
    if (userId) {
      setValue('created_by', userId);
    }
  }, [setValue]);

  const handleCheckboxChange = (jenis: string) => {
    setSelectedDasarHukum((prev) =>
      prev.includes(jenis)
        ? prev.filter((item) => item !== jenis)
        : [...prev, jenis]
    );
  };

  const handleNomorChange = (e: React.ChangeEvent<HTMLInputElement>, jenis: string) => {
    setNomorDasarHukum((prev) => ({
      ...prev,
      [jenis]: e.target.value,
    }));
  };

  const onSubmit = async (data: PolicyFormData) => {
    const dasar_hukum = selectedDasarHukum.map((jenis) => ({
      jenis: jenis as typeof dasarHukumOptions[number],
      nomor: nomorDasarHukum[jenis] || '',
    }));

    const payload: PolicyFormData = {
      ...data,
      sektor_kebijakan_lain: sektor === 'Lainnya' ? data.sektor_kebijakan_lain : undefined,
      program_detail: {
        ...data.program_detail,
        dasar_hukum,
      },
    };

    try {
      const res = await fetch('/api/policies/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Berhasil!', {
          description: 'Kebijakan berhasil diajukan.',
        });
        setOpen(false);
      } else {
        throw new Error(result.message || 'Gagal menyimpan.');
      }
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat mengirim data.';
      toast.error('Gagal', {
        description: message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md">
          + Tambah Kebijakan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nama Kebijakan */}
          <div>
            <label htmlFor="nama_kebijakan" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kebijakan
            </label>
            <input
              {...register('nama_kebijakan')}
              type="text"
              id="nama_kebijakan"
              placeholder="Contoh: Kebijakan Perlindungan Sosial"
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.nama_kebijakan && (
              <p className="text-red-500 text-xs mt-1">{errors.nama_kebijakan.message}</p>
            )}
          </div>

          {/* Detail Nama Kebijakan */}
          <div>
            <label htmlFor="detail_nama_kebijakan" className="block text-sm font-medium text-gray-700 mb-2">
              Detail Nama Kebijakan
            </label>
            <input
              {...register('detail_nama_kebijakan')}
              type="text"
              id="detail_nama_kebijakan"
              placeholder="Contoh: Program Perlindungan Anak Terlantar"
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.detail_nama_kebijakan && (
              <p className="text-red-500 text-xs mt-1">{errors.detail_nama_kebijakan.message}</p>
            )}
          </div>

          {/* Sektor Kebijakan */}
          <div>
            <label htmlFor="sektor_kebijakan" className="block text-sm font-medium text-gray-700 mb-2">
              Sektor Kebijakan
            </label>
            <select
              {...register('sektor_kebijakan')}
              id="sektor_kebijakan"
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih Sektor</option>
              {sektorOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.sektor_kebijakan && (
              <p className="text-red-500 text-xs mt-1">{errors.sektor_kebijakan.message}</p>
            )}

            {sektor === 'Lainnya' && (
              <input
                {...register('sektor_kebijakan_lain')}
                type="text"
                placeholder="Sebutkan sektor lainnya"
                className="mt-3 w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>

          {/* Dasar Hukum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dasar Hukum Kebijakan
            </label>
            <div className="space-y-2">
              {dasarHukumOptions.map((option) => (
                <div key={option} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={option}
                    onChange={() => handleCheckboxChange(option)}
                    checked={selectedDasarHukum.includes(option)}
                  />
                  <label htmlFor={option} className="text-sm font-medium text-gray-700 w-48">
                    {option}
                  </label>
                  {selectedDasarHukum.includes(option) && (
                    <input
                      type="text"
                      value={nomorDasarHukum[option] || ''}
                      onChange={(e) => handleNomorChange(e, option)}
                      placeholder={`${option} No. XX/Th XXXX`}
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
              {...register('program_detail.program')}
              type="text"
              id="program"
              placeholder="Contoh: Program Perlindungan Lansia"
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.program_detail?.program && (
              <p className="text-red-500 text-xs mt-1">{errors.program_detail.program.message}</p>
            )}
          </div>

          {/* Link Bukti Program/Kegiatan */}
          <div>
            <label htmlFor="file_url" className="block text-sm font-medium text-gray-700 mb-2">
              Link Bukti Program/Kegiatan (Google Drive)
            </label>
            <input
              {...register('program_detail.file_url')}
              type="url"
              id="file_url"
              placeholder="https://drive.google.com/...  "
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.program_detail?.file_url && (
              <p className="text-red-500 text-xs mt-1">{errors.program_detail.file_url.message}</p>
            )}
          </div>

          {/* Tanggal Berlaku */}
          <div>
            <label htmlFor="tanggal_berlaku" className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Berlaku Kebijakan
            </label>
            <input
              {...register('tanggal_berlaku')}
              type="date"
              id="tanggal_berlaku"
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.tanggal_berlaku && (
              <p className="text-red-500 text-xs mt-1">{errors.tanggal_berlaku.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Hanya untuk kebijakan yang telah berlaku efektif minimal 1 tahun dan maksimal 2 tahun terakhir.
            </p>
          </div>

          {/* Link Dokumen Drive */}
          <div>
            <label htmlFor="link_drive" className="block text-sm font-medium text-gray-700 mb-2">
              Link Folder Dokumen Dasar Hukum (Google Drive)
            </label>
            <input
              {...register('link_drive')}
              type="url"
              id="link_drive"
              placeholder="https://drive.google.com/...  "
              className="w-full text-base py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.link_drive && (
              <p className="text-red-500 text-xs mt-1">{errors.link_drive.message}</p>
            )}
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
