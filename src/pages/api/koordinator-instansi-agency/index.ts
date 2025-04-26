import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { koordinator_instansi_id } = req.query;

    if (!koordinator_instansi_id) {
      return res.status(400).json({ message: 'Missing required query parameter: koordinator_instansi_id' });
    }

    try {
      const rawData = await prisma.koordinator_instansi_agency.findMany({
        where: {
          koordinator_instansi_id: BigInt(koordinator_instansi_id as string),
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
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              coordinator_type_id: true,
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
          nama_instansi : item.agencies?.name ?? null,
          category: item.agencies?.category ?? null,
          policies: item.agencies?.policies.map(p => ({
            id: p.id.toString(),
            name: p.name,
            tanggal_diajukan : p.sent_by_admin_at,
          })) ?? [],
          Total_kebijakan : item.agencies?.policies?.length ?? 0,
        },
      
      }));

      res.status(200).json(data);

    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch data', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

