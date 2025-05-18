// pages/api/instrument/question.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const questions = await prisma.instrument_question.findMany({
      select: {
        id: true,
        dimension_name: true,
        indicator_column_code: true,
        indicator_question: true,
        indicator_description: true,
        bukti_dukung_description: true,
        instrument_answer: {
          select: {
            level_id: true,
            level_score: true,
            level_description: true,
          },
        },
      },
    });

    const serializedQuestions = questions.map((question: any) =>
      serializeBigInt({
        ...question,
        full_description: `${question.indicator_description ?? ""} ${question.bukti_dukung_description ?? ""}`.trim(),
      })
    );

    res.status(200).json({ data: serializedQuestions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
