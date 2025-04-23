import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    console.log('Request Body:', req.body); // Log body request untuk memeriksa data yang dikirim

    if (!username || !password) {
      console.log('Missing username or password'); // Log jika username atau password tidak ada
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      // Cari user berdasarkan username
      console.log('Searching for user:', username); // Log username yang dicari
      const user = await prisma.user.findUnique({
        where: {
          username: username, // Ensure username is unique in the schema
        },
        include: {
          role_user: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        console.log(`User with username "${username}" not found`); // Log jika user tidak ditemukan
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('User found:', user); // Log data user yang ditemukan

      // Periksa password dengan bcrypt
      if (!user.password) {
        console.log('User password is missing'); // Log jika password tidak ditemukan
        return res.status(500).json({ error: 'User password is missing' });
      }

      // Cek apakah password yang dimasukkan sesuai dengan hash di database
      console.log('Comparing passwords'); // Log sebelum membandingkan password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        console.log('Invalid password'); // Log jika password tidak cocok
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Kirim data pengguna beserta rolenya jika login berhasil
      const responseData = {
        id: String(user.id), // Konversi id ke String
        name: user.name,
        username: user.username,
        role: user.role_user?.role?.name, // Mendapatkan nama role
        role_id: user.role_user?.role?.id.toString(), // Menambahkan role_id ke response dan mengonversi BigInt menjadi String
      };
      
      console.log('Login successful:', responseData); // Log data pengguna yang berhasil login
      return res.status(200).json(responseData); // Mengembalikan response data pengguna
    } catch (error) {
      console.error('Error processing request:', error); // Log error yang terjadi di dalam try-catch
      return res.status(500).json({ error: 'Error processing request' });
    }
  } else {
    console.log('Invalid method'); // Log jika metode bukan POST
    return res.status(405).json({ error: 'Method Not Allowed' }); // Jika bukan metode POST
  }
}
