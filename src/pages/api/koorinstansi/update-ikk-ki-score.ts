import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const FileSchema = z.object({
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
});

const ScoreSchema = z.object({
  policy_id: z.union([z.string(), z.number()]),
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
  informasi_a: z.string().optional(),
  informasi_b: z.string().optional(),
  informasi_c: z.string().optional(),
  informasi_d: z.string().optional(),
  informasi_jf: z.string().optional(),
  approved_by: z.string().optional(),
  approval_status: z.enum(['disetujui', 'ditolak']).optional(),
  modified_by: z.string().optional(),
  ikk_file: FileSchema.optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  let parsed;
  try {
    parsed = ScoreSchema.parse(req.body);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      console.error('❌ Validasi gagal:', err.errors);
      return res.status(400).json({
        message: 'Validasi input gagal',
        issues: err.errors,
        received: req.body,
      });
    }
    console.error('❌ Validasi gagal:', err);
    return res.status(400).json({ message: 'Validasi input gagal' });
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
    modified_by,
  } = parsed;

  try {
    const bigPolicyId = BigInt(policy_id);
    const bigModifiedBy = modified_by ? BigInt(modified_by) : undefined;
    const data = await prisma.ikk_ki_score.update({
      where: { id: bigPolicyId },
      data: {
        a1: a1 ? BigInt(a1) : undefined,
        a2: a2 ? BigInt(a2) : undefined,
        a3: a3 ? BigInt(a3) : undefined,
        b1: b1 ? BigInt(b1) : undefined,
        b2: b2 ? BigInt(b2) : undefined,
        b3: b3 ? BigInt(b3) : undefined,
        c1: c1 ? BigInt(c1) : undefined,
        c2: c2 ? BigInt(c2) : undefined,
        c3: c3 ? BigInt(c3) : undefined,
        d1: d1 ? BigInt(d1) : undefined,
        d2: d2 ? BigInt(d2) : undefined,
        jf: jf ?? null,

        informasi_a,
        informasi_b,
        informasi_c,
        informasi_d,
        informasi_jf,

        modified_by: bigModifiedBy,

        ikk_file: undefined, // Remove nested update here; handle ikk_file update separately below if needed
      },
      // No include needed unless you want to include valid relations
    });

    return res.status(200).json({ message: 'Data berhasil diperbarui', data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Gagal menyimpan ke database:', error);
      return res.status(500).json({ message: 'Gagal memperbarui data' });
    }
    console.error('❌ Gagal menyimpan ke database:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan' });
  }
}