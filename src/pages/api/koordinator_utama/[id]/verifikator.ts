import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Koordinator Nasional ID is required',
    });
  }

  const koorNasionalId = BigInt(id as string);

  if (req.method === 'GET') {
    try {
      const validators = await prisma.koor_nasional_validator.findMany({
        where: {
          koor_nasional_id: koorNasionalId,
        },
        include: {
          user_koor_nasional_validator_validator_idTouser: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });

      // Ambil hanya bagian user yang dibutuhkan dan serialisasi id
      const result = validators
        .map((v) => v.user_koor_nasional_validator_validator_idTouser)
        .filter(Boolean) // Hilangkan null / undefined jika relasi tidak ditemukan
        .map((user) => serializeBigInt(user as Record<string, unknown>));

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching validators:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch validators',
      });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}