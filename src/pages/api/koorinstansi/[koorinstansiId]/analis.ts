import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { koorinstansiId } = req.query;

  if (req.method !== "GET") {
    console.log(`Method ${req.method} not allowed`);
    return res.status(405).end();
  }

  try {
    console.log(`Fetching analis for koor_instansi_id: ${koorinstansiId}`);

    const analis = await prisma.koor_instansi_analis.findMany({
      where: {
        koor_instansi_id: BigInt(koorinstansiId as string),
      },
      include: {
        user_koor_instansi_analis_analis_instansi_idTouser: true,
      },
    });

    console.log("Raw analis data:", analis);

    const formatted = analis
      .filter((a) => a.analis_instansi_id !== null)
      .map((a) => ({
        id: a.analis_instansi_id?.toString(), // Convert BigInt ke string
        username: a.user_koor_instansi_analis_analis_instansi_idTouser?.username,
        name: a.user_koor_instansi_analis_analis_instansi_idTouser?.name,
      }));

    if (formatted.length === 0) {
      return res.status(404).json({ error: "Data analis tidak ditemukan" });
    }

    res.json(formatted); // langsung array
  } catch (err) {
    console.error("Error fetching analis:", err);
    res.status(500).json({ error: "Gagal mengambil analis" });
  }
}
