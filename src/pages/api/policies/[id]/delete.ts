import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: "`id` is required" });
  }

  try {
    await prisma.policy.delete({
      where: { id: BigInt(id as string) },
    });

    return res.status(200).json({ message: "Kebijakan berhasil dihapus." });
  } catch (error) {
    console.error("❌ Gagal hapus kebijakan:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
