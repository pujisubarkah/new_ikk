import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const groupedPolicies = await prisma.policy.groupBy({
        by: ["agency_id_panrb"],
        where: {
          active_year: 2025,
          policy_status: "MENUNGGU_VALIDASI_KU",
        },
        _count: {
          _all: true,
        },
        // Tambahkan field tambahan seperti validated_by per group
        _max: {
          validated_by: true,
        },
      });

      // Enrich data dengan nama instansi dan nama user (validasi)
      const enriched = await Promise.all(
        groupedPolicies.map(async (group) => {
          const instansi = await prisma.instansi.findUnique({
            where: { agency_id: group.agency_id_panrb ?? undefined },
            select: { agency_name: true },
          });

          let validatorName = null;
          if (group._max.validated_by) {
            const validator = await prisma.user.findUnique({
              where: { id: group._max.validated_by },
              select: { name: true },
            });
            validatorName = validator?.name || "-";
          }

          return serializeBigInt({
            agency_id_panrb: group.agency_id_panrb,
            instansi: instansi?.agency_name || "-",
            total_kebijakan: group._count._all,
            validated_by: group._max.validated_by,
            validator_name: validatorName,
          });
        })
      );

      return res.status(200).json(enriched);
    } catch (error) {
      console.error("Error in group by agency_id_panrb:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
