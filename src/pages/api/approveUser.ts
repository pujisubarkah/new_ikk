// pages/api/approveUser.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { sendApprovalEmail } from '../../services/emailService'; // Pastikan path ini sesuai dengan struktur foldermu

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId } = req.body; // Ambil userId dari request body
    
    try {
      // Update status user menjadi 'aktif'
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status: 'aktif' },
      });

      // Kirim email pemberitahuan ke admin
      const adminEmail = 'admin@example.com'; // Ganti dengan email admin yang sesuai
      await sendApprovalEmail(adminEmail, updatedUser.name || 'Unknown', updatedUser.email || 'no-reply@example.com');

      return res.status(200).json({ message: 'User approved and email sent' });
    } catch (error) {
      console.error('Error approving user:', error);
      return res.status(500).json({ error: 'Failed to approve user' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
