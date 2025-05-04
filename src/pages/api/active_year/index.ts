import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const active_years = await prisma.active_year.findMany({
      select: {
        id: true,
        active_year: true,  
        },
    })

    // Pakai serializeBigInt untuk handle BigInt
    const serializedActiveYear = JSON.parse(JSON.stringify(active_years.map((active_year: Record<string, unknown>) => serializeBigInt(active_year))))

    res.status(200).json(serializedActiveYear)
  } catch (error) {
    console.error('Error fetching agencies:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
