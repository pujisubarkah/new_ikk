import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { koor_instansi_id } = req.query;

    if (!koor_instansi_id || Array.isArray(koor_instansi_id)) {
      return res.status(400).json({ error: 'koor_instansi_id is required as a single query parameter' });
    }

    try {
      const data = await prisma.koor_instansi_analis.findMany({
        where: {
          koor_instansi_id: BigInt(koor_instansi_id),
        },
        include: {
          user_koor_instansi_analis_koor_instansi_idTouser: {
            select: {
              id: true,
              name: true,
              username: true,
              work_unit: true,
              agency_id: true,
              agencies: {
                select: { name: true },
              },
            },
          },
          user_koor_instansi_analis_analis_instansi_idTouser: {
            select: {
              id: true,
              name: true,
              username: true,
              work_unit: true,
              agency_id: true,
              agencies: {
                select: { name: true },
              },
            },
          },
        },
      });

      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'No data found for this koor_instansi_id' });
      }

      const koorUser = data[0]?.user_koor_instansi_analis_koor_instansi_idTouser;

      const koor_instansi = koorUser
        ? {
            id: koorUser.id.toString(),
            name: koorUser.name,
            username: koorUser.username,
            work_unit: koorUser.work_unit,
            agency_id: koorUser.agency_id?.toString() ?? null,
            agency_name: koorUser.agencies?.name ?? null,
          }
        : null;

      const analis_instansi = data
        .map((item) => item.user_koor_instansi_analis_analis_instansi_idTouser)
        .filter(Boolean) // remove null
        .map((analis) => ({
          id: analis!.id.toString(),
          nama: analis!.name,
          nip: analis!.username,
          unit_kerja: analis!.work_unit,
          agency_id: analis!.agency_id?.toString() ?? null,
          agency_name: analis!.agencies?.name ?? null,
        }));

      return res.status(200).json({ koor_instansi, analis_instansi });
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
  }

  // Default for unsupported methods
  return res.status(405).json({ error: 'Method Not Allowed' });
}
