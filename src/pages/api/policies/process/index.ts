import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { assigned_by_admin_id } = req.query; // Ambil assigned_by_admin_id dari query params

    if (!assigned_by_admin_id) {
      return res.status(400).json({ message: 'assigned_by_admin_id is required' });
    }

    try {
      const result = await prisma.policy.groupBy({
        by: ['assigned_by_admin_id', 'policy_process'],
        where: {
          assigned_by_admin_id: BigInt(assigned_by_admin_id as string), // Pastikan mengonversi ke BigInt
        },
        _count: {
          _all: true,
        },
      });

      const formatted = result.map(item => ({
        assigned_by_admin_id: item.assigned_by_admin_id,
        policy_process: item.policy_process,
        count: item._count._all,
      }));

      res.status(200).json(serializeBigInt({ data: formatted }));
    } catch (error) {
      res.status(500).json({
        message: 'Failed to group and count policy_process per assigned_by_admin_id',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
