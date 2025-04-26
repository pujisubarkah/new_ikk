import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    if (!id) {
      return res.status(400).json({ error: 'Parameter id is required' });
    }

    try {
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'Invalid ID parameter' });
      }

      const koordinatorId = BigInt(id as string);
      console.log('Fetching data for koordinator_utama_id:', koordinatorId);

      const data = await prisma.koordinator_utama_koordinator_instansi.findMany({
        where: {
          koordinator_utama_id: koordinatorId,
        },
        include: {
          user_koordinator_utama_koordinator_instansi_koordinator_instansi_idTouser: {
            select: {
              name: true,
              username: true,
              work_unit: true,
              coordinator_type_id: true,
              coordinator_types: true,
            },
          },
        },
      });

      console.log('Fetched data:', data);

      const serializedData: Record<string, unknown>[] = data.map(item => {
        const user = item.user_koordinator_utama_koordinator_instansi_koordinator_instansi_idTouser;
        return user ? {
          coordinator_instansi_id: item.koordinator_instansi_id,
          name: user.name,
          username: user.username,
          work_unit: user.work_unit,
          coordinator_type_id: user.coordinator_type_id,
          coordinator_type_name: user.coordinator_types && typeof user.coordinator_types === 'object' && 'name' in (user.coordinator_types as { name: string }) ? (user.coordinator_types as { name: string }).name : null,
        } : {
          coordinator_instansi_id: item.koordinator_instansi_id,
          name: null,
          username: null,
          work_unit: null,
          coordinator_type_id: null,
          coordinator_type_name: null,
        };
      });

      const serializedResponse = serializedData.map(item => serializeBigInt(item));

      res.status(200).json(serializedResponse);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
