
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

      // Validasi koor_instansi_id dan name kebijakan
      if (!koor_instansi_id || !name) {
        return res.status(400).json({ message: 'koor_instansi_id dan name kebijakan wajib diisi' })
      }

      // Buat atau ambil policy_process berdasarkan nama policy_process
      const policyProcess = await prisma.policy_process.upsert({
        where: { id: parseInt(policy_process_name) }, // Cek apakah ada policy process dengan ID tersebut
        update: {}, // Jika ada, tidak ada update yang dilakukan
        create: { id: parseInt(policy_process_name), name: policy_process_name }, // Jika tidak ada, buat baru
      })

      // Buat kebijakan baru
      const newPolicy = await prisma.policies.create({
        data: {
          name, // Nama kebijakan
          koor_instansi_id: BigInt(koor_instansi_id), // ID koordinator instansi
          policy_process_id: policyProcess.id, // ID process kebijakan yang telah dibuat
          policy_details: {
            create: {
              id: undefined, // Let Prisma auto-generate the ID
              sector, // Sektor terkait dengan kebijakan
              effective_date: effective_date ? new Date(effective_date) : undefined, // Tanggal efektif, jika ada
              progress, // Progress kebijakan
              file_original_name, // Nama file asli yang terkait dengan kebijakan
              base_score, // Nilai dasar kebijakan
            },
          },
        },
      })

      // Kembalikan response dengan status 201 dan data kebijakan baru
      return res.status(201).json({ message: 'Kebijakan berhasil dibuat', policy: newPolicy })
    } catch (error) {
      console.error('Error creating policy:', error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    // Jika bukan metode POST
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
}


