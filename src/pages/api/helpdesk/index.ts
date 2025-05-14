import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            // Handle GET request
            const helpdesks = await prisma.helpdesk.findMany();
            return res.status(200).json(helpdesks);
        } else if (req.method === 'POST') {
            // Handle POST request
            const { title, description } = req.body;

            if (!title || !description) {
                return res.status(400).json({ error: 'Title and description are required' });
            }

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

            return res.status(201).json(newHelpdesk);
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