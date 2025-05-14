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

    const policies = await prisma.policy.findMany({
      where: {
        agency_id_panrb: agencyIdPanrb,
      },
    });

    if (policies.length === 0) {
      return res.status(404).json({ message: "Tidak ada policy ditemukan untuk instansi ini" });
    }

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

    const responseData = {
      success: true,
      message: "Verifikator berhasil ditetapkan",
      data: updatedPolicies,
    };

    // Serialisasi manual untuk menghindari error BigInt
    return res.status(200).json(JSON.parse(JSON.stringify(responseData, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )));

  } catch (error) {
    console.error("Gagal menetapkan verifikator:", error);
    return res.status(500).json({ message: "Gagal menetapkan verifikator" });
  }
}
