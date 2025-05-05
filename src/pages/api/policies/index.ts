import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const policies = await prisma.policy.findMany({
      select: {
        id: true,
        created_at: true,
        created_by: true,
        validated_by: true,
        name: true,
        is_valid: true,
        sector: true,
        type: true,
        file_url: true,
        policy_status: true,
        policy_process: true,
        progress: true,
        effective_date: true,
        active_year: true,
        agency_id_panrb: true,
        instansi: {
          select: {
            agency_id: true,
            agency_name: true,
            instansi_kategori: {
              select: {
                id: true,
                kat_instansi: true
              }
            }
          }
        },
      },
    })

    // Pakai serializeBigInt untuk handle BigInt
    const serializedPolicies = policies.map((policy: Record<string, unknown>) => serializeBigInt(policy))

    res.status(200).json(serializedPolicies)
  } catch (error) {
    console.error('Error fetching policies:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
