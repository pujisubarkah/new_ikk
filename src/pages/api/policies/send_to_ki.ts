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
        // 1. Ambil semua pertanyaan dan jawaban terkait policy ini
        const policy = await prisma.policy.findUnique({
            where: { id: BigInt(id) },
            include: {
                ikk_ki_score: {
                    select: {
                        ikk_total_score: true,
                    },
                },
            },
        }) as { answers: { score: number | null }[] } | null;

        if (!policy) {
            return res.status(404).json({ error: "Kebijakan tidak ditemukan" });
        }

        // 2. Cek apakah semua pertanyaan sudah terisi
        const unansweredQuestions = policy.answers.filter(
            (answer) => answer.score === null || answer.score === undefined
        );

        if (unansweredQuestions.length > 0) {
            return res.status(400).json({
                error: `Masih ada ${unansweredQuestions.length} pertanyaan yang belum terisi.`,
            });
        }

        // 3. Update status policy
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