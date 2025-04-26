import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { serializeBigInt } from '@/lib/serializeBigInt'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const agencies = await prisma.agencies.findMany({
      select: {
        id: true,
        name: true,
        category: true,
      },
    })

    // Pakai serializeBigInt untuk handle BigInt
    const serializedAgencies = agencies.map(agency => serializeBigInt(agency))

    res.status(200).json(serializedAgencies)
  } catch (error) {
    console.error('Error fetching agencies:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
