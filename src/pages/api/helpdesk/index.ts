import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // pastikan path sesuai

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            // Handle GET request
            const helpdesks = await prisma.helpdesk.findMany();

            // Convert BigInt values to strings
            const serializedHelpdeskGet = JSON.parse(
                JSON.stringify(helpdesks, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value
                )
            );

            return res.status(200).json(serializedHelpdeskGet);
        } else if (req.method === 'POST') {
            // Handle POST request

            const { nama_lengkap, email_aktif, instansi, masalah, pesan } = req.body;

            if (!nama_lengkap || !email_aktif || !instansi || !masalah || !pesan) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const newHelpdesk = await prisma.helpdesk.create({
                data: {
                    nama_lengkap,
                    email_aktif,
                    instansi,
                    masalah,
                    pesan,
                },
            });

            // Convert BigInt values to strings
            const serializedHelpdesk = JSON.parse(
                JSON.stringify(newHelpdesk, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value
                )
            );

            return res.status(201).json(serializedHelpdesk);
        } else {
            // Method not allowed
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}