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
      const koorId = BigInt(koor_instansi_id as string);

      // Ambil data dari koor_instansi_analis
      const record = await prisma.koor_instansi_analis.findFirst({
        where: {
          koor_instansi_id: koorId,
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

      // Ambil agency_id dari user
      const user = await prisma.user.findUnique({
        where: {
          id: koorId,
        },
        select: {
          id: true,
          agency_id: true,
          agency_id_panrb: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: 'User tidak ditemukan',
        });
      }

      const result = {
        koor_instansi_id: serializeBigInt({ koor_instansi_id: record.koor_instansi_id }),
        agency_id: user.agency_id_panrb ? serializeBigInt({ agency_id_panrb: user.agency_id_panrb }) : null,
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
