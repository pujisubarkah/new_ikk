import { NextApiRequest, NextApiResponse } from 'next';
import prisma  from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const user = await prisma.user.findUnique({ where: { id: BigInt(id) } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
      }
      break;

    case 'PUT':
      try {
        const updatedUser = await prisma.user.update({
          where: { id: BigInt(id) },
          data: req.body,
        });
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(400).json({ error: 'Failed to update user' });
      }
      break;

    case 'DELETE':
      try {
        const deletedUser = await prisma.user.update({
          where: { id: BigInt(id) },
          data: { deleted: '1', deleted_at: new Date() },
        });
        res.status(200).json(deletedUser);
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
