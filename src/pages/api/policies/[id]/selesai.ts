// pages/api/policies/selesai.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        if (req.method !== "GET") {
            return res.status(405).json({ message: "Method not allowed" });
        }

        if (!id || typeof id !== "string") {
            return res.status(400).json({ message: "`id` is required and must be a string" });
        }

        const createdBy = BigInt(id);

        // Ambil semua policy dengan policy_process = SELESAI dan created_by = id
        const policies = await prisma.policy.findMany({
            where: {
                created_by: createdBy,
                policy_process: "SELESAI",
            },
            select: {
                id: true,
                name: true,
                name_detail: true,
                policy_process: true,
                user_policy_enumerator_idTouser: {
                    select: {
                        name: true,
                    },
                },
                ikk_ki_score: {
                    select: {
                        ikk_total_score: true,
                    },
                },
            },
        });

        // Format hasil sesuai kebutuhan
        const formatted = policies.map((policy) => ({
            id: policy.id.toString(),
            nama_kebijakan: `${policy.name}${policy.name_detail ? ` - ${policy.name_detail}` : ''}`,
            enumerator: policy.user_policy_enumerator_idTouser?.name || null,
            proses: policy.policy_process,
            nilai_akhir: policy.ikk_ki_score?.[0]?.ikk_total_score ?? null,
        }));

        return res.status(200).json(serializeBigInt({ data: formatted }));
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}