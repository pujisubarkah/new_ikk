import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  const adminId = Number(id);
  if (isNaN(adminId)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  try {
    const result = await prisma.policy.groupBy({
      by: ["policy_process"],
      where: {
        assigned_by_admin_id: adminId,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        policy_process: "asc",
      },
    });

    const summary = result.reduce((acc, curr) => {
      const process = curr.policy_process ?? "Unknown";
      acc[process] = curr._count._all;
      return acc;
    }, {} as Record<string, number>);

    return res.status(200).json(summary);
  } catch (error) {
    console.error("❌ Gagal ambil summary:", error);
    return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data" });
  }
}
