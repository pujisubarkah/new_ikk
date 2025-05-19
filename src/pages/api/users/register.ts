import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';
import { z } from 'zod';


const zNumberFromString = () =>
  z.union([
    z.number(),
    z.string().transform((val) => Number(val)).refine(val => !isNaN(val), {
      message: 'Invalid number',
    })
  ]);

// Updated validation schema to handle both string and number inputs
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  position: z.string().optional(),
  phone: z.string().optional(),
  username: z.string().optional(),
  nik: z.string().optional(),
  role_id: zNumberFromString().optional(),
  work_unit: z.string().optional(),
  agency_id: zNumberFromString().optional(),
  agency_id_panrb: zNumberFromString().optional(),
  penunjukkan_id: zNumberFromString().optional(),
  active_year: zNumberFromString().optional(),
  created_by: zNumberFromString().optional(),
  modified_by: zNumberFromString().optional(),
  deleted_by: zNumberFromString().optional(),
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
              in: roleUsers?.map((ru: { user_id: bigint }) => ru.user_id) || []
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
      console.log('Received body:', req.body);

      // Parse and validate input
      const parsed = userSchema.safeParse(req.body);
      if (!parsed.success) {
        console.log('Validation errors:', parsed.error.format());
        return res.status(400).json({ 
          error: 'Invalid input', 
          details: parsed.error.format() 
        });
      }

      // At this point, role_id and active_year are guaranteed to be numbers or undefined
      const body = parsed.data;

      console.log('Parsed body:', body);

      // Check if email already exists
      const existing = await prisma.user.findFirst({ where: { email: body.email } });
      if (existing) {
        console.log('Email already exists:', body.email);
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(body.password, 10);
      console.log('Password hashed successfully');

      // Prepare data for Prisma
      const userData = {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        status: 'inactive',
        ...(body.position && { position: body.position }),
        ...(body.phone && { phone: body.phone }),
        ...(body.username && { username: body.username }),
        ...(body.nik && { nik: body.nik }),
        ...(body.work_unit && { work_unit: body.work_unit }),
        ...(body.agency_id && { agency_id: BigInt(body.agency_id) }),
        ...(body.agency_id_panrb && { agency_id_panrb: BigInt(body.agency_id_panrb) }),
        ...(body.penunjukkan_id && { penunjukkan_id: BigInt(body.penunjukkan_id) }),
        ...(body.active_year && { active_year: BigInt(body.active_year) }), // Already number
        ...(body.created_by && { created_by: BigInt(body.created_by) }),
        ...(body.modified_by && { modified_by: BigInt(body.modified_by) }),
        ...(body.deleted_by && { deleted_by: BigInt(body.deleted_by) }),
      };

      // Create User
      const user = await prisma.user.create({
        data: userData
      });

      console.log('User created:', user);

      // Assign Role if exists
      if (body.role_id) {
        await prisma.role_user.create({
          data: {
            user_id: user.id,
            role_id: BigInt(body.role_id), // Already number
          },
        });
        console.log('Role assigned for user:', user.id);
      }

      // Special handling for specific roles
      if (body.role_id === 4) {
        await prisma.koor_instansi_validator.create({
          data: {
            koor_instansi_id: user.id,
          },
        });
        console.log('Added as validator:', user.id);
      }

      if (body.role_id === 5) {
        await prisma.koor_instansi_analis.create({
          data: {
            koor_instansi_id: user.id,
          },
        });
        console.log('Added as analyst:', user.id);
      }

      res.status(201).json(serializeBigInt(user));
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ 
        error: 'Failed to create user', 
        detail: error instanceof Error ? error.message : String(error)
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
