// pages/api/policies/reject.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID kebijakan tidak ditemukan" });
  }

  try {
    await prisma.policy.update({
      where: { id: BigInt(id) },
      data: {
        policy_status: "SELESAI_VERIFIKASI", // Update status ke "DITOLAK"
        policy_process: "DITOLAK", // Update proses ke "DITOLAK"
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Gagal menolak kebijakan:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
