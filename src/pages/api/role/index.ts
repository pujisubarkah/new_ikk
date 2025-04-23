// pages/api/role/index.ts
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {
    const rolesRaw = await prisma.role.findMany()

    // Konversi BigInt ke string
    const roles = rolesRaw.map((role) => ({
      ...role,
      id: role.id.toString(),
      created_by: role.created_by?.toString() ?? null,
      modified_by: role.modified_by?.toString() ?? null,
    }))

    return res.status(200).json(roles)
  } catch (error) {
    console.error("Error fetching roles:", error)
    return res.status(500).json({ error: "Failed to fetch roles" })
  }
}
