import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET": {
        const { enumerator_id } = req.query;

        if (!enumerator_id) {
          return res.status(400).json({ message: "`enumerator_id` is required" });
        }

        const policies = await prisma.policy.findMany({
          where: {
            enumerator_id: BigInt(enumerator_id as string),
          },
          select: {
            name: true,
            effective_date: true,
            user_policy_enumerator_idTouser: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        });

        // Format kostum baris
        const formatted = policies.map((policy) => ({
          nama_kebijakan: policy.name,
          tanggal_berlaku: policy.effective_date,
          enumerator: policy.user_policy_enumerator_idTouser
            ? `${policy.user_policy_enumerator_idTouser.name} `
            : null,
        }));

        return res.status(200).json(serializeBigInt({ data: formatted }));
      }

      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}
