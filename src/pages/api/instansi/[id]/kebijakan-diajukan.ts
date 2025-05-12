// pages/api/policies/diajukan.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "ID instansi tidak valid" });
  }

  try {
    const policies = await prisma.policy.findMany({
      where: {
        agency_id_panrb: BigInt(id),
        policy_status: "SEDANG_VERIFIKASI",
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        name: true,
        name_detail: true,
        sector: true,
        lainnya: true,
        file_url: true,
        policy_status: true,
      },
    });

    const formatted = policies.map((policy) => ({
      id: policy.id,
      nama_kebijakan: `${policy.name}${policy.name_detail ? ` - ${policy.name_detail}` : ''}`,
      sektor: policy.sector || policy.lainnya || "-",
      file_url: policy.file_url,
      status: policy.policy_status,
    }));

    // konversi BigInt biar bisa diserialisasi JSON
    const serialized = formatted.map((item) =>
      serializeBigInt(item as Record<string, unknown>)
    );

    res.status(200).json(serialized);
  } catch (error) {
    console.error("Gagal ambil data kebijakan:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
