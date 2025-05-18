import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'ID is required as a query parameter' });
  }

  if (req.method === 'GET') {
    const { koor_instansi_id } = req.query;

    if (!koor_instansi_id || Array.isArray(koor_instansi_id)) {
      return res.status(400).json({ error: 'koor_instansi_id is required' });
    }

    try {
      const data = await prisma.koor_instansi_analis.findMany({
        where: {
          koor_instansi_id: BigInt(koor_instansi_id),
        },
        include: {
          user_koor_instansi_analis_koor_instansi_idTouser: {
            select: {
              id: true,
              name: true,
              username: true,
              work_unit: true,
              agency_id: true,
              agencies: {
                select: { name: true },
              },
            },
          },
          user_koor_instansi_analis_analis_instansi_idTouser: {
            select: {
              id: true,
              name: true,
              username: true,
              work_unit: true,
              agency_id: true,
              agencies: {
                select: { name: true },
              },
            },
          },
        },
      });

      if (data.length === 0) {
        return res.status(404).json({ error: 'No data found for this koor_instansi_id' });
      }

      const koorUser = data[0].user_koor_instansi_analis_koor_instansi_idTouser;
      const koor_instansi = koorUser
        ? {
            id: koorUser.id.toString(),
            name: koorUser.name,
            username: koorUser.username,
            work_unit: koorUser.work_unit,
            agency_id: koorUser.agency_id?.toString() ?? null,
            agency_name: koorUser.agencies?.name ?? null,
          }
        : null;

      // Helper function to validate structure
      function isValidAnalisisRecord(item: unknown): item is {
        user_koor_instansi_analis_analis_instansi_idTouser: {
          id: bigint;
          name: string | null;
          username: string | null;
          work_unit: string | null;
          agency_id: bigint | null;
          agencies: { name: string | null } | null;
        } | null
      } {
        return (
          typeof item === 'object' &&
          item !== null &&
          'user_koor_instansi_analis_analis_instansi_idTouser' in item
        );
      }

      const analis_instansi = data
        .filter(isValidAnalisisRecord)
        .filter((item) => item.user_koor_instansi_analis_analis_instansi_idTouser !== null)
        .map((item) => {
          const analis = item.user_koor_instansi_analis_analis_instansi_idTouser!;
          return {
            id: analis.id.toString(),
            nama: analis.name,
            nip: analis.username,
            unit_kerja: analis.work_unit,
            agency_id: analis.agency_id?.toString() ?? null,
            agency_name: analis.agencies?.name ?? null,
          };
        });

      return res.status(200).json({ koor_instansi, analis_instansi });
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
  }


  // Handle PUT request to update an existing enumerator by id
  if (req.method === 'PUT') {
    const { name, username, work_unit, email, position, phone, password } = req.body;

    if (!name || !username || !work_unit) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const updatedEnumerator = await prisma.koor_instansi_analis.update({
        where: { id: BigInt(id as string) }, // Use dynamic ID parameter from the URL
        data: {
          user_koor_instansi_analis_analis_instansi_idTouser: {
            update: {
              name: name,
              username: username,
              email: email,
              position: position,
              phone: phone,
              work_unit: work_unit,
              password: password,
            },
          },
        },
      });
      
      // Convert BigInt values to strings
      const serializedupdatedEnumerator = JSON.parse(
        JSON.stringify(updatedEnumerator, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )
    );

      return res.status(200).json(serializedupdatedEnumerator);
    } catch (error) {
      console.error('Error updating enumerator:', error);
      return res.status(500).json({ error: 'Failed to update enumerator' });
    }
  }

  // Handle DELETE request to remove an enumerator by id
  if (req.method === 'DELETE') {
    try {
      const deletedEnumerator = await prisma.koor_instansi_analis.delete({
        where: { id: BigInt(id as string) }, // Use dynamic ID parameter from the URL
      });

      return res.status(200).json({ message: 'Enumerator deleted successfully', deletedEnumerator });
    } catch (error) {
      console.error('Error deleting enumerator:', error);
      return res.status(500).json({ error: 'Failed to delete enumerator' });
    }
  }

  // Method Not Allowed
  return res.status(405).json({ error: 'Method Not Allowed' });
}
