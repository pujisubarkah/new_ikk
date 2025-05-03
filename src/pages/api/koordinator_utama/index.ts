import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    if (!id) {
      return res.status(400).json({ error: 'Parameter id is required' });
    }

    try {
      const koorId = BigInt(id as string);

      // Ambil data validator yang terkait dengan koordinator nasional
      const data = await prisma.koor_nasional_validator.findMany({
        where: {
          koor_nasional_id: koorId,
        },
        select: {
          validator_id: true,
          user_koor_nasional_validator_validator_idTouser: {
            select: {
              name: true,
              username: true,
              work_unit: true,
            },
          },
        },
      });

      // Ambil koordinator instansi berdasarkan validator_id yang ada
      const koordinatorInstansiData = await prisma.koor_instansi_validator.findMany({
        where: {
          validator_id: { in: data.map(item => item.validator_id).filter((id): id is bigint => id !== null) },
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

      // Menggabungkan hasil validator dan koordinator instansi
      const result = data.map((item) => ({
        validator_id: item.validator_id,
        name: item.user_koor_nasional_validator_validator_idTouser?.name ?? null,
        username: item.user_koor_nasional_validator_validator_idTouser?.username ?? null,
        work_unit: item.user_koor_nasional_validator_validator_idTouser?.work_unit ?? null,
        koordinator_instansi: koordinatorInstansiData
          .filter(instansi => instansi.validator_id === item.validator_id)
          .map(instansi => ({
            id: instansi.user_koor_instansi_validator_koor_instansi_idTouser?.id ?? null,
            name: instansi.user_koor_instansi_validator_koor_instansi_idTouser?.name ?? null,
            username: instansi.user_koor_instansi_validator_koor_instansi_idTouser?.username ?? null,
          })),
      }));

      res.status(200).json(result.map(serializeBigInt));
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
