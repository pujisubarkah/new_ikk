import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema untuk validasi input
const SaveScoreSchema = z.object({
  policy_id: z.union([z.string(), z.number()]),
  active_year: z.union([z.string(), z.number()]).optional(),

  // Jawaban per soal
  a1: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  a2: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  a3: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  b1: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  b2: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  b3: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  c1: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  c2: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  c3: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  d1: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  d2: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  jf: z.boolean().optional(),

  // Catatan dimensi
  informasi_a: z.string().optional(),
  informasi_b: z.string().optional(),
  informasi_c: z.string().optional(),
  informasi_d: z.string().optional(),
  informasi_jf: z.string().optional(),

  // File pendukung
  ikk_file: z
    .object({
      file_url_a1: z.string().optional(),
      file_url_a2: z.string().optional(),
      file_url_a3: z.string().optional(),
      file_url_b1: z.string().optional(),
      file_url_b2: z.string().optional(),
      file_url_b3: z.string().optional(),
      file_url_c1: z.string().optional(),
      file_url_c2: z.string().optional(),
      file_url_c3: z.string().optional(),
      file_url_d1: z.string().optional(),
      file_url_d2: z.string().optional(),
      file_url_jf: z.string().optional(),
    })
    .optional(),

  // User info
  created_by: z.string().optional(),
  modified_by: z.string().optional(),
});

type SaveScoreInput = z.infer<typeof SaveScoreSchema>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  let parsed;
  try {
    parsed = SaveScoreSchema.parse(req.body);
  } catch (err: any) {
    console.error('❌ Validasi gagal:', err.errors);
    return res.status(400).json({
      message: 'Validasi input gagal',
      errors: err.errors,
      received: process.env.NODE_ENV === 'development' ? req.body : undefined,
    });
  }

  const {
    policy_id,
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
    informasi_a,
    informasi_b,
    informasi_c,
    informasi_d,
    informasi_jf,
    ikk_file,
    created_by,
    modified_by,
  } = parsed;

  const bigPolicyId = BigInt(policy_id);
  const bigCreatedBy = created_by ? BigInt(created_by) : undefined;
  const bigModifiedBy = modified_by ? BigInt(modified_by) : undefined;

  try {
    // Helper untuk parsing nilai score
    const parseScore = (val: any): bigint | undefined => {
      if (val === null || val === '' || val === undefined) return undefined;
      return BigInt(val);
    };

    // Update jawaban dan catatan
    const updateScore: any = {
      ...(parseScore(a1) && { a1: parseScore(a1) }),
      ...(parseScore(a2) && { a2: parseScore(a2) }),
      ...(parseScore(a3) && { a3: parseScore(a3) }),
      ...(parseScore(b1) && { b1: parseScore(b1) }),
      ...(parseScore(b2) && { b2: parseScore(b2) }),
      ...(parseScore(b3) && { b3: parseScore(b3) }),
      ...(parseScore(c1) && { c1: parseScore(c1) }),
      ...(parseScore(c2) && { c2: parseScore(c2) }),
      ...(parseScore(c3) && { c3: parseScore(c3) }),
      ...(parseScore(d1) && { d1: parseScore(d1) }),
      ...(parseScore(d2) && { d2: parseScore(d2) }),
      ...(jf !== undefined && { jf: jf }),

      // Hanya simpan catatan jika bernilai
      ...(typeof informasi_a === 'string' && informasi_a.trim() !== '' && { informasi_a: informasi_a.trim() }),
      ...(typeof informasi_b === 'string' && informasi_b.trim() !== '' && { informasi_b: informasi_b.trim() }),
      ...(typeof informasi_c === 'string' && informasi_c.trim() !== '' && { informasi_c: informasi_c.trim() }),
      ...(typeof informasi_d === 'string' && informasi_d.trim() !== '' && { informasi_d: informasi_d.trim() }),
      ...(typeof informasi_jf === 'string' && informasi_jf.trim() !== '' && { informasi_jf: informasi_jf.trim() }),

      // Audit log
      ...(bigModifiedBy && { modified_by: bigModifiedBy }),
      ...(bigCreatedBy && { created_by: bigCreatedBy }),
    };

    // Upsert ke tabel jawaban
    await prisma.ikk_ki_score.upsert({
      where: { id: bigPolicyId },
      update: updateScore,
      create: {
        id: bigPolicyId,
        policy_id: bigPolicyId,
        ...updateScore,
      },
    });

    // Upsert file pendukung (jika tersedia)
    if (ikk_file && Object.keys(ikk_file).length > 0) {
      await prisma.ikk_file.upsert({
        where: { id: bigPolicyId },
        update: {
          ...Object.fromEntries(
            Object.entries(ikk_file).filter(([, v]) => v !== undefined && v !== '')
          ),
        },
        create: {
          id: bigPolicyId,
          iki_score_id: bigPolicyId,
          ...Object.fromEntries(
            Object.entries(ikk_file).filter(([, v]) => v !== undefined && v !== '')
          ),
          created_by: bigCreatedBy,
        },
      });
    }

    return res.status(200).json({ message: 'Data berhasil disimpan' });
  } catch (error: any) {
    console.error('❌ Gagal menyimpan ke database:', error.message);
    return res.status(500).json({ message: 'Gagal menyimpan jawaban', error: error.message });
  }
}