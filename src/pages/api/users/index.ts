import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'; // Import Prisma Client
import bcrypt from 'bcryptjs'; // Mengimpor bcrypt untuk enkripsi password

// Mendefinisikan tipe untuk body POST
interface CreateUserBody {
  email: string;
  name: string;
  nik: string;
  password: string;
  phone: string;
  position: string;
  status: string;
  username: string;
  work_unit: string;
  agency_id?: number;
  coordinator_type_id?: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Mengambil data semua pengguna
        const users = await prisma.user.findMany();

        // Menambahkan replacer untuk mengonversi BigInt menjadi string
        const usersWithStringBigInt = users.map(user => {
          const userCopy: Record<string, string | number | boolean | null> = {};

          // Mengonversi BigInt ke string dan Date ke ISO string untuk setiap property
          Object.keys(user).forEach(key => {
            const value = user[key as keyof typeof user];
            if (typeof value === 'bigint') {
              userCopy[key] = value.toString();
            } else if (value instanceof Date) {
              userCopy[key] = value.toISOString();
            } else {
              userCopy[key] = value;
            }
          });
          
          return userCopy;
        });

        // Mengembalikan data pengguna dengan status 200
        res.status(200).json(usersWithStringBigInt);
      } catch (error) {
        console.error('Error occurred while fetching users:', error);
        res.status(500).json({ error: 'Server error' });
      }
      break;

    case 'POST':
      try {
        // Menangani body request POST
        const {
          email,
          name,
          nik,
          password,
          phone,
          position,
          status,
          username,
          work_unit,
          agency_id,
          coordinator_type_id,
        }: CreateUserBody = req.body;

        // Mengenkripsi password menggunakan bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Membuat pengguna baru dengan password yang telah terenkripsi
        const newUser = await prisma.user.create({
          data: {
            email,
            name,
            nik,
            password: hashedPassword, // Menyimpan password yang telah terenkripsi
            phone,
            position,
            status,
            username,
            work_unit,
            agency_id,
            coordinator_type_id,
            created_at: new Date(),
            updated_at: new Date(),
            deleted: '0', // Status deleted defaultnya '0'
          },
        });

        // Mengembalikan pengguna yang baru dibuat
        res.status(201).json(newUser);
      } catch (error) {
        console.error('Error occurred while creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
      }
      break;

    default:
      // Jika metode tidak diizinkan
      res.status(405).json({ error: 'Method Not Allowed' });
      break;
  }
};

export default handler;
