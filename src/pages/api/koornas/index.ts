import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { serializeBigInt } from '@/lib/serializeBigInt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const activeYear = req.query.active_year 
        ? BigInt(req.query.active_year as string)
        : BigInt(2025);

      const koordinators = await prisma.koor_instansi_validator.findMany({
        where: {
          user_koor_instansi_validator_koor_instansi_idTouser: {
            status: 'aktif',
            active_year: activeYear
          }
        },
        include: {
          user_koor_instansi_validator_koor_instansi_idTouser: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
              active_year: true,
              instansi: {
                select: {
                  agency_name: true
                }
              }
            }
          },
          user_koor_instansi_validator_koor_nasional_idTouser: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

     const mappedKoordinators = koordinators
  .filter(k => k.user_koor_instansi_validator_koor_instansi_idTouser !== null)
  .map(k =>
    serializeBigInt({
      id: Number(k.koor_instansi_id), // ✅ Gunakan ID dari user
      name: k.user_koor_instansi_validator_koor_instansi_idTouser?.name,
      email: k.user_koor_instansi_validator_koor_instansi_idTouser?.email,
      status: k.user_koor_instansi_validator_koor_instansi_idTouser?.status,
      active_year: k.user_koor_instansi_validator_koor_instansi_idTouser?.active_year,
      instansi: k.user_koor_instansi_validator_koor_instansi_idTouser?.instansi?.agency_name,
      koor_nasional: k.user_koor_instansi_validator_koor_nasional_idTouser
        ? {
            id: Number(k.user_koor_instansi_validator_koor_nasional_idTouser.id),
            name: k.user_koor_instansi_validator_koor_nasional_idTouser.name
          }
        : null
    })
  );

      return res.status(200).json(mappedKoordinators);
    } catch (error) {
      console.error('Error fetching koordinators:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
