import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';
import { z } from 'zod';

// Validasi input pakai zod
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  position: z.string().optional(),
  phone: z.string().optional(),
  username: z.string().optional(),
  nik: z.string().optional(),
  role_id: z.string().optional(),
  agency_id: z.string().optional(),
  agency_id_panrb: z.string().optional(),
  penunjukkan_id: z.string().optional(),
  active_year: z.string().optional(),
  created_by: z.string().optional(),
  modified_by: z.string().optional(),
  deleted_by: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { role_id } = req.query;

      const roleUsers = role_id 
        ? await prisma.role_user.findMany({
            where: { role_id: BigInt(role_id as string) },
            select: { user_id: true }
          })
        : null;

      const users = await prisma.user.findMany({
        where: {
          OR: [{ deleted: null }, { deleted: '0' }],
          ...(role_id && {
            id: {
              in: roleUsers?.map((ru: { user_id: bigint; }) => ru.user_id) || []
            }
          }),
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          position: true,
          work_unit: true,
          active_year: true,
          status: true,
          instansi: {
            select: {
              agency_id: true,
              agency_name: true,
              instansi_kategori: {
                select: {
                  id: true,
                  kat_instansi: true
                }
              }
            }
          },
          surat_penunjukkan: {
            select: { file: true }
          },
          role_user: {
            select: {
              role_id: true,
              role: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: [{ id: 'asc' }],
      });

      const serialized = users.map((user: Record<string, unknown>) => serializeBigInt(user));
      res.status(200).json(serialized);
    } catch (error) {
      console.error('Fetch users error:', error);
      res.status(500).json({ error: 'Failed to fetch users', detail: error });
    }

  } else if (req.method === 'POST') {
    try {
      console.log('Received body:', req.body); // Log raw request body
      
      const parsed = userSchema.safeParse(req.body);
      if (!parsed.success) {
        console.log('Validation errors:', parsed.error.format()); // Log validation errors
        return res.status(400).json({ error: 'Invalid input', details: parsed.error.format() });
      }

      const body = parsed.data;
      console.log('Parsed body:', body); // Log parsed data

      const existing = await prisma.user.findFirst({ where: { email: body.email } });
      if (existing) {
        console.log('Email already exists:', body.email); // Log duplicate email
        return res.status(400).json({ error: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);
      console.log('Password hashed successfully'); // Log password hashing

      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          status: 'inactive',
          ...(body.position && { position: body.position }),
          ...(body.phone && { phone: body.phone }),
          ...(body.username && { username: body.username }),
          ...(body.nik && { nik: body.nik }),
          ...(body.agency_id && { agency_id: BigInt(body.agency_id) }),
          ...(body.agency_id_panrb && { agency_id_panrb: BigInt(body.agency_id_panrb) }),
          ...(body.penunjukkan_id && { penunjukkan_id: BigInt(body.penunjukkan_id) }),
          ...(body.active_year && { active_year: BigInt(body.active_year) }),
          ...(body.created_by && { created_by: BigInt(body.created_by) }),
          ...(body.modified_by && { modified_by: BigInt(body.modified_by) }),
          ...(body.deleted_by && { deleted_by: BigInt(body.deleted_by) }),
        },
      });

      console.log('User created:', user); // Log created user

      if (body.role_id) {
        const roleUser = await prisma.role_user.create({
          data: {
            user_id: user.id,
            role_id: BigInt(body.role_id),
          }
        });
        console.log('Role assigned:', roleUser); // Log role assignment
      }

      res.status(201).json(serializeBigInt(user));
    } catch (error) {
      console.error('Create user error:', error);
      res.status(400).json({ error: 'Failed to create user', detail: error });
    }

  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
