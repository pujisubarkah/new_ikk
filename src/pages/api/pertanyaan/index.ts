// pages/api/instrument/question.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // pastikan path sesuai dengan tempat prisma client kamu
import { serializeBigInt } from '@/lib/serializeBigInt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ambil hanya kolom yang diperlukan dari instrument_question dan instrument_answer
    const questions = await prisma.instrument_question.findMany({
      select: {
        id: true, // id tetap diambil, karena kita butuh relasi
        dimension_name: true,
        indicator_column_code: true,
        indicator_question: true,
        // indicator_description: true, // Removed as it does not exist in the schema
        instrument_answer: {
          select: {
            level_id: true,
            level_score: true,
            level_description: true, // hanya ambil level_description
          },
        },
      },
    });

    // Serialize BigInt agar bisa dikirimkan dalam JSON
    const serializedQuestions = questions.map((question: Record<string, unknown>) => serializeBigInt(question as Record<string, unknown>));

    // Kirim data yang sudah diserialisasi
    res.status(200).json({ data: serializedQuestions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
