import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Sesuaikan dengan path prisma yang kamu gunakan

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { validatorId } = req.query;

  if (req.method === 'GET') {
    if (!validatorId) {
      return res.status(400).json({ error: 'Validator ID is required' });
    }

    try {
      // Ambil data koordinator instansi berdasarkan validator_id
      const coordinators = await prisma.koor_instansi_validator.findMany({
        where: {
          validator_id: BigInt(validatorId as string),
        },
        include: {
          user_koor_instansi_validator_koor_instansi_idTouser: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });

      // Format data yang akan dikirimkan ke frontend dan serialize BigInt
      const result = coordinators.map((item) => ({
        id: item.user_koor_instansi_validator_koor_instansi_idTouser?.id?.toString() ?? null,
        name: item.user_koor_instansi_validator_koor_instansi_idTouser?.name ?? null,
        username: item.user_koor_instansi_validator_koor_instansi_idTouser?.username ?? null,
      }));

      res.status(200).json(result);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
