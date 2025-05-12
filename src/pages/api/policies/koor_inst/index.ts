import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { NextApiRequest, NextApiResponse } from 'next';

// Helper function to extract the relevant policy data
interface Policy {
  id: bigint;
  name: string | null;
  sector: string | null;
  file_url: string | null;
  progress: string | null;
  assigned_by_admin_at: Date | null;
  effective_date: Date | null;
  policy_process: string | null;
}

const extractPolicyData = (policy: Policy, agencyName: string) => ({
  policy_id: Number(policy.id),
  nama_kebijakan: policy.name || '',
  sektor: policy.sector || null,
  file_url: policy.file_url || '', // Ensure this is always a string
  progress: policy.progress ? parseInt(policy.progress) : 0, // Convert to number
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

    // Query the database
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
                agencies: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        user_koor_instansi_analis_analis_instansi_idTouser: {
          select: {
            name: true,
          },
        },
      },
    });

    // Define RowData interface with optional/nullable fields
    interface RowData {
      [key: string]: unknown; // Add index signature
      koor_instansi_id: number;
      analis_instansi_id: number;
      enumerator: string;
      policy_id: number;
      nama_kebijakan: string;
      policy_process: string;
      sektor: string | null;
      file_url: string; // Changed to non-nullable string
      progress: number; // Changed to number
      tanggal_assign: Date | null;
      tanggal_berlaku: Date | null;
      instansi: string;
    }

    const rowData: RowData[] = [];

    result.forEach(item => {
      const user = item.user_koor_instansi_analis_koor_instansi_idTouser;
      const agencyName = user?.policy_policy_created_byTouser?.[0]?.agencies?.name || '-';
      const enumeratorName = item.user_koor_instansi_analis_analis_instansi_idTouser?.name || '-';

      user?.policy_policy_created_byTouser?.forEach((policy: Policy) => {
        rowData.push({
          koor_instansi_id: item.koor_instansi_id ? Number(item.koor_instansi_id) : 0,
          analis_instansi_id: item.analis_instansi_id ? Number(item.analis_instansi_id) : 0,
          enumerator: enumeratorName,
          policy_process: policy.policy_process || '',
          ...extractPolicyData(policy, agencyName),
        });
      });
    });

    const serializedResult = rowData.map(item => serializeBigInt(item));
    return res.status(200).json(serializedResult);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}