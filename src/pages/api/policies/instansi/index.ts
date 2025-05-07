import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { progress } from "framer-motion";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { agency_id } = req.query;

    if (!agency_id) {
      return res.status(400).json({ message: "agency_id is required" });
    }

    const policies = await prisma.policy.findMany({
      where: {
        agencies: {
          id: BigInt(agency_id as string), // Filter berdasarkan agency_id
        },
      },
      select: {
        enumerator_id: true,
        id: true,
        name: true,
        policy_process: true,
        policy_status: true,
        progress: true,
        effective_date: true,
        assigned_by_admin_at: true,
        user_policy_enumerator_idTouser: {
          select: { 
            name: true,
          },
        },
        agencies: {
          select: {
            name: true, // Ambil nama agency terkait
            agency_id_panrb: true, // Ambil agency_id_panrb
            active_year: true, // Ambil tahun aktif
            instansi: { // Pastikan instansi disertakan dalam select
              select: {
                agency_id: true, // Ambil agency_id dari instansi
                agency_name: true, // Ambil nama instansi
              },
            },
          },
        },
      },
    });

    const serializedPolicies = policies.map((policy: Record<string, unknown>) => serializeBigInt(policy));

    const rowData = serializedPolicies.map((policy: { 
      id: string | number; 
      user_policy_enumerator_idTouser: { name: string | null } | null; 
      name: string; 
      assigned_by_admin_at: Date | null; 
      effective_date: Date | null; 
      progress: number | null;
      agencies: { active_year: number | null; instansi?:{agency_name: string | null} } | null; 
      policy_process: string | null;
    }) => ({
      id: policy.id,
      enumerator: policy.user_policy_enumerator_idTouser?.name ?? null,
      name: policy.name,
      tanggal_proses: policy.assigned_by_admin_at ?? null,
      tanggal_berlaku: policy.effective_date ?? null,
      instansi: policy.agencies?.instansi?.agency_name ?? null,
      active_year: policy.agencies?.active_year ?? null,
      progress_pengisian: policy.progress ?? null,
      status_kebijakan: policy.policy_process ?? null,
    }));

    return res.status(200).json(rowData);
  } catch (error) {
    console.error("[POLICY_BY_AGENCY_GET_ERROR]", error);
    return res.status(500).json({ 
      message: "Something went wrong", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}
