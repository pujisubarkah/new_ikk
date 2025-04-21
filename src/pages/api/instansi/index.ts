import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

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

    // Map agencies and convert BigInt to string
    const agenciesWithStringIds = agencies.map((agency) => ({
      ...agency,
      id: agency.id.toString(), // Convert BigInt to string
    }))

    res.status(200).json(agenciesWithStringIds)
  } catch (error) {
    console.error('Error fetching agencies:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
