import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function untuk serialize BigInt
const serializeBigIntInData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => serializeBigIntInData(item));
  } else if (data !== null && typeof data === 'object') {
    const serializedData: any = {};
    for (const [key, value] of Object.entries(data)) {
      serializedData[key] = typeof value === 'bigint' ? value.toString() : serializeBigIntInData(value);
    }
    return serializedData;
  }
  return data;
};

// Function untuk menghitung policy_process.name
const countPolicyProcessNames = (data: any[]) => {
  const counts: Record<string, number> = {};

  data.forEach(record => {
    const policies = record.user_koordinator_instansi_admin_instansi_admin_instansi_idTouser?.agencies?.policies || [];
    policies.forEach((policy: any) => {
      const processName = policy.policy_process?.name || 'UNKNOWN';
      counts[processName] = (counts[processName] || 0) + 1;
    });
  });

  return counts;
};

export async function getKoordinatorInstansiAdminInstansi(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { admin_instansi_id } = req.query;

    if (!admin_instansi_id) {
      return res.status(400).json({ error: "admin_instansi_id is required" });
    }

    const records = await prisma.koordinator_instansi_admin_instansi.findMany({
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

    const serializedRecords = serializeBigIntInData(records);
    const policyProcessCounts = countPolicyProcessNames(serializedRecords);

    res.status(200).json({ 
      data: serializedRecords, 
      policyProcessCounts 
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

// Default API Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await getKoordinatorInstansiAdminInstansi(req, res);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}


