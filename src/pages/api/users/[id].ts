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
        const user = await prisma.user.findUnique({ where: { id: BigInt(id) } });
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
          console.log('Received update data:', {
            id: id,
            body: req.body,
            timestamp: new Date().toISOString()
          });
      
          // Validasi data yang diperlukan
          if (!req.body.name || !req.body.email) {
            console.warn('Validation failed - missing required fields');
            return res.status(400).json({ 
              error: 'Name and email are required',
              received: req.body 
            });
          }
      
          const updatedUser = await prisma.user.update({
            where: { id: BigInt(id) },
            data: {
              name: req.body.name,
              email: req.body.email,
              nik: req.body.nik,
              phone: req.body.phone,
              position: req.body.position,
              work_unit: req.body.work_unit,
              ...(req.body.username && { username: req.body.username }),
              // Tambahkan field lain sesuai kebutuhan
            },
          });
      
          console.log('Successfully updated user:', {
            userId: id,
            updatedFields: Object.keys(req.body)
          });
      
          res.status(200).json(safeJson(updatedUser));
          
        } catch (error) {
          console.error('Update failed:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            inputData: req.body,
            userId: id,
            timestamp: new Date().toISOString()
          });
      
          res.status(400).json({ 
            error: 'Failed to update user',
            details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
            receivedData: req.body
          });
        }
        break;

    case 'DELETE':
      try {
        const user = await prisma.user.findUnique({
          where: { id: BigInt(id) },
        });

        if (!user) {
          return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }

        const deletedUser = await prisma.user.update({
          where: { id: BigInt(id) },
          data: {
            deleted: '1',
            deleted_at: new Date(),
          },
        });

        // Menggunakan safeJson untuk memastikan BigInt aman
        res.status(200).json(safeJson(deletedUser));

      } catch (error) {
        console.error('Gagal menghapus user:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat menghapus user' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
