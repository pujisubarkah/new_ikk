// pages/api/admin/verify-user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // Cek apakah session ada dan user role adalah 'command_center'
  if (!session || !session.user || session.user.role_user?.role.name !== 'command_center') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const { userId } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },  // ID user yang ingin diupdate
        data: { status: 'Aktif' },  // Update status jadi aktif
      });

      return res.status(200).json(updatedUser);
    } catch {
      return res.status(500).json({ message: 'Failed to verify user' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
