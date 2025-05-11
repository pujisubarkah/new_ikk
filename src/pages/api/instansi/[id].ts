import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // pastikan sudah setup Prisma Client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const instansi = await prisma.instansi.findFirst({
        where: {
          agency_id: BigInt(id as string),  // cari berdasarkan agency_id, bukan id primary
        },
        select: {
          agency_name: true, // hanya ambil agency_name
        },
      });

      if (!instansi) {
        return res.status(404).json({ message: "Instansi tidak ditemukan" });
      }

      return res.status(200).json(instansi);
    } catch (error) {
      console.error("Gagal ambil data instansi:", error);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  return res.status(405).json({ message: "Method tidak diizinkan" });
}
