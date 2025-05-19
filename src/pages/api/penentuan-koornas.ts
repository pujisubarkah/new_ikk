// pages/api/penentuan-koornas.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan' });
  }

  const { koor_instansi_id, koor_nasional_id } = req.body;

  console.log('Incoming request method:', req.method);
  console.log('Received data:', { koor_instansi_id, koor_nasional_id });

  if (!koor_instansi_id || !koor_nasional_id) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }

  try {
    const [koorInstansi, koorNasional] = await Promise.all([
      prisma.user.findUnique({
        where: { id: BigInt(koor_instansi_id) },
        include: { role_user: true },
      }),
      prisma.user.findUnique({
        where: { id: BigInt(koor_nasional_id) },
        include: { role_user: true },
      }),
    ]);

    if (!koorInstansi) {
      return res.status(404).json({ error: 'Koordinator Instansi tidak ditemukan' });
    }

    if (!koorNasional) {
      return res.status(404).json({ error: 'Koordinator Nasional tidak ditemukan' });
    }

    const koorInstansiRoleId = Number(koorInstansi.role_user?.role_id);
    const koorNasionalRoleId = Number(koorNasional.role_user?.role_id);

    if (koorInstansiRoleId !== 4) {
      return res.status(400).json({ error: 'User bukan Koordinator Instansi' });
    }

    if (koorNasionalRoleId !== 2) {
      return res.status(400).json({ error: 'User bukan Koordinator Nasional' });
    }

    // ✅ Ubah where clause agar pakai koor_instansi_id
    // Cari record unik berdasarkan koor_instansi_id terlebih dahulu
    const existingValidator = await prisma.koor_instansi_validator.findFirst({
      where: {
        koor_instansi_id: BigInt(koor_instansi_id),
      },
    });

    await prisma.koor_instansi_validator.upsert({
      where: {
        id: existingValidator ? existingValidator.id : 0, // gunakan id jika ada, jika tidak pakai 0 (akan trigger create)
      },
      update: {
        koor_nasional_id: BigInt(koor_nasional_id),
      },
      create: {
        koor_instansi_id: BigInt(koor_instansi_id),
        koor_nasional_id: BigInt(koor_nasional_id),
      },
    });

    // ✅ Verifikasi hasil update
    const updatedRecord = await prisma.koor_instansi_validator.findFirst({
      where: {
        koor_instansi_id: BigInt(koor_instansi_id),
      },
    });

    console.log('Data tersimpan:', updatedRecord);

    return res.status(200).json({
      success: true,
      message: 'Koordinator Nasional berhasil ditetapkan',
    });
  } catch (error) {
    console.error('Gagal menetapkan koordinator:', error);
    return res.status(500).json({ error: 'Gagal memproses permintaan' });
  }
}