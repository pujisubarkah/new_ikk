import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from '@/lib/serializeBigInt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    if (method === "GET") {
        const { policyId } = req.query;

        if (!policyId) {
            return res.status(400).json({ error: "Missing policyId" });
        }

        try {
            const answers = await prisma.ikk_ki_score.findUnique({
                where: {
                    id: BigInt(policyId as string),
                },
                select: {
                    a1: true,
                    a2: true,
                    a3: true,
                    b1: true,
                    b2: true,
                    b3: true,
                    c1: true,
                    c2: true,
                    c3: true,
                    d1: true,
                    d2: true,
                    jf: true,
                    informasi_a: true,
                    informasi_b: true,
                    informasi_c: true,
                    informasi_d: true,
                    informasi_jf: true,
                },
            });

            // Serialize BigInt ke String
            const sanitizedAnswers = answers ? serializeBigInt(answers) : null;

            return res.status(200).json({ data: sanitizedAnswers });
        } catch (error) {
            console.error("Error fetching answers:", error);
            return res.status(500).json({ error: "Failed to fetch answers" });
        }
    }

    if (method === "POST") {
        const body = req.body;
        const {
            policy_id,
            created_by,
            active_year,
            a1, a2, a3,
            b1, b2, b3,
            c1, c2, c3,
            d1, d2, jf,
            informasi_a,
            informasi_b,
            informasi_c,
            informasi_d,
            informasi_jf
        } = body;

        if (!policy_id || !created_by) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const updatedAnswers = await prisma.ikk_ki_score.upsert({
                where: {
                    id: BigInt(policy_id),
                },
                update: {
                    a1: a1 !== undefined ? BigInt(a1) : undefined,
                    a2: a2 !== undefined ? BigInt(a2) : undefined,
                    a3: a3 !== undefined ? BigInt(a3) : undefined,
                    b1: b1 !== undefined ? BigInt(b1) : undefined,
                    b2: b2 !== undefined ? BigInt(b2) : undefined,
                    b3: b3 !== undefined ? BigInt(b3) : undefined,
                    c1: c1 !== undefined ? BigInt(c1) : undefined,
                    c2: c2 !== undefined ? BigInt(c2) : undefined,
                    c3: c3 !== undefined ? BigInt(c3) : undefined,
                    d1: d1 !== undefined ? BigInt(d1) : undefined,
                    d2: d2 !== undefined ? BigInt(d2) : undefined,
                    jf,
                    informasi_a,
                    informasi_b,
                    informasi_c,
                    informasi_d,
                    informasi_jf,
                    modified_by: BigInt(created_by),
                },
                create: {
                    id: BigInt(policy_id),
                    policy_id: BigInt(policy_id),
                    created_by: BigInt(created_by),
                    active_year: active_year ? BigInt(active_year) : undefined,
                    a1: a1 !== undefined ? BigInt(a1) : undefined,
                    a2: a2 !== undefined ? BigInt(a2) : undefined,
                    a3: a3 !== undefined ? BigInt(a3) : undefined,
                    b1: b1 !== undefined ? BigInt(b1) : undefined,
                    b2: b2 !== undefined ? BigInt(b2) : undefined,
                    b3: b3 !== undefined ? BigInt(b3) : undefined,
                    c1: c1 !== undefined ? BigInt(c1) : undefined,
                    c2: c2 !== undefined ? BigInt(c2) : undefined,
                    c3: c3 !== undefined ? BigInt(c3) : undefined,
                    d1: d1 !== undefined ? BigInt(d1) : undefined,
                    d2: d2 !== undefined ? BigInt(d2) : undefined,
                    jf,
                    informasi_a,
                    informasi_b,
                    informasi_c,
                    informasi_d,
                    informasi_jf,
                },
            });

            const sanitizedData = serializeBigInt(updatedAnswers);

            return res.status(200).json({ success: true, data: sanitizedData });
        } catch (error) {
            console.error("Error saving answers:", error);
            return res.status(500).json({ error: "Failed to save answers" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
}