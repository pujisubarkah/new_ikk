import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { validator_id } = req.query;

    if (!validator_id || typeof validator_id !== 'string') {
      return res.status(400).json({ error: 'validator_id is required' });
    }

    try {
      const rawData = await prisma.koor_instansi_validator.findMany({
        where: {
          validator_id: BigInt(validator_id),
        },
        include: {
          user_koor_instansi_validator_koor_instansi_idTouser: {
            select: {
              id: true,
              name: true,
              username: true,
              work_unit: true,
              agency_id: true,
              agencies: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      const result = {
        validator_id: validator_id.toString(),
        koor_instansi: rawData.map((item) => {
          const user = item.user_koor_instansi_validator_koor_instansi_idTouser;
          return {
            id: user?.id?.toString(),
            nama: user?.name,
            nip: user?.username,
            unit_kerja: user?.work_unit,
            agency_id: user?.agency_id?.toString() ?? null,
            instansi: user?.agencies?.name ?? null,
          };
        }),
      };

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching filtered validator data:', error);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
