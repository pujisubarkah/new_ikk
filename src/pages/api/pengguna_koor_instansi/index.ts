import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { koordinator_instansi_id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!koordinator_instansi_id) {
    return res.status(400).json({ message: "koordinator_instansi_id is required" });
  }

  try {
    // Ambil nama koordinator instansi dulu
    const koordinator = await prisma.user.findUnique({
      where: {
        id: BigInt(koordinator_instansi_id as string),
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!koordinator) {
      return res.status(404).json({ message: "Koordinator instansi tidak ditemukan." });
    }

    // Ambil list admin instansi di bawah koordinator_instansi_id
    const adminInstansis = await prisma.koordinator_instansi_admin_instansi.findMany({
      where: {
        koordinator_instansi_id: BigInt(koordinator_instansi_id as string),
      },
      select: {
        admin_instansi_id: true,
        user_koordinator_instansi_admin_instansi_admin_instansi_idTouser: {
          select: {
            name: true,
            username: true,
            agency_id: true,
            agencies: {
              select: {
                name: true,
              },
            }
          },
        },
      },
    });

    const admins = adminInstansis.map((item) => ({
      admin_instansi_id: item.admin_instansi_id?.toString() || null,
      name: item.user_koordinator_instansi_admin_instansi_admin_instansi_idTouser?.name || null,
      nip: item.user_koordinator_instansi_admin_instansi_admin_instansi_idTouser?.username || null,
      instansi: item.user_koordinator_instansi_admin_instansi_admin_instansi_idTouser?.agencies?.name || null,
    }));

    return res.status(200).json({
      koordinator: {
        id: koordinator.id.toString(),
        name: koordinator.name,
      },
      admins: admins,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data admin instansi." });
  }
}

