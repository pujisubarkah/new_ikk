// /pages/api/save-ikk-ku-score.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Validasi input menggunakan Zod
const ScoreSchema = z.object({
  policy_id: z.union([z.string(), z.number()]),
  modified_by: z.union([z.string(), z.number()]).optional(),
  active_year: z.union([z.string(), z.number()]).optional(),

  // Jawaban IKK
  a1: z.union([z.string(), z.number()]).optional(),
  a2: z.union([z.string(), z.number()]).optional(),
  a3: z.union([z.string(), z.number()]).optional(),
  b1: z.union([z.string(), z.number()]).optional(),
  b2: z.union([z.string(), z.number()]).optional(),
  b3: z.union([z.string(), z.number()]).optional(),
  c1: z.union([z.string(), z.number()]).optional(),
  c2: z.union([z.string(), z.number()]).optional(),
  c3: z.union([z.string(), z.number()]).optional(),
  d1: z.union([z.string(), z.number()]).optional(),
  d2: z.union([z.string(), z.number()]).optional(),
  jf: z.boolean().optional(),

  // Catatan Verifikator
  catatan_a: z.string().optional(),
  catatan_b: z.string().optional(),
  catatan_c: z.string().optional(),
  catatan_d: z.string().optional(),
  catatan_jf: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  try {
    const parsed = ScoreSchema.parse(req.body);

    const {
      policy_id,
      modified_by,
      active_year,

      a1,
      a2,
      a3,
      b1,
      b2,
      b3,
      c1,
      c2,
      c3,
      d1,
      d2,
      jf,

      catatan_a,
      catatan_b,
      catatan_c,
      catatan_d,
      catatan_jf,
    } = parsed;

    const bigPolicyId = BigInt(policy_id.toString());
    const currentYear = parsed.active_year ? Number(parsed.active_year) : 2025;

    await prisma.ikk_ku_score.upsert({
      where: {
        id: bigPolicyId,
      },
      update: {
        a1: a1 ? BigInt(a1.toString()) : undefined,
        a2: a2 ? BigInt(a2.toString()) : undefined,
        a3: a3 ? BigInt(a3.toString()) : undefined,
        b1: b1 ? BigInt(b1.toString()) : undefined,
        b2: b2 ? BigInt(b2.toString()) : undefined,
        b3: b3 ? BigInt(b3.toString()) : undefined,
        c1: c1 ? BigInt(c1.toString()) : undefined,
        c2: c2 ? BigInt(c2.toString()) : undefined,
        c3: c3 ? BigInt(c3.toString()) : undefined,
        d1: d1 ? BigInt(d1.toString()) : undefined,
        d2: d2 ? BigInt(d2.toString()) : undefined,
        jf: jf ?? false,

        catatan_a,
        catatan_b,
        catatan_c,
        catatan_d,
        catatan_jf,

        active_year: Number(currentYear),
        created_by: modified_by ? BigInt(modified_by.toString()) : undefined,
      },
      create: {
        id: bigPolicyId,
        policy_id: bigPolicyId,
        active_year: Number(currentYear),
        created_by: modified_by ? BigInt(modified_by.toString()) : undefined,

        a1: a1 ? BigInt(a1.toString()) : undefined,
        a2: a2 ? BigInt(a2.toString()) : undefined,
        a3: a3 ? BigInt(a3.toString()) : undefined,
        b1: b1 ? BigInt(b1.toString()) : undefined,
        b2: b2 ? BigInt(b2.toString()) : undefined,
        b3: b3 ? BigInt(b3.toString()) : undefined,
        c1: c1 ? BigInt(c1.toString()) : undefined,
        c2: c2 ? BigInt(c2.toString()) : undefined,
        c3: c3 ? BigInt(c3.toString()) : undefined,
        d1: d1 ? BigInt(d1.toString()) : undefined,
        d2: d2 ? BigInt(d2.toString()) : undefined,
        jf: jf ?? false,

        catatan_a,
        catatan_b,
        catatan_c,
        catatan_d,
        catatan_jf,
      },
    });

    return res.status(200).json({ message: 'Data berhasil disimpan' });
  } catch (error: any) {
    console.error('❌ Gagal:', error);
    if (error.code === 'P2011') {
      return res.status(400).json({
        message: 'Validasi gagal atau ID tidak valid',
        error: error.message,
      });
    }
    return res.status(500).json({
      message: 'Terjadi kesalahan saat menyimpan',
      error: error.message,
    });
  }
}