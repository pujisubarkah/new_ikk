import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { id } = req.body;
    const koorinstansiId = req.headers["x-koorinstansi-id"];

    // Tambahkan log untuk debugging
    console.log("=== Received Body ===", req.body);
    console.log("=== Received Header x-koorinstansi-id ===", koorinstansiId);

    if (!id) {
        return res.status(400).json({ error: "ID kebijakan tidak ditemukan" });
    }

    if (!koorinstansiId) {
        return res.status(400).json({ error: "Koordinator Instansi ID tidak ditemukan" });
    }

    try {
        // 1. Cek apakah policy ada
        const policy = await prisma.policy.findUnique({
            where: { id: BigInt(id) },
        });

        if (!policy) {
            return res.status(404).json({ error: "Kebijakan tidak ditemukan" });
        }

        // 2. Update status dan catat siapa yang assign
        await prisma.policy.update({
            where: { id: BigInt(id) },
            data: {
                policy_status: "MENUNGGU_VALIDASI_KU",
                policy_process: "SELESAI",
                assigned_by_admin_id: BigInt(koorinstansiId as string),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Kebijakan berhasil dikirim ke koordinator",
        });
    } catch (error) {
        console.error("Gagal mengirim ke koordinator:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
