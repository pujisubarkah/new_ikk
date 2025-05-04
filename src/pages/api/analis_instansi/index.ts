import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { koor_instansi_id } = req.query;

    if (!koor_instansi_id || Array.isArray(koor_instansi_id)) {
      return res.status(400).json({ error: 'koor_instansi_id is required as a single query parameter' });
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

      // Get koor_instansi data from first entry
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

      // Create analis_instansi array
      const analis_instansi = data
        .filter((item) => item.user_koor_instansi_analis_analis_instansi_idTouser)
        .map((item) => {
          const analis = item.user_koor_instansi_analis_analis_instansi_idTouser;
          return analis
            ? {
                id: analis.id.toString(),
                nama: analis.name,
                nip: analis.username,
                unit_kerja: analis.work_unit,
                agency_id: analis.agency_id?.toString() ?? null,
                agency_name: analis.agencies?.name ?? null,
              }
            : null;
        });

      return res.status(200).json({ koor_instansi, analis_instansi });
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
  }

  if (req.method === 'POST') {
    const { koor_instansi_id, analis_instansi_id } = req.body;

    if (!koor_instansi_id || !analis_instansi_id) {
      return res.status(400).json({ error: 'koor_instansi_id and analis_instansi_id are required' });
    }

    try {
      // Cek apakah relasi sudah ada sebelumnya
      const existingRelation = await prisma.koor_instansi_analis.findFirst({
        where: {
          koor_instansi_id: BigInt(koor_instansi_id),
          analis_instansi_id: BigInt(analis_instansi_id)
        }
      });

      if (existingRelation) {
        return res.status(409).json({ error: 'Relationship already exists' });
      }

      // Buat relasi baru
      const newRelation = await prisma.koor_instansi_analis.create({
        data: {
          koor_instansi_id: BigInt(koor_instansi_id),
          analis_instansi_id: BigInt(analis_instansi_id),
          created_at: new Date(),
          // created_by bisa ditambahkan jika diperlukan
          // created_by: BigInt(userId) 
        },
        include: {
          user_koor_instansi_analis_koor_instansi_idTouser: {
            select: { name: true }
          },
          user_koor_instansi_analis_analis_instansi_idTouser: {
            select: { name: true }
          }
        }
      });

      return res.status(201).json({
        id: newRelation.id.toString(),
        koor_instansi: {
          id: newRelation.koor_instansi_id?.toString(),
          name: newRelation.user_koor_instansi_analis_koor_instansi_idTouser?.name
        },
        analis_instansi: {
          id: newRelation.analis_instansi_id?.toString(),
          name: newRelation.user_koor_instansi_analis_analis_instansi_idTouser?.name
        },
        created_at: newRelation.created_at
      });

    } catch (error) {
      console.error('Error creating relation:', error);
      return res.status(500).json({ 
        error: 'Failed to create relation',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
}

  return res.status(405).json({ error: 'Method Not Allowed' });
}
