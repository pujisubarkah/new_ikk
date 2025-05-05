import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { agency_id } = req.query;

    if (!agency_id) {
      return res.status(400).json({ message: "agency_id is required" });
    }

    const policies = await prisma.policies.findMany({
      where: {
        agencies: {
          id: BigInt(agency_id as string), // Filter berdasarkan agency_id
        },
      },
      select: {
        enumerator_id: true,
        id: true,
        name: true,
        assigned_by_admin_at: true,
        user_policies_enumerator_idTouser: {
          select: { 
            name: true,
          },
        },
        agencies: {
          select: {
            name: true,
            active_year: true,
            instansi: {
              select: {
                agency_id: true,
                agency_name: true,
                },
              },
            },
        },
        policy_details: {
          select: {
            progress: true,
            effective_date: true,
          },
        },
        policy_process: {
          select: {
            name: true,
          },
        },
        // policy_status field has been removed from here
      },
    });

    const serializedPolicies = policies.map((policy: Record<string, unknown>) => serializeBigInt(policy));

    const rowData = serializedPolicies.map((policy: { 
      id: string | number; 
      user_policies_enumerator_idTouser: { name: string | null } | null; 
      name: string; 
      assigned_by_admin_at: Date | null; 
      policy_details: { effective_date: Date | null; progress: number | null } | null; 
      agencies: { active_year: number | null; instansi?:{agency_name: string | null} } | null; 
      policy_process: { name: string | null } | null; 
    }) => ({
      id: policy.id,
      enumerator: policy.user_policies_enumerator_idTouser?.name ?? null,
      name: policy.name,
      tanggal_proses: policy.assigned_by_admin_at ?? null,
      tanggal_berlaku: policy.policy_details?.effective_date ?? null,
      instansi: policy.agencies?.instansi?.agency_name ?? null,
      active_year: policy.agencies?.active_year ?? null,
      progress_pengisian: policy.policy_details?.progress ?? null,
      status_kebijakan: policy.policy_process?.name ?? null,
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
