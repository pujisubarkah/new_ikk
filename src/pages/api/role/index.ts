// pages/api/role/index.ts
import { NextApiRequest, NextApiResponse } from "next"
import prisma from '@/lib/prisma';

interface Role {
  id: bigint;
  created_by: bigint | null;
  modified_by: bigint | null;
  [key: string]: unknown; // Include other fields dynamically if needed
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {
    const rolesRaw: Role[] = await prisma.role.findMany()

    // Konversi BigInt ke string
    const roles = rolesRaw.map((role: Role) => ({
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
