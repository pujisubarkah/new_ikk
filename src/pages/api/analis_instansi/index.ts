import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { koor_instansi_id } = req.query;

  if (!koor_instansi_id || Array.isArray(koor_instansi_id)) {
    return res.status(400).json({ error: 'Invalid koor_instansi_id' });
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
      .filter(Boolean)
      .map((analis) => ({
        id: analis?.id?.toString() ?? '',
        nama: analis?.name ?? '',
        nip: analis?.username ?? '',
        unit_kerja: analis?.work_unit ?? null,
        agency_id: analis?.agency_id?.toString() ?? null,
        agency_name: analis?.agencies?.name ?? null,
      }));

    return res.status(200).json({ koor_instansi, analis_instansi });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Failed to fetch data', detail: error instanceof Error ? error.message : error });
  }
}