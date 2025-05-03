// pages/api/check-nip.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid username' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username
      }
    });

    return res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error('Error checking username:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
