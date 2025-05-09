import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = await prisma.koor_instansi_analis.findMany({
      include: {
        user_koor_instansi_analis_analis_instansi_idTouser: true,
        user_koor_instansi_analis_koor_instansi_idTouser: true,
      },
    });

    res.status(200).json(data.map((item: Record<string, unknown>) => serializeBigInt(item)));
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
