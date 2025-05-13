import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // agency_id_panrb
  const { verifikatorId } = req.body;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method tidak diperbolehkan" });
  }

  if (!id || !verifikatorId) {
    return res.status(400).json({ message: "ID instansi dan ID verifikator harus disertakan" });
  }

  try {
    const agencyIdPanrb = BigInt(id as string);
    const validatedBy = BigInt(verifikatorId);

    // Ambil semua policy yang memiliki agency_id_panrb == id
    const policies = await prisma.policy.findMany({
      where: {
        agency_id_panrb: agencyIdPanrb,
      },
    });

    if (policies.length === 0) {
      return res.status(404).json({ message: "Tidak ada policy ditemukan untuk instansi ini" });
    }

    // Update semua policy dengan validated_by = verifikatorId
    const updatedPolicies = await Promise.all(
      policies.map((policy) =>
        prisma.policy.update({
          where: { id: policy.id },
          data: {
            validated_by: validatedBy,
          },
        })
      )
    );

    return res.status(200).json({
      success: true,
      message: "Verifikator berhasil ditetapkan untuk semua policy",
      data: updatedPolicies,
    });
  } catch (error) {
    console.error("Gagal menetapkan verifikator:", error);
    return res.status(500).json({ message: "Gagal menetapkan verifikator" });
  }
}
