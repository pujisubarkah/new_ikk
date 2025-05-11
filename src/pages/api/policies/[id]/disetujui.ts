// pages/api/policies/diajukan.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    if (!id) {
      return res.status(400).json({ message: "`id` is required" });
    }

    const createdBy = BigInt(id as string);

    const policies = await prisma.policy.findMany({
      where: {
        created_by: createdBy,
        policy_process: "DISETUJUI",
      },
      select: {
        id: true,
        name: true,
        name_detail: true,
        effective_date: true,
        enumerator_id: true,
        policy_process: true,
        user_policy_enumerator_idTouser: {
          select: { 
            name: true,
          }}
             },
    });

    const formatted = policies.map((policy) => ({
      id: policy.id,
      nama_kebijakan: `${policy.name}${policy.name_detail ? ` - ${policy.name_detail}` : ''}`,
        enumerator: policy.user_policy_enumerator_idTouser
            ? `${policy.user_policy_enumerator_idTouser.name}`
            : null,
      tanggal_berlaku: policy.effective_date,
        proses: policy.policy_process,
     
    }));

    return res.status(200).json(serializeBigInt({ data: formatted }));
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}