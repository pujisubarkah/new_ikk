import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';  // Pastikan prisma client sudah disiapkan dengan benar

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const newPassword = '12345';  // Password baru yang diinginkan
    const hashedPassword = await bcrypt.hash(newPassword, 10);  // Enkripsi password baru

    try {
      // Ambil semua pengguna dari database
      const users = await prisma.user.findMany();

      // Update password untuk setiap pengguna
      for (const user of users) {
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },  // Mengubah password ke yang baru
        });
        console.log(`Password untuk pengguna ${user.username} telah direset.`);
      }

      return res.status(200).json({ message: 'Semua password berhasil di-reset ke 12345' });
    } catch (error) {
      console.error('Error saat mereset password:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan saat mereset password' });
    }
  } else {
    return res.status(405).json({ error: 'Metode HTTP tidak diizinkan' });
  }
}
