import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const activeYear = req.query.active_year 
        ? BigInt(req.query.active_year as string)
        : BigInt(2025)

      const users = await prisma.user.findMany({
        where: {
          status: 'aktif',
          active_year: activeYear,
          role_user: {
            role_id: BigInt(2)
          }
        },
        select: {
          id: true,
          name: true
        },
        orderBy: {
          name: 'asc'
        }
      })

      const mappedUsers = users.map(user => ({
        id: user.id.toString(),
        name: user.name
      }))

      return res.status(200).json(mappedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
