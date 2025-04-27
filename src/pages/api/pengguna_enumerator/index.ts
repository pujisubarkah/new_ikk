import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { serializeBigInt } from '@/lib/serializeBigInt';  // Pastikan file serializeBigInt.ts bener

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { admin_instansi_id } = req.query;

  // Pastikan admin_instansi_id dikirim
  if (!admin_instansi_id) {
    return res.status(400).json({ message: 'Missing required query parameter: admin_instansi_id' });
  }

  try {
    // Ambil enumerator yang sesuai admin_instansi_id
    const adminInstansiEnumerators = await prisma.admin_instansi_enumerator.findMany({
      where: {
        admin_instansi_id: BigInt(admin_instansi_id as string), // Konversi ke BigInt
      },
      include: {
        user_admin_instansi_enumerator_admin_instansi_idTouser: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        user_admin_instansi_enumerator_enumerator_idTouser: {
          select: {
            id: true,
            name: true,
            username: true,
            work_unit: true,
          },
        },
      },
    });

    if (adminInstansiEnumerators.length === 0) {
      return res.status(404).json({ message: 'No enumerators found for the given admin_instansi_id' });
    }

    // Group data berdasarkan admin_instansi_id
    const groupedData = adminInstansiEnumerators.reduce((acc, item) => {
      const adminId = item.admin_instansi_id?.toString();

      if (adminId !== undefined && !acc[adminId]) {
        acc[adminId] = {
          admin_instansi_id: { id: adminId },
          enumerator: [],
        };
      }

      const enumerator = item.user_admin_instansi_enumerator_enumerator_idTouser;
      if (enumerator) {
        acc[adminId!].enumerator.push({
          enumerator_id: enumerator.id.toString(),
          name: enumerator.name,
          nip: enumerator.username,
          unit_kerja: enumerator.work_unit,
         
        });
      }

      return acc;
    }, {} as Record<string, { admin_instansi_id: { id: string }, enumerator: { enumerator_id: string, name: string | null, nip: string | null, unit_kerja: string | null }[] }>);

    // Serialize BigInt jika ada
    const serializedData = Object.values(groupedData).map(group => serializeBigInt(group));

    return res.status(200).json(serializedData);
  } catch (error) {
    console.error('Error fetching admin_instansi_enumerator:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
