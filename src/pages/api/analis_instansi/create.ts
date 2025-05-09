import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    console.log('Creating user with data:', req.body); // Log data request body

    const {
        email,
        name,
        nik,
        phone,
        position,
        username,
        work_unit,
        koorInstansiId, // ID dari user koordinator instansi
    } = req.body;

    // Pastikan koorInstansiId terdefinisi dan valid
    if (!koorInstansiId) {
        return res.status(400).json({ error: 'koorInstansiId is required' });
    }

    try {
        // 1. Ambil user koordinator berdasarkan ID untuk mengambil agency_id-nya
        const koorUser = await prisma.user.findUnique({
            where: { id: BigInt(koorInstansiId) }, // Mengonversi koorInstansiId ke BigInt
        });

        if (!koorUser || !koorUser.agency_id) {
            return res.status(400).json({ error: 'Invalid koorInstansiId or missing agency_id' });
        }

        // 2. Periksa apakah username atau email sudah ada
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email or Username already exists' });
        }

        // 3. Buat user baru (analis), tanpa menentukan ID
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                nik,
                phone,
                position,
                username,
                work_unit,
                agency_id: koorUser.agency_id, // pakai agency_id dari user koordinator
                // Jangan tentukan ID secara eksplisit, biarkan Prisma yang mengelola ID
            },
        });

        // 4. Buat entri relasi di tabel koor_instansi_analis
        const koorInstansiAnalis = await prisma.koor_instansi_analis.create({
            data: {
                koor_instansi_id: koorUser.id, // Menggunakan ID koorUser yang valid
                analis_instansi_id: newUser.id, // ID dari user yang baru dibuat
            },
        });

        // 5. Kembalikan respons dengan informasi analis dan relasi koor_instansi_analis
        return res.status(200).json({
            message: 'Analis berhasil dibuat',
            user: {
                ...newUser,
                id: newUser.id.toString(),
                agency_id: newUser.agency_id?.toString(),
            },
            koor_instansi_analis: {
                id: koorInstansiAnalis.id.toString(),
                koor_instansi_id: koorInstansiAnalis.koor_instansi_id ? koorInstansiAnalis.koor_instansi_id.toString() : null,
                analis_instansi_id: koorInstansiAnalis.analis_instansi_id ? koorInstansiAnalis.analis_instansi_id.toString() : null,
            },
        });
    } catch (error) {
        console.error('Error creating analis:', error);  // Debugging: Tampilkan error lengkap
        return res.status(500).json({
            error: 'Error creating analis',
            details: error,  // Kembalikan detail error untuk debugging lebih lanjut
        });
    }
}
