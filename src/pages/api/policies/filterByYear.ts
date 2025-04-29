import prisma from '@/lib/prisma'  // asumsi kamu sudah setup Prisma Client
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { tahunAwal, tahunAkhir } = req.query;

    if (!tahunAwal || !tahunAkhir) {
      return res.status(400).json({ message: 'Tahun awal dan tahun akhir diperlukan' });
    }

    const startDate = new Date(Number(tahunAwal), 0, 1); // 1 Januari tahunAwal
    const endDate = new Date(Number(tahunAkhir), 11, 31, 23, 59, 59); // 31 Desember tahunAkhir

    const policies = await prisma.policies.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return res.status(200).json(policies);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
