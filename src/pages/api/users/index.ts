import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const serializeUser = (user: { id: bigint; created_at: Date | null; updated_at: Date | null; deleted_at: Date | null; deleted_by: bigint | null; created_by: bigint | null; modified_by: bigint | null; agency_id: bigint | null; coordinator_type_id: bigint | null; role_user?: { role_id: bigint } | null }) => ({
  ...user,
  id: user.id.toString(), // Convert BigInt to string
  created_at: user.created_at ? user.created_at.toISOString() : null, // Handle null values
  updated_at: user.updated_at ? user.updated_at.toISOString() : null,
  deleted_at: user.deleted_at ? user.deleted_at.toISOString() : null,
  deleted_by: user.deleted_by ? user.deleted_by.toString() : null,
  created_by: user.created_by ? user.created_by.toString() : null,
  modified_by: user.modified_by ? user.modified_by.toString() : null,
  agency_id: user.agency_id ? user.agency_id.toString() : null,
  coordinator_type_id: user.coordinator_type_id ? user.coordinator_type_id.toString() : null,
  role_user: user.role_user ? {
    ...user.role_user,
    role_id: user.role_user.role_id.toString(), // Convert BigInt to string in role_user
  } : null, // Ensure role_user is not null if not present
});

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
        role_user: user.role_user
          ? {
              ...user.role_user,
              role_id: user.role_user.role_id.toString(),
              user_id: user.role_user.user_id?.toString(),
            }
          : null,
      }));

      res.status(200).json(serializedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Error fetching users', details: errorMessage });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}