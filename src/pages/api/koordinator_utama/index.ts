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
      const koordinatorId = BigInt(id as string);

      const data = await prisma.koor_nasional_validator.findMany({
        where: {
          koor_nasional_id: koordinatorId,
        },
        include: {
          user_koor_nasional_validator_koor_nasional_idTouser: {
            select: {
              name: true,
              username: true,
              work_unit: true,
              // coordinator_type_id: true, // Removed as it does not exist in the type
              // coordinator_types removed as it does not exist in the type
            },
          },
        },
      });

      const serializedData = data.map((item) => {
        const user = item.user_koor_nasional_validator_koor_nasional_idTouser;

        return {
          id: item.id,
          koor_nasional_id: item.koor_nasional_id,
          validator_id: item.validator_id,
          name: user?.name ?? null,
          username: user?.username ?? null,
          work_unit: user?.work_unit ?? null,
          // coordinator_type_id removed as it does not exist in the type
          // coordinator_type_name removed as it does not exist in the type
        };
      });

      const result = serializedData.map(serializeBigInt);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
