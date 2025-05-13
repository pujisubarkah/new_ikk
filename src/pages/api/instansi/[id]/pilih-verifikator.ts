import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // ID Instansi / Koordinator Nasional
  const { analystId } = req.body;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method tidak diperbolehkan" });
  }

  if (!id || !analystId) {
    return res.status(400).json({ message: "ID instansi dan analystId harus disertakan" });
  }

  try {
    const koorNasionalId = BigInt(id as string);
    const validatorId = BigInt(analystId);

    // Simpan ke database
    const result = await prisma.koor_nasional_validator.create({
      data: {
        id: undefined, // Allow Prisma to auto-generate the ID
        koor_nasional_id: koorNasionalId,
        validator_id: validatorId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Verifikator berhasil ditetapkan",
      data: serializeBigInt(result),
    });
  } catch (error) {
    console.error("Gagal menetapkan verifikator:", error);
    return res.status(500).json({ message: "Gagal menetapkan verifikator" });
  }
}