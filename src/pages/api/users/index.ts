import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { deleted: null },
            { deleted: '0' },
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          position: true,
          agencies: {
            select: {
              name: true
            }
          },
          instansi: {
            select: {
              // Replace 'name' with an existing field or remove this block if no fields are needed
              id: true // Example: Replace with a valid field from the 'instansi' model
            }
          },
          surat_penunjukkan: {
            select: {
              file: true
            }
          },
          role_user: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          id: 'asc',
        }
      });

      const serialized = users.map(user => serializeBigInt(user));
      res.status(200).json(serialized);
    } catch (error) {
      console.error('Fetch users error:', error);
      res.status(500).json({ error: 'Failed to fetch users', detail: error });
    }

  } else if (req.method === 'POST') {
    try {
      const body = req.body;

      const user = await prisma.user.create({
        data: {
          id: BigInt(body.id),
          name: body.name,
          email: body.email,
          position: body.position,
          phone: body.phone,
          password: body.password,
          username: body.username,
          nik: body.nik,
          agency_id: body.agency_id ? BigInt(body.agency_id) : undefined,
          agency_id_panrb: body.agency_id_panrb ? BigInt(body.agency_id_panrb) : undefined,
          penunjukkan_id: body.penunjukkan_id ? BigInt(body.penunjukkan_id) : undefined,
          active_year: body.active_year ? BigInt(body.active_year) : undefined,
          created_by: body.created_by ? BigInt(body.created_by) : undefined,
          modified_by: body.modified_by ? BigInt(body.modified_by) : undefined,
          deleted_by: body.deleted_by ? BigInt(body.deleted_by) : undefined,
        },
      });

      if (body.role_id) {
        await prisma.role_user.create({
          data: {
            user_id: user.id,
            role_id: BigInt(body.role_id),
          }
        });
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
