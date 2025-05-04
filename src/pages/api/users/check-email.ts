import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email || Array.isArray(email)) {
    return res.status(400).json({ message: 'Email tidak valid' });
  }

  try {
    console.log('Cek email:', email);

    const user = await prisma.user.findUnique({
      where: { email: email as string },
    });

    return res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
