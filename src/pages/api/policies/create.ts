import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Ambil data dari body request
      const {
        koor_instansi_id,
        name,
        sector,
        effective_date,
        progress,
        file_original_name,
        base_score,
        policy_process_name
      } = req.body

      // Validasi input
      if (!koor_instansi_id || !name) {
        return res.status(400).json({ message: 'koor_instansi_id dan name kebijakan wajib diisi' })
      }

      // Upsert policy_process
      const policyProcess = await prisma.policy_process.upsert({
        where: { id: parseInt(policy_process_name) }, // Ensure `id` is used as the unique identifier
        update: {},
        create: { name: policy_process_name },
      })

      // Buat kebijakan baru
      const newPolicy = await prisma.policies.create({
        data: {
          name,
          koor_instansi_id: BigInt(koor_instansi_id), // ✅ Ditambahkan
          policy_process_id: policyProcess.id,
          policy_details: {
            create: {
              sector,
              effective_date: effective_date ? new Date(effective_date) : undefined,
              progress,
              file_original_name,
              base_score: base_score ? parseFloat(base_score) : undefined, // Pastikan tipe float
            },
          },
        },
        include: {
          policy_details: true, // Opsional: untuk melihat detail langsung di response
        },
      })

      return res.status(201).json({ message: 'Kebijakan berhasil dibuat', policy: newPolicy })
    } catch (error) {
      console.error('Error creating policy:', error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
}