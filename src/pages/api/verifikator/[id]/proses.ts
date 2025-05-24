// pages/api/policies/[id]/menunggu-validasi-ku.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "`id` is required and must be a string" });
    }

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: "`id` must be a numeric string" });
    }

    let validatedById: bigint;
    try {
      validatedById = BigInt(id);
    } catch {
      return res.status(400).json({ message: "`id` must be a valid integer" });
    }

    // Ubah query: cari kebijakan yang `policy_status`-nya MENUNGGU_VALIDASI_KU
    // dan field `validated_by` sesuai dengan `validatedById`
    const policies = await prisma.policy.findMany({
      where: {
        validated_by: validatedById, // ✅ Diubah dari agency_id_panrb ke validated_by
        policy_status: "MENUNGGU_VALIDASI_KU",
        active_year: 2025,
      },
      select: {
        id: true,
        name: true,
        name_detail: true,
        sector: true,
        lainnya: true,
        effective_date: true,
        file_url: true,
        policy_process: true,
        policy_status: true,
        agencies: {
          select: {
            name: true,
          },
        },
      },
    });

    const formatted = policies.map((policy) => ({
      id: policy.id,
      nama_kebijakan: `${policy.name ?? ''}${policy.name_detail ? ` - ${policy.name_detail}` : ''}`,
      sektor: `${policy.sector ?? ''}${policy.lainnya ? ` - ${policy.lainnya}` : ''}`,
      proses: policy.policy_process,
      policy_status: policy.policy_status,
      file_url: policy.file_url,
    }));

    return res.status(200).json(serializeBigInt({ data: formatted }));
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}