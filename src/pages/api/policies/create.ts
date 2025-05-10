import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";
import { z } from "zod";
import { serializeBigInt } from "@/lib/serializeBigInt";

// Define Zod schema untuk validasi request body
const policySchema = z.object({
  nama_kebijakan: z.string().min(1, "Nama kebijakan harus diisi"),
  detail_nama_kebijakan: z.string().min(1, "Detail nama kebijakan harus diisi"),
  sektor_kebijakan: z.string().min(1, "Sektor kebijakan harus diisi"),
  sektor_kebijakan_lain: z.string().nullable(),
  tanggal_berlaku: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal berlaku tidak valid",
  }),
  link_drive: z.string().url("Link Drive harus valid").min(1, "Link Drive harus diisi"),
});

// Helper function untuk serialize BigInt ke string
// Removed local declaration to avoid conflict with imported function

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.headers['x-user-id'] as string;

    console.log("📥 Received userId from headers:", userId);
    console.log("📥 Received body:", req.body);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID tidak ditemukan'
      });
    }

    // Validasi body menggunakan Zod schema
    const parsedBody = policySchema.parse(req.body);  // Using `.parse()` to throw error on invalid data
    const {
      nama_kebijakan,
      detail_nama_kebijakan,
      sektor_kebijakan,
      sektor_kebijakan_lain,
      tanggal_berlaku,
      link_drive,
    } = parsedBody;

    // Cari user untuk mengambil agency_id
    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: { agency_id: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    const newPolicy = await prisma.policy.create({
      data: {
        name: nama_kebijakan,
        name_detail: detail_nama_kebijakan,
        sector: sektor_kebijakan,
        lainnya: sektor_kebijakan === 'Lainnya' ? sektor_kebijakan_lain : null,
        file_url: link_drive,
        effective_date: new Date(tanggal_berlaku),

        policy_process: 'DIAJUKAN',
        progress: '0%',
        created_by: BigInt(userId),
        created_at: new Date(),

        // Update sesuai permintaan
        is_valid: false, // menunggu validasi
        assigned_by_admin_id: BigInt(userId), // koor instansi sebagai admin assigner
        agency_id: user.agency_id, // dari user yang submit
        active_year: 2025,

        // Biarkan null
        validated_by: null,
        enumerator_id: null,
        processed_by_enumerator_id: null,
        assigned_by_admin_at: null,
        agency_id_panrb: null,
        type: null,
      },
    });

    // Pastikan BigInt diubah menjadi string
    const responseData = serializeBigInt(newPolicy);

    return res.status(201).json({
      success: true,
      message: 'Kebijakan berhasil diajukan',
      data: responseData
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : null
    });
  }
}
