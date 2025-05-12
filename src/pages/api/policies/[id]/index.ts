import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";
import { serializeBigInt } from '@/lib/serializeBigInt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const numericId = Number(id);
    if (!id || isNaN(numericId)) {
      return res.status(400).json({ error: 'ID kebijakan tidak valid' });
    }

    const policy = await prisma.policy.findUnique({
      where: { id: numericId },
      select: {
        id: true,
        name: true,
        progress: true,
        policy_process: true,
        assigned_by_admin_at: true,
        agency_id_panrb: true,
        instansi: {
          select: {
            agency_name: true,
          },
        },
        ikk_ki_score: {
          select: {
            ikk_total_score: true,
          },
        },
      },
    });

    if (!policy) {
      return res.status(404).json({ error: 'Kebijakan tidak ditemukan' });
    }

    const formatted = {
      id: policy.id,
      nama_kebijakan: policy.name,
      tanggal_proses: policy.assigned_by_admin_at,
      status_kebijakan: policy.policy_process,
      instansi: policy.instansi?.agency_name ?? null,
      progress_pengisian: policy.progress,
      nilai_akhir: policy.ikk_ki_score?.[0]?.ikk_total_score ?? null,

    };

    return res.status(200).json(serializeBigInt({ data: formatted }));
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}
