import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { serializeBigInt } from '@/lib/serializeBigInt';
import { z } from 'zod';

const SALT_ROUNDS = 10;

// Define Zod schema
const createAnalisSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  username: z.string().min(3, 'Username minimal 3 karakter').optional(),
  email: z.string().email('Email tidak valid'),
  position: z.string().min(2, 'Jabatan minimal 2 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 karakter'),
  work_unit: z.string().optional(),
  koorInstansiId: z.string().min(1, 'ID Koordinator diperlukan'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .optional(),
  status: z.enum(['Aktif', 'Non Aktif']).default('Aktif')
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const validationResult = createAnalisSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validasi gagal',
        details: validationResult.error.flatten()
      });
    }

    const {
      name,
      username,
      email,
      position,
      phone,
      work_unit,
      koorInstansiId,
      password,
      status
    } = validationResult.data;

    // Gunakan password dari body atau default
    const finalPassword = password || '12345678';
    const hashedPassword = await bcrypt.hash(finalPassword, SALT_ROUNDS);

    // Cari koordinator
    const koorUser = await prisma.user.findUnique({
      where: { id: BigInt(koorInstansiId) },
      select: { id: true, agency_id_panrb: true }
    });

    if (!koorUser || !koorUser.agency_id_panrb) {
      return res.status(400).json({ 
        error: 'Koordinator tidak valid atau tidak memiliki instansi' 
      });
    }

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User sudah ada',
        conflicts: {
          email: existingUser.email === email,
          username: existingUser.username === username
        }
      });
    }

    // Buat user baru dan relasi dalam transaksi
    const [newUser, relation] = await prisma.$transaction([
      prisma.user.create({
        data: {
          name,
          username,
          email,
          position,
          phone,
          work_unit,
          password: hashedPassword,
          status,
          agency_id_panrb: koorUser.agency_id_panrb,
          role_user: { create: { role_id: BigInt(5) } }
        }
      }),
      prisma.koor_instansi_analis.create({
        data: { koor_instansi_id: koorUser.id }
      })
    ]);

    // Update relasi dengan ID user baru
    await prisma.koor_instansi_analis.update({
      where: { id: relation.id },
      data: { analis_instansi_id: newUser.id }
    });

    // Hilangkan password sebelum dikirim ke client
    const { password: _, ...userData } = newUser;

    return res.status(201).json({
      success: true,
      data: {
        user: serializeBigInt(userData),
        relation: serializeBigInt(relation)
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Terjadi kesalahan server',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}