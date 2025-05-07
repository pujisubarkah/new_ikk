import { NextApiRequest, NextApiResponse } from "next";
import { serializeBigInt } from "@/lib/serializeBigInt"; 
import prisma from "@/lib/prisma";

// Type untuk data dari Prisma
type PolicyData = {
  user_koordinator_instansi_admin_instansi_admin_instansi_idTouser?: {
    name?: string;
    username?: string;
    agency_id?: bigint | number | string;
    agencies?: {
      name?: string;
      policy?: {
        enumerator_id: bigint | number | string | null;
        user_policy_enumerator_idTouser: { name: string | null } | null; 
        name: string; 
        assigned_by_admin_at: Date | null; 
        effective_date: Date | null; 
        progress: number | null;
        policy_process: string | null;
        policy_status: string | null;
        sector: string | null;
        type: string | null;
        file_url: string | null;
        id: string | number;
        is_valid: boolean;
      }[];
    };
  };
};

// Type untuk hasil formatted policy
type FormattedPolicy = {
  id: string;
  nama: string;
  sektor: string;
  tanggal_berlaku: string;
  file: string;
  enumerator_id: string;
  enumerator: string;
  progress: string;
  tanggalAssign: string;
  nilai: string;
  status: string;
};

// Fungsi untuk menghitung jumlah status proses kebijakan
const countPolicyProcessNames = (data: PolicyData[]) => {
  const counts: Record<string, number> = {};

  data.forEach(item => {
    const user = item.user_koordinator_instansi_admin_instansi_admin_instansi_idTouser;
    const policies = user?.agencies?.policy || [];

    policies.forEach(policy => {
      const processName = policy.policy_process || 'UNKNOWN';
      counts[processName] = (counts[processName] || 0) + 1;
    });
  });

  return counts;
};

export async function getKoordinatorInstansiAdminInstansi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

    const { koor_instansi_id } = req.query;

    if (!koor_instansi_id || isNaN(Number(koor_instansi_id))) {
      return res.status(400).json({ error: "koor_instansi_id must be a valid number" });
    }

    const rawRecords = await prisma.koor_instansi_validator.findMany({
      where: {
        koor_instansi_id: BigInt(koor_instansi_id as string),
      },
      select: {
        id: true,
        koor_instansi_id: true,
        validator_id: true,
        user_koor_instansi_validator_koor_instansi_idTouser: {
          select: {
            name: true,
            username: true,
            agency_id: true,
            agencies: {
              select: {
                name: true,
                policy: {
                  select: {
                    id: true,
                    name: true,
                    is_valid: true,
                    sector: true,
                    type: true,
                    file_url: true,
                    progress: true,
                    policy_process: true,
                    policy_status: true,
                    effective_date: true,
                    assigned_by_admin_at: true,
                    enumerator_id: true,
                    user_policy_enumerator_idTouser: {
                      select: { 
                        name: true,
                      },
                    },
                },
                },
              },
            },
          },
        },
      },
    });

    const records = rawRecords.map((record: Record<string, unknown>) => serializeBigInt(record)) as PolicyData[];
    const policyProcessCounts = countPolicyProcessNames(records);

    const formattedPolicies: FormattedPolicy[] = records.flatMap(item => {
      const user = item.user_koordinator_instansi_admin_instansi_admin_instansi_idTouser;
      const policies = user?.agencies?.policy || [];

      return policies.map(policy => ({
        id: String(policy.id),
        nama: policy.name,
        sektor: policy.sector || "-",
        tanggal_berlaku: policy.effective_date instanceof Date? policy.effective_date.toISOString(): policy.effective_date || "-",
        file: policy.file_url || "-",
        enumerator_id: String(policy.enumerator_id || "-"),
        enumerator: policy.user_policy_enumerator_idTouser?.name || "-",
        progress: (policy.progress ?? "-") + "%",
        tanggalAssign: policy.assigned_by_admin_at instanceof Date ? policy.assigned_by_admin_at.toISOString() : policy.assigned_by_admin_at || "-",
        nilai: "-",
        status: policy.policy_process || "UNKNOWN",
      }));
    });

    res.status(200).json({
      data: formattedPolicies,
      policyProcessCounts,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

// Default API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await getKoordinatorInstansiAdminInstansi(req, res);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
