// pages/api/instansi/[agencyId].ts
import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import { serializeBigInt } from "@/lib/serializeBigInt"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Metode tidak diizinkan" })
  }

  const { agencyId } = req.query

  if (!agencyId || Array.isArray(agencyId)) {
    return res.status(400).json({ message: "agencyId tidak valid" })
  }

  try {
    const instansi = await prisma.instansi.findFirst({
      where: {
        agency_id: BigInt(agencyId),
      },
      select: {
        agency_name: true,
        agency_id: true,
      },
    })

    if (!instansi) {
      return res.status(404).json({ message: "Instansi tidak ditemukan" })
    }

    // Ubah struktur response
    const responseData = {
      name: instansi.agency_name,  // Mengubah agency_name menjadi name
      agency_id: instansi.agency_id
    }

    return res.status(200).json(serializeBigInt(responseData))

  } catch (error) {
    console.error("Gagal mengambil instansi:", error)
    return res.status(500).json({ message: "Terjadi kesalahan pada server" })
  }
}