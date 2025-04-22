import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

function convertBigIntToString(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertBigIntToString(value)])
    )
  } else if (typeof obj === 'bigint') {
    return obj.toString()
  } else {
    return obj
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const coordinatorTypes = await prisma.coordinator_types.findMany()
        return res.status(200).json(convertBigIntToString(coordinatorTypes))
      }

      case 'POST': {
        const { name, created_by } = req.body

        if (!name || typeof name !== 'string') {
          return res.status(400).json({ message: 'Field "name" is required and must be a string.' })
        }

        const newCoordinatorType = await prisma.coordinator_types.create({
          data: {
            id: BigInt(Date.now()),
            name,
            created_by: created_by ? BigInt(created_by) : null,
            created_at: new Date(),
            modified_by: null,
            updated_at: null,
          },
        })

        return res.status(201).json(convertBigIntToString(newCoordinatorType))
      }

      default:
        return res.status(405).json({ message: 'Method Not Allowed' })
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('API error in /coordinator-types:', error.message)
    } else {
      console.error('API error in /coordinator-types:', error)
    }

    if ((error as { code?: string }).code === 'P2002') {
      return res.status(409).json({ message: 'Coordinator type already exists' })
    }

    return res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message || String(error) })
  }
}
