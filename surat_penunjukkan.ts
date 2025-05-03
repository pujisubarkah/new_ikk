import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { serializeBigInt } from '@/lib/serializeBigInt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body

    if (!body.file) {
      return res.status(400).json({ error: 'Link file Google Drive wajib diisi' })
    }

    const suratPenunjukkan = await prisma.surat_penunjukkan.create({
      data: {
        file: body.file,
        created_at: new Date(),
      }
    })

    res.status(201).json(serializeBigInt(suratPenunjukkan))
  } catch (error) {
    console.error('Error creating surat penunjukkan:', error)
    res.status(500).json({ error: 'Gagal menyimpan surat penunjukkan' })
  }
}
