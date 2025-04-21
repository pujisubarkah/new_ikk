import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      // Cari user berdasarkan username
      const user = await prisma.user.findUnique({
        where: {
          username: username, // Mencari user berdasarkan username
        },
        include: {
          role_user: {
            include: {
              role: true, // Include role untuk mengetahui peran pengguna
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Periksa password dengan bcrypt
      if (!user.password) {
        return res.status(500).json({ error: 'User password is missing' });
      }

      // Cek apakah password yang dimasukkan sesuai dengan hash di database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Kirim data pengguna beserta rolenya jika login berhasil
      const responseData = {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role_user?.role?.name, // Mendapatkan nama role
      };

      return res.status(200).json(responseData); // Mengembalikan response data pengguna

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error processing request' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' }); // Jika bukan metode POST
  }
}
