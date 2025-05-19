import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { serializeBigInt } from '@/lib/serializeBigInt';

const policySchema = z.object({
  nama_kebijakan: z.string().min(1, 'Nama kebijakan harus diisi'),
  detail_nama_kebijakan: z.string().min(1, 'Detail nama kebijakan harus diisi'),
  sektor_kebijakan: z.string().min(1, 'Sektor kebijakan harus diisi'),
  sektor_kebijakan_lain: z.string().nullable().optional(), // ubah jadi optional
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

  program_detail: z.object({
    dasar_hukum: z.any(),
    program: z.string().min(1, 'Nama program harus diisi'),
    file_url: z.string().url('Link file program harus valid')
  })
}).superRefine((data, ctx) => {
  if (data.sektor_kebijakan === 'Lainnya' && !data.sektor_kebijakan_lain) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['sektor_kebijakan_lain'],
      message: 'Harus diisi ketika sektor kebijakan adalah Lainnya'
    });
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log body mentah sebelum validasi
    console.log('📥 Received body:', req.body);

    // Validasi body
    const parsedBody = policySchema.parse(req.body);

    // Log body setelah validasi
    console.log('✅ Parsed body:', parsedBody);

    const userId = parsedBody.created_by;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID tidak ditemukan',
      });
    }

    // Cari user untuk agency_id dan agency_id_panrb
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

    // Simpan policy sekaligus dengan relasi policy_program
    const newPolicy = await prisma.policy.create({
      data: {
        name: parsedBody.nama_kebijakan,
        name_detail: parsedBody.detail_nama_kebijakan,
        sector: parsedBody.sektor_kebijakan,
        lainnya: parsedBody.sektor_kebijakan === 'Lainnya' ? parsedBody.sektor_kebijakan_lain : null,
        file_url: parsedBody.link_drive,
        effective_date: new Date(parsedBody.tanggal_berlaku),

        policy_process: 'DIAJUKAN',
        policy_status: 'BELUM_TERVERIFIKASI',
        progress: '0%',
        created_by: BigInt(userId),
        created_at: new Date(),

        is_valid: false,
        assigned_by_admin_id: BigInt(userId),
        agency_id: user.agency_id,
        agency_id_panrb: user.agency_id_panrb,
        active_year: new Date().getFullYear(),

        validated_by: null,
        enumerator_id: null,
        processed_by_enumerator_id: null,
        assigned_by_admin_at: null,
        type: null,

        // Relasi policy_program
        policy_program: {
          create: {
            dasar_hukum: parsedBody.program_detail.dasar_hukum,
            program: parsedBody.program_detail.program,
            file_url: parsedBody.program_detail.file_url,
          }
        }
      },
      include: {
        policy_program: true, // supaya response lengkap
      }
    });

    // Serialize BigInt ke string
    const responseData = serializeBigInt(newPolicy);

    return res.status(201).json({
      success: true,
      message: 'Kebijakan berhasil diajukan',
      data: responseData,
    });
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.errors,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : null,
    });
  }
}
