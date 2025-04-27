import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt"; // Pastikan serializeBigInt berfungsi dengan benar

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { agency_id } = req.query;

    // Query untuk mengambil kebijakan berdasarkan agency_id jika ada, atau semua kebijakan jika tidak ada
    const policies = await prisma.policies.findMany({
      where: agency_id
        ? { agency_id: BigInt(agency_id as string) } // Filter berdasarkan agency_id jika ada
        : {}, // Jika tidak ada agency_id, ambil semua data
      select: {
        agency_id: true, // Mengambil agency_id
        agencies: {
          select: {
            name: true, // Ambil nama agency terkait
          },
        },
      },
      distinct: ['agency_id'], // Mengambil hanya agency_id yang unik
    });

    // Filter dan serialisasi BigInt, kemudian ambil nama agency
    const agencyDetails = policies
      .filter(policy => policy.agency_id !== null) // Filter keluar nilai null
      .map(policy => ({
        instansi_id: serializeBigInt({ instansi_id : policy.agency_id as bigint }), // Wrap bigint in an object
        instansi_name: policy.agencies?.name, // Ambil nama agency
      }));

    return res.status(200).json(agencyDetails);
  } catch (error) {
    console.error("[AGENCY_ID_GET_ERROR]", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
