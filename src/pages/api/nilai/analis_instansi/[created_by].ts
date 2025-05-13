import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { created_by } = req.query;

  const createdById = parseInt(created_by as string);
  if (isNaN(createdById)) {
    return res.status(400).json({ error: '`created_by` must be a valid number' });
  }

  try {
    const scores = await prisma.ikk_ki_score.findMany({
      where: { created_by: createdById },
      select: {
        id: true,
        a_total_score: true,
        b_total_score: true,
        c_total_score: true,
        d_total_score: true,
      },
    });

    return res.status(200).json({ data: serializeBigInt({ scores }) } );
  } catch (error) {
    console.error('Error fetching scores:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
