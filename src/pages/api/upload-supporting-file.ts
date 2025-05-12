// /pages/api/upload-supporting-file.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const {
        policy_id,
        agency_id,
        created_by,
        ...fileUrls
    } = req.body;

    try {
        // Upsert ke tabel ikk_file
        await prisma.ikk_file.upsert({
            where: { id: BigInt(policy_id) },
            update: {
                ...(agency_id && { agency_id: BigInt(agency_id) }),
                created_by: created_by ? BigInt(created_by) : undefined,
                ...fileUrls,
            },
            create: {
                policy_id: BigInt(policy_id),
                ...(agency_id && { agency_id: BigInt(agency_id) }),
                created_by: created_by ? BigInt(created_by) : undefined,
                ...fileUrls,
            },
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Gagal menyimpan file:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}