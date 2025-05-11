import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    if (!id) {
      return res.status(400).json({ message: "`id` is required" });
    }

    const policies = await prisma.policy.findMany({
      where: {
        processed_by_enumerator_id: BigInt(id as string),
      },
      select: {
        id: true,
        name: true,
        progress: true,
        user_policy_processed_by_enumerator_idTouser: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    const formatted = policies.map((policy) => ({
      id: policy.id,
      nama_kebijakan: policy.name,
      progress: policy.progress,
      enumerator: policy.user_policy_processed_by_enumerator_idTouser
        ? `${policy.user_policy_processed_by_enumerator_idTouser.name}`
        : null,
    }));

    return res.status(200).json(serializeBigInt({ data: formatted }));
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}
