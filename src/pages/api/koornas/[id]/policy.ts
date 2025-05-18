import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

type SummaryEntry = {
  agency_id_panrb: bigint | null;
  agency_name: string | null;
  total: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      if (!id) {
        return res.status(400).json({
          message: "ID koor_nasional wajib diisi",
        });
      }

      const results = await prisma.koor_instansi_validator.findMany({
        where: {
          koor_nasional_id: BigInt(id as string),
        },
        select: {
          user_koor_instansi_validator_koor_instansi_idTouser: {
            select: {
              policy_policy_assigned_by_admin_idTouser: {
                select: {
                  agency_id_panrb: true,
                  policy_status: true,
                  instansi: {
                    select: {
                      agency_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Ambil kebijakan yang sedang diverifikasi
      const filteredPolicies = results.flatMap(item =>
        item.user_koor_instansi_validator_koor_instansi_idTouser?.policy_policy_assigned_by_admin_idTouser || []
      ).filter(policy => policy.policy_status === "SEDANG_VERIFIKASI");

      // Group by agency_id_panrb + agency_name dan hitung jumlahnya
      const summaryMap = new Map<string, SummaryEntry>();

      for (const policy of filteredPolicies) {
        const key = `${policy.agency_id_panrb}-${policy.instansi?.agency_name}`;
        const existing = summaryMap.get(key);

        if (existing) {
          existing.total += 1;
        } else {
          summaryMap.set(key, {
            agency_id_panrb: policy.agency_id_panrb,
            agency_name: policy.instansi?.agency_name ?? null,
            total: 1,
          });
        }
      }

      const summary = Array.from(summaryMap.values());

      return res.status(200).json(serializeBigInt({ data: summary }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("API Error:", error.message);
        return res.status(500).json({
          success: false,
          message: "Terjadi kesalahan server: " + error.message,
        });
      } else {
        console.error("API Error unknown:", error);
        return res.status(500).json({
          success: false,
          message: "Terjadi kesalahan server yang tidak diketahui",
        });
      }
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
