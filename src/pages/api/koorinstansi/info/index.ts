import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { koor_instansi_id } = req.query;

    // Validasi: koor_instansi_id harus ada
    if (!koor_instansi_id) {
      return res.status(400).json({
        error: 'koor_instansi_id harus disertakan',
      });
    }

    try {
      // Ambil langsung data yang dibutuhkan
      const record = await prisma.koor_instansi_analis.findFirst({
        where: {
          koor_instansi_id: BigInt(koor_instansi_id as string),
        },
        select: {
          koor_instansi_id: true,
          analis_instansi_id: true,
        },
      });

      if (!record) {
        return res.status(404).json({
          error: 'Data tidak ditemukan untuk koor_instansi_id ini',
        });
      }

      // Ambil agency_id dari tabel user berdasarkan koor_instansi_id
      const user = await prisma.user.findUnique({
        where: {
          id: record.koor_instansi_id ?? undefined,
        },
        select: {
          id: true,
          agency_id: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: 'User tidak ditemukan',
        });
      }

      // Gabungkan hasil sesuai format yang diinginkan
      const result = {
        koor_instansi_id: serializeBigInt({ value: record.koor_instansi_id }),
        analis_instansi_id: record.analis_instansi_id !== null ? serializeBigInt({ value: record.analis_instansi_id }).value : null,
        agency_id: user.agency_id !== null ? serializeBigInt({ value: user.agency_id }).value : null,
        user_id: serializeBigInt({ value: user.id }),
      };

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Gagal mengambil data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}