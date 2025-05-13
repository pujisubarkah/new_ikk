// pages/api/koorinstansi/instansi/rekap.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const groupedPolicies = await prisma.policy.groupBy({
        by: ['agency_id_panrb'],
        where: {
          active_year: 2025,
          policy_status: "MENUNGGU_VALIDASI_KU",
        },
        _count: {
          _all: true,
        },
      });

      // Ambil juga nama instansinya (opsional)
      const enriched = await Promise.all(
        groupedPolicies.map(async (group) => {
          const instansi = await prisma.instansi.findUnique({
            where: { agency_id: group.agency_id_panrb ?? undefined },
            select: { agency_name: true },
          });

          return serializeBigInt({
            agency_id_panrb: group.agency_id_panrb,
            instansi: instansi?.agency_name || "-",
            total_kebijakan: group._count._all,
          });
        })
      );

      res.status(200).json(enriched);
    } catch (error) {
      console.error("Error in group by agency_id_panrb:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
