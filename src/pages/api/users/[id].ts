import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const userId = BigInt(id as string);

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          agencies: true,
          coordinator_types: true,
          role_user: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const simplifiedUser = {
        id: user.id.toString(),
        name: user.name,
        username: user.username,
        status: user.status,
        work_unit: user.work_unit,
        position: user.position,
        agency_id: user.agency_id?.toString() || null,
        agency_name: user.agencies?.name || null,
        coordinator_type_id: user.coordinator_type_id?.toString() || null,
        coordinator_type_name: user.coordinator_types?.name || null,
        role_id: user.role_user?.role_id?.toString() || null,
        created_at: user.created_at?.toISOString() || null,
        updated_at: user.updated_at?.toISOString() || null,
      };

      return res.status(200).json(simplifiedUser);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  else if (req.method === 'PUT') {
    const { name, username, password, status, agency_id, coordinator_type_id, work_unit, position } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          username,
          password,
          status,
          work_unit,
          position,
          agency_id: agency_id ? BigInt(agency_id) : undefined,
          coordinator_type_id: coordinator_type_id ? BigInt(coordinator_type_id) : undefined,
        },
      });

      return res.status(200).json({
        id: updatedUser.id.toString(),
        name: updatedUser.name,
        username: updatedUser.username,
        status: updatedUser.status,
        work_unit: updatedUser.work_unit,
        position: updatedUser.position,
        agency_id: updatedUser.agency_id?.toString() || null,
        coordinator_type_id: updatedUser.coordinator_type_id?.toString() || null,
        updated_at: updatedUser.updated_at?.toISOString() || null,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      await prisma.user.delete({
        where: { id: userId },
      });

      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
