import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

// Helper untuk convert BigInt ke String secara otomatis
const safeJson = <T>(data: T): T =>
  JSON.parse(JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const user = await prisma.user.findUnique({ 
          where: { 
            id: BigInt(id) 
          },
        select: {
          id: true,
          name: true,
          nik: true,
          username: true,
          password: true,
          phone: true,
          email: true,
          position: true,
          work_unit: true,
          active_year: true,
          status: true,
          agency_id_panrb: true,
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
          penunjukkan_id: true,
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
          }},
         });
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        // Menggunakan safeJson untuk memastikan BigInt aman
        res.status(200).json(safeJson(user));
      } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
      }
      break;

    case 'PUT':
  try {
    const { name, email } = req.body;

    const missingFields: string[] = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');

    if (missingFields.length > 0) {
      console.warn(`Validation failed - missing fields: ${missingFields.join(', ')}`);
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields,
        received: req.body
      });
    }

    // Tambahan console log untuk debug active_year
    console.log('Parsed active_year:', req.body.active_year, '->', parseInt(req.body.active_year, 10));

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(id) },
      data: {
        name: req.body.name,
        email: req.body.email,
        nik: req.body.nik,
        phone: req.body.phone,
        position: req.body.position,
        work_unit: req.body.work_unit,
        status: req.body.status,
        active_year: req.body.active_year ? parseInt(req.body.active_year, 10) : null,
        agency_id_panrb: req.body.agency_id_panrb,
        ...(req.body.username && { username: req.body.username }),
      },
    });

    // Update role_id in the role_user table
    if (req.body.role_id) {
      await prisma.role_user.updateMany({
        where: { user_id: BigInt(id) },
        data: { role_id: req.body.role_id },
      });
    }

    console.log('Successfully updated user:', {
      userId: id,
      updatedFields: Object.keys(req.body)
    });

    res.status(200).json(safeJson(updatedUser));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('Update failed:', {
      message: errorMessage,
      stack: errorStack,
      receivedData: req.body,
      userId: id,
      timestamp: new Date().toISOString()
    });

    res.status(400).json({ 
      error: 'Failed to update user',
      message: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      receivedData: req.body
    });
  }
  break;



   case 'DELETE':
  try {
    const user = await prisma.user.findUnique({
      where: { id: BigInt(id) },
    })

    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' })
    }

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(id) },
      data: {
        deleted: '1',
        deleted_at: new Date(),
        status: 'nonaktif', // <-- Sekarang status juga berubah
      },
    })

    res.status(200).json(safeJson(updatedUser))

  } catch (error) {
    console.error('Gagal menghapus user:', error)
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus user' })
  }
  break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
