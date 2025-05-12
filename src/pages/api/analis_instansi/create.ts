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
    // 1. Validate request body with Zod
    const validationResult = createAnalisSchema.safeParse(req.body);

    if (!validationResult.success) {
      console.log('Validation Failed:', validationResult.error.flatten());
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

    // 2. Set password to default if not provided
    const finalPassword = password || '12345678'; // Password default jika tidak ada

    console.log('Password Set:', finalPassword);

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(finalPassword, SALT_ROUNDS);

    // 4. Get coordinator info
    const koorUser = await prisma.user.findUnique({
      where: { id: BigInt(koorInstansiId) },
      select: { id: true, agency_id_panrb: true }
    });

    console.log('Coordinator Info:', koorUser);

    if (!koorUser || !koorUser.agency_id_panrb) {
      return res.status(400).json({ 
        error: 'Koordinator tidak valid atau tidak memiliki instansi' 
      });
    }

    // 5. Check existing user
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    console.log('Existing User:', existingUser);

    if (existingUser) {
      return res.status(409).json({
        error: 'User sudah ada',
        conflicts: {
          email: existingUser.email === email,
          username: existingUser.username === username
        }
      });
    }

    // 6. Create user and relation in transaction
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

    console.log('New User:', newUser);
    console.log('Relation:', relation);

    // 7. Update relation with new user ID
    await prisma.koor_instansi_analis.update({
      where: { id: relation.id },
      data: { analis_instansi_id: newUser.id }
    });

    // 8. Return response without password
    const { password: userPassword, ...userData } = newUser;

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
