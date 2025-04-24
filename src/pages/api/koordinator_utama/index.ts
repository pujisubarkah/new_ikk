"use client";

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
      const data = await prisma.koordinator_utama_koordinator_instansi.findMany({
        where: {
          koordinator_utama_id: BigInt(id as string),
        },
        include: {
          user_koordinator_utama_koordinator_instansi_koordinator_instansi_idTouser: true,
        },
      });

      const serializedData: Record<string, unknown>[] = data.map(item =>
        serializeBigInt(item) as Record<string, unknown>
      );

      res.status(200).json(serializedData);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
