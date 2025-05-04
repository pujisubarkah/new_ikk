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
    const { koor_instansi_id, name, nip, unit_kerja, agency_id } = req.body;

    if (!koor_instansi_id || !name || !nip || !unit_kerja || !agency_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // First, check if the user (analis) already exists
      let user = await prisma.user.findUnique({
        where: { username: nip },
      });

      // If user doesn't exist, create a new one
      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            username: nip,
            work_unit: unit_kerja,
            agency_id: BigInt(agency_id),
          
          },
        });
      }

      // Create the koor_instansi_analis relationship
      const newKoorInstansiAnalis = await prisma.koor_instansi_analis.create({
        data: {
          id: undefined, // Let Prisma auto-generate the ID
          koor_instansi_id: BigInt(koor_instansi_id),
          analis_instansi_id: user.id,
        },
      });

      return res.status(201).json({
        id: newKoorInstansiAnalis.id.toString(),
        koor_instansi_id: newKoorInstansiAnalis.koor_instansi_id ? newKoorInstansiAnalis.koor_instansi_id.toString() : null,
        analis_instansi_id: newKoorInstansiAnalis.analis_instansi_id ? newKoorInstansiAnalis.analis_instansi_id.toString() : null,
      });
    } catch (error) {
      console.error('Error creating data:', error);
      return res.status(500).json({ error: 'Failed to create data' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}