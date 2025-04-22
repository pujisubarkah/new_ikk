import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { role_id } = req.query;

    try {
      const users = await prisma.user.findMany({
        where: role_id
          ? {
              role_user: {
                role_id: BigInt(role_id as string),
              },
            }
          : undefined,
        include: {
          role_user: true,
          agencies: true, // Ensure the 'agencies' data is included
        },
      });

      const serializedUsers = users.map(user => ({
        ...user,
        id: user.id.toString(),
        created_at: user.created_at?.toISOString(),
        updated_at: user.updated_at?.toISOString(),
        deleted_at: user.deleted_at?.toISOString(),
        deleted_by: user.deleted_by?.toString(),
        created_by: user.created_by?.toString(),
        modified_by: user.modified_by?.toString(),
        agency_id: user.agency_id?.toString(),
        coordinator_type_id: user.coordinator_type_id?.toString(),
        agency_name: user.agencies?.name || null,  // Only the name of the agency
        role_user: user.role_user
          ? {
              ...user.role_user,
              role_id: user.role_user.role_id.toString(),
              user_id: user.role_user.user_id?.toString(),
            }
          : null,
      }));

      // Serialize BigInt values safely
      const safeJson = JSON.stringify(serializedUsers, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );

      res.status(200).send(safeJson);
    } catch (error) {
      console.error('Error fetching users:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Error fetching users', details: errorMessage });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
