// /pages/api/policies/send-to-ku.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;
  const enumeratorId = req.headers["x-enumerator-id"] || req.body.enumeratorId;

  if (!id) {
    return res.status(400).json({ error: "ID kebijakan tidak ditemukan" });
  }

  if (!enumeratorId) {
    return res.status(400).json({ error: "Enumerator ID tidak ditemukan" });
  }

  try {
    const policy = await prisma.policy.findUnique({
      where: { id: BigInt(id) },
    });

    if (!policy) {
      return res.status(404).json({ error: "Kebijakan tidak ditemukan" });
    }

    await prisma.policy.update({
      where: { id: BigInt(id) },
      data: {
        policy_status: "SELESAI_VALIDASI_KU",
        validated_by: BigInt(enumeratorId), // pastikan kolom ini ada di model
      },
    });

    res.status(200).json({
      success: true,
      message: "Kebijakan berhasil dikirim ke koordinator unit",
    });
  } catch (error) {
    console.error("Gagal mengirim ke koordinator:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}