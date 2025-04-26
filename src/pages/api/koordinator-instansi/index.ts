import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { agency_id } = req.query;

    // Pastikan agency_id ada dalam query
    if (!agency_id) {
      return res.status(400).json({ message: 'Missing required query parameter: agency_id' });
    }

    try {
      // Filter hanya berdasarkan agency_id
      const rawData = await prisma.koordinator_instansi_agency.findMany({
        where: {
          agencies: {
            id: BigInt(agency_id as string),  // Memfilter berdasarkan agency_id
          },
        },
        include: {
          agencies: {
            select: {
              name: true,
              category: true,
              policies: {
                select: {
                  id: true,
                  name: true,
                  sent_by_admin_at: true,
                  processed_by_enumerator_at: true,
                  enumerator_id: true,
                  user_policies_enumerator_idTouser: {
                    select: {
                      name: true,
                    },
                  },
                  policy_details: {
                    select: {
                      progress: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const data = rawData.map(item => ({
        id: item.id.toString(),
        created_at: item.created_at,
        agency_id: item.agency_id ? item.agency_id.toString() : null,
        koordinator_instansi_id: item.koordinator_instansi_id ? item.koordinator_instansi_id.toString() : null,
        agencies: {
          nama_instansi: item.agencies?.name ?? null,
          category: item.agencies?.category ?? null,
          policies: item.agencies?.policies.map(p => ({
            id: p.id.toString(),
            name: p.name,
            tanggal_diajukan: p.sent_by_admin_at,
            progress: p.policy_details?.progress ?? null,
            tanggal_proses: p.processed_by_enumerator_at,
            enumerator_id: p.enumerator_id ? p.enumerator_id.toString() : null,
            enumerator: p.user_policies_enumerator_idTouser?.name ?? null,
          })) ?? [],
          Total_kebijakan: item.agencies?.policies?.length ?? 0,
        },
      }));

      res.status(200).json(data);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch data', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
