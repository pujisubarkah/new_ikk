import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { koordinator_instansi_id } = req.query;

    if (!koordinator_instansi_id) {
      return res.status(400).json({ message: "koordinator_instansi_id is required" });
    }

    // 1. Ambil semua policies + agency_id + policy_process.name
    const policies = await prisma.policies.findMany({
      select: {
        agency_id: true,
        policy_process: {
          select: {
            name: true,
          },
        },
      },
    });

    // 2. Hitung jumlah policies per agency_id dan per policy_process.name
    const policyCounts: { [key: string]: { total: number; names: { [key: string]: number } } } = {};

    policies.forEach(policy => {
      const agencyId = policy.agency_id?.toString();
      const processName = policy.policy_process?.name || "Unknown";

      if (agencyId) {
        if (!policyCounts[agencyId]) {
          policyCounts[agencyId] = { total: 0, names: {} };
        }

        // Increment total count for the agency
        policyCounts[agencyId].total += 1;

        // Increment count for the specific process name
        if (!policyCounts[agencyId].names[processName]) {
          policyCounts[agencyId].names[processName] = 0;
        }
        policyCounts[agencyId].names[processName] += 1;
      }
    });

    const agencyIds = Object.keys(policyCounts).map(id => BigInt(id));

    // 3. Mapping ke koordinator_instansi_agency
    const mappings = await prisma.koordinator_instansi_agency.findMany({
      where: {
        agency_id: {
          in: agencyIds,
        },
        koordinator_instansi_id: BigInt(koordinator_instansi_id as string),
      },
      select: {
        agency_id: true,
        koordinator_instansi_id: true,
        agencies: {
          select: {
            name: true,
          },
        },
      },
    });

    // 4. Grouping berdasarkan koordinator_instansi_id
    const groupedData: {
      [key: string]: {
        koordinator_instansi_id: string;
        agencies: { name: string | null; total: number; names: { [key: string]: number } }[];  // Menambahkan agencies tanpa verifiedByKoordinatorAt
        totalProses: number;
        totalDisetujui: number;
        totalDitolak: number;
        totalKebijakanMasuk: number;
      };
    } = {};

    mappings.forEach(mapping => {
      const koordinatorId = mapping.koordinator_instansi_id?.toString() ?? "unknown";
      const agencyId = mapping.agency_id?.toString() ?? "unknown";
      const agencyName = mapping.agencies?.name ?? null;

      if (!groupedData[koordinatorId]) {
        groupedData[koordinatorId] = {
          koordinator_instansi_id: koordinatorId,
          agencies: [],
          totalProses: 0,
          totalDisetujui: 0,
          totalDitolak: 0,
          totalKebijakanMasuk: 0,  // Inisialisasi total kebijakan masuk
        };
      }

      const agencyData = {
        name: agencyName,
        total: policyCounts[agencyId]?.total || 0,
        names: policyCounts[agencyId]?.names || {},
      };

      // Add agency data to the grouped data
      groupedData[koordinatorId].agencies.push(agencyData);

      // Sum totals for each policy process type across all agencies
      groupedData[koordinatorId].totalProses += agencyData.names["PROSES"] || 0;
      groupedData[koordinatorId].totalDisetujui += agencyData.names["DISETUJUI"] || 0;
      groupedData[koordinatorId].totalDitolak += agencyData.names["DITOLAK"] || 0;

      // Sum total kebijakan masuk (all policies, regardless of status)
      groupedData[koordinatorId].totalKebijakanMasuk += agencyData.total;
    });

    const result = Object.values(groupedData);

    return res.status(200).json(serializeBigInt({ data: result }));
  } catch (error) {
    console.error("[KOORDINATOR_AGENCY_GET_ERROR]", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
