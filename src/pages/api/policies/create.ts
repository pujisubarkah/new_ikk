import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { serializeBigInt } from '@/lib/serializeBigInt';

// Define Zod schema untuk validasi request body
const policySchema = z.object({
  nama_kebijakan: z.string().min(1, 'Nama kebijakan harus diisi'),
  detail_nama_kebijakan: z.string().min(1, 'Detail nama kebijakan harus diisi'),
  sektor_kebijakan: z.string().min(1, 'Sektor kebijakan harus diisi'),
  sektor_kebijakan_lain: z.string().nullable(),
  tanggal_berlaku: z.string().refine((val) => {
    const inputDate = new Date(val);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 2);
    return inputDate >= minDate;
  }, {
    message: 'Tanggal kebijakan harus dalam 2 tahun terakhir',
  }),
  link_drive: z.string().url('Link Drive harus valid').min(1, 'Link Drive harus diisi'),
  created_by: z.string().min(1, 'Created by harus diisi'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validasi body menggunakan Zod schema
    const parsedBody = policySchema.parse(req.body);

    const userId = parsedBody.created_by;

    console.log('📥 Received userId from headers:', userId);
    console.log('📥 Received body:', req.body);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID tidak ditemukan',
      });
    }

    const {
      nama_kebijakan,
      detail_nama_kebijakan,
      sektor_kebijakan,
      sektor_kebijakan_lain,
      tanggal_berlaku,
      link_drive,
    } = parsedBody;

    // Cari user untuk mengambil agency_id dan agency_id_panrb
    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: {
        agency_id: true,
        agency_id_panrb: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    // Buat record baru di tabel policy
    const newPolicy = await prisma.policy.create({
      data: {
        name: nama_kebijakan,
        name_detail: detail_nama_kebijakan,
        sector: sektor_kebijakan,
        lainnya: sektor_kebijakan === 'Lainnya' ? sektor_kebijakan_lain : null,
        file_url: link_drive,
        effective_date: new Date(tanggal_berlaku),

        policy_process: 'DIAJUKAN',
        policy_status: 'BELUM_TERVERIFIKASI',
        progress: '0%',
        created_by: BigInt(userId),
        created_at: new Date(),

        is_valid: false,
        assigned_by_admin_id: BigInt(userId),
        agency_id: user.agency_id,

        // Ambil langsung dari user.agency_id_panrb
        agency_id_panrb: user.agency_id_panrb,

        active_year: 2025,

        // Biarkan null
        validated_by: null,
        enumerator_id: null,
        processed_by_enumerator_id: null,
        assigned_by_admin_at: null,
        type: null,
      },
    });

    // Pastikan BigInt diubah menjadi string
    const responseData = serializeBigInt(newPolicy);

    return res.status(201).json({
      success: true,
      message: 'Kebijakan berhasil diajukan',
      data: responseData,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : null,
    });
  }
}