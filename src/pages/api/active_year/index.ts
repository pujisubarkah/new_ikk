import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const active_years = await prisma.active_year.findMany({
        select: {
          id: true,
          active_year: true,  
        },
      });

      // Pakai serializeBigInt untuk handle BigInt
      const serializedActiveYear = JSON.parse(JSON.stringify(active_years.map((active_year: Record<string, unknown>) => serializeBigInt(active_year))));

      return res.status(200).json(serializedActiveYear);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { active_year } = req.body;

      if (!active_year) {
        return res.status(400).json({ message: 'active_year is required' });
      }

      const newActiveYear = await prisma.active_year.create({
        data: {
          active_year
        },
      });

      // Convert BigInt values to strings
      const serializedActiveyear = JSON.parse(
        JSON.stringify(newActiveYear, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )
    );


      return res.status(201).json(serializedActiveyear);
    } catch (error) {
      console.error('Error creating active year:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
