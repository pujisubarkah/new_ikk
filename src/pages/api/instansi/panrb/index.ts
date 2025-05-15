import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const instansi = await prisma.instansi.findMany({
                select: {
                    agency_id: true,
                    agency_name: true,
                    instansi_kategori: {
                        select: {
                            id: true,
                            kat_instansi: true,
                        },
                    },
                },
            });

            // Convert BigInt values to strings
            const serializedInstansiPanrb = JSON.parse(
                JSON.stringify(instansi, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value
                )
            );


            res.status(200).json(serializedInstansiPanrb);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}