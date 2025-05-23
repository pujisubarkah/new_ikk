import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { id } = req.body;

    // Ambil enumeratorId dari headers atau body
    const enumeratorId = req.headers["x-enumerator-id"] || req.body.enumeratorId;

    if (!id) {
        return res.status(400).json({ error: "ID kebijakan tidak ditemukan" });
    }

    if (!enumeratorId) {
        return res.status(400).json({ error: "Enumerator ID tidak ditemukan" });
    }

    try {
        // 1. Cek apakah policy ada
        const policy = await prisma.policy.findUnique({
            where: { id: BigInt(id) },
        });

        if (!policy) {
            return res.status(404).json({ error: "Kebijakan tidak ditemukan" });
        }

        // 2. Langsung update status policy
        await prisma.policy.update({
            where: { id: BigInt(id) },
            data: {
                policy_status: "MENUNGGU_VALIDASI_KI",
                policy_process: "PROSES",
                processed_by_enumerator_id: BigInt(enumeratorId),
            },
        });

        res.status(200).json({
            success: true,
            message: "Kebijakan berhasil dikirim ke koordinator",
        });
    } catch (error) {
        console.error("Gagal mengirim ke koordinator:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}