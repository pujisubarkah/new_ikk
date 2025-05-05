import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { serializeBigInt } from "@/lib/serializeBigInt"; 

const prisma = new PrismaClient();

// Type untuk data dari Prisma
type PolicyData = {
  user_koordinator_instansi_admin_instansi_admin_instansi_idTouser?: {
    name?: string;
    username?: string;
    agency_id?: bigint | number | string;
    agencies?: {
      name?: string;
      policies?: {
        id: string;
        name: string;
        policy_details?: {
          progress?: number;
          effective_date?: string;
        };
        policy_process?: {
          name?: string;
        };
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
    const policies = user?.agencies?.policies || [];

    policies.forEach(policy => {
      const processName = policy.policy_process?.name || 'UNKNOWN';
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
    const { admin_instansi_id } = req.query;

    if (!admin_instansi_id) {
      return res.status(400).json({ error: "admin_instansi_id is required" });
    }

    const rawRecords = await prisma.koordinator_instansi_admin_instansi.findMany({
      where: {
        admin_instansi_id: BigInt(admin_instansi_id as string),
      },
      select: {
        id: true,
        admin_instansi_id: true,
        koordinator_instansi_id: true,
        user_koordinator_instansi_admin_instansi_admin_instansi_idTouser: {
          select: {
            name: true,
            username: true,
            agency_id: true,
            agencies: {
              select: {
                name: true,
                policies: {
                  select: {
                    id: true,
                    name: true,
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
                  },
                },
              },
            },
          },
        },
      },
    });

    const records = rawRecords.map(record => serializeBigInt(record)) as PolicyData[];
    const policyProcessCounts = countPolicyProcessNames(records);

    const formattedPolicies: FormattedPolicy[] = records.flatMap(item => {
      const user = item.user_koordinator_instansi_admin_instansi_admin_instansi_idTouser;
      const policies = user?.agencies?.policies || [];

      return policies.map(policy => ({
        id: policy.id,
        nama: policy.name,
        sektor: "Umum",
        tanggal_berlaku: policy.policy_details?.effective_date || "-",
        file: "-",
        enumerator: "-",
        progress: (policy.policy_details?.progress ?? "-") + "%",
        tanggalAssign: "-",
        nilai: "-",
        status: policy.policy_process?.name || "UNKNOWN",
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
