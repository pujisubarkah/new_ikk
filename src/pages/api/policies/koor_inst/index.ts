import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { koor_instansi_id } = req.query

  if (!koor_instansi_id) {
    return res.status(400).json({ message: 'koor_instansi_id is required' })
  }

  try {
    const data = await prisma.koor_instansi_analis.findMany({
      where: {
        koor_instansi_id: BigInt(koor_instansi_id as string),
      },
      include: {
        user_koor_instansi_analis_analis_instansi_idTouser: {
          select: {
            name: true,
            agency_id: true,
            agencies: {
              select: {
                name: true,
              },
            },
            policies_policies_analis_instansi_idTouser: {
              select: {
                id: true,
                name: true,
                policy_process: {
                  select: {
                    name: true,
                  },
                },
                policy_details: {
                  select: {
                    sector: true,
                    effective_date: true,
                    progress: true,
                    updated_at: true,
                    file_original_name: true,
                    base_score: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // Olah menjadi rowData
    const rowData = data.flatMap(item => {
      const user = item.user_koor_instansi_analis_analis_instansi_idTouser
      const userName = user?.name || 'N/A'
      const instansi = user?.agencies?.name || 'N/A'

      return user?.policies_policies_analis_instansi_idTouser.map(policy => ({
        nama: userName,
        instansi,
        nama_kebijakan: policy.name,
        progress: policy.policy_details?.progress || null,
        sektor: policy.policy_details?.sector || null,
        tanggal_efektif: policy.policy_details?.effective_date || null,
        status: policy.policy_process?.name || null,
        tanggal_assign: policy.policy_details?.updated_at || null,
        file:policy.policy_details?.file_original_name || null,
        nilai:policy.policy_details?.base_score || null,
      })) || []
    })

// Grouping by status with count and data array
const groupedArray = Object.values(
  rowData.reduce((acc, item) => {
    const status = item.status || 'TIDAK ADA STATUS'
    if (!acc[status]) {
      acc[status] = {
        status,
        jumlah: 0,
        data: []
      }
    }
    acc[status].jumlah += 1
    acc[status].data.push(item)
    return acc
  }, {} as Record<string, { status: string; jumlah: number; data: typeof rowData }>)
)



res.status(200).json(groupedArray)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
