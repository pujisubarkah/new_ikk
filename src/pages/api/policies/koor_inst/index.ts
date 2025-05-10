import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { NextApiRequest, NextApiResponse } from 'next';

// Helper function to extract the relevant policy data
const extractPolicyData = (policy: any, agencyName: string) => ({
  policy_id: policy.id,
  nama_kebijakan: policy.name,
  sektor: policy.sector,
  file_url: policy.file_url,
  progress: policy.progress,
  tanggal_assign: policy.assigned_by_admin_at,
  tanggal_berlaku: policy.effective_date,
  instansi: agencyName,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { koordinator_instansi_id } = req.query;

    if (!koordinator_instansi_id) {
      return res.status(400).json({ error: 'Parameter koordinator_instansi_id diperlukan' });
    }

    const idNumber = Number(koordinator_instansi_id);
    if (isNaN(idNumber)) {
      return res.status(400).json({ error: 'Parameter koordinator_instansi_id harus berupa angka' });
    }

    // Query the database to get the relevant data
    const result = await prisma.koor_instansi_analis.findMany({
      where: {
        koor_instansi_id: idNumber,
      },
      select: {
        koor_instansi_id: true,
        analis_instansi_id: true,
        user_koor_instansi_analis_koor_instansi_idTouser: {
          select: {
            name: true,
            policy_policy_created_byTouser: {
              select: {
                id: true,
                name: true,
                sector: true,
                file_url: true,
                policy_process: true,
                progress: true,
                effective_date: true,
                assigned_by_admin_at: true,
                agency_id: true,
                agencies: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        user_koor_instansi_analis_analis_instansi_idTouser: { // Moved outside and corrected
          select: {
            name: true,
          },
        },
      },
    });

    // Log the result from the database
    console.log("Result from database:", result);

    // Create an array of row data
    interface RowData {
      koor_instansi_id: number;
      analis_instansi_id: number;
      enumerator: string;
      policy_id: number;
      nama_kebijakan: string;
      policy_process: string;
      sektor: string;
      file_url: string;
      progress: number;
      tanggal_assign: Date | null;
      tanggal_berlaku: Date | null;
      instansi: string;
    }

    const rowData: RowData[] = [];

    // Map the result to a rowData array
    result.forEach(item => {
      const user = item.user_koor_instansi_analis_koor_instansi_idTouser || null; // Adjusted to use the correct property
      const agencyName = user?.policy_policy_created_byTouser?.[0]?.agencies?.name || '-';

      // The enumerator's name is taken from the user associated with 'analis_instansi_id'
      const enumeratorName = item.user_koor_instansi_analis_analis_instansi_idTouser?.name || '-';

      // Extract policy data for each policy related to the user
      user?.policy_policy_created_byTouser?.forEach((policy: any) => {
        rowData.push({
          koor_instansi_id: item.koor_instansi_id ? Number(item.koor_instansi_id) : 0,
          analis_instansi_id: item.analis_instansi_id ? Number(item.analis_instansi_id) : 0,
          enumerator: enumeratorName, // Set enumerator as user.name
          policy_process: policy.policy_process || '',
          ...extractPolicyData(policy, agencyName),
        });
      });
    });

    // Serialize the result and send the response
    const serializedResult = rowData.map(item => serializeBigInt(item as unknown as Record<string, unknown>));
    return res.status(200).json(serializedResult);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
