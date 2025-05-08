import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    created_by,
    modified_by = null,
    koor_instansi_id,
    analis_instansi_id,
  } = req.body;

  // Validasi input
  if (
    !koor_instansi_id ||
    !analis_instansi_id ||
    Array.isArray(koor_instansi_id) ||
    Array.isArray(analis_instansi_id)
  ) {
    return res.status(400).json({ error: 'Missing or invalid koor_instansi_id or analis_instansi_id' });
  }

  try {
    // Opsional: Cek apakah sudah ada relasi yang sama
    const existing = await prisma.koor_instansi_analis.findFirst({
      where: {
        koor_instansi_id: BigInt(koor_instansi_id),
        analis_instansi_id: BigInt(analis_instansi_id),
      },
    });

    if (existing) {
      return res.status(409).json({ error: 'Relation already exists' });
    }

    // Insert data baru
    await prisma.koor_instansi_analis.create({
      data: {
        created_by: created_by ? BigInt(created_by) : undefined,
        modified_by: modified_by ? BigInt(modified_by) : undefined,
        koor_instansi_id: BigInt(koor_instansi_id),
        analis_instansi_id: BigInt(analis_instansi_id),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Ambil ulang data seperti GET
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

    const koorUser = data[0]?.user_koor_instansi_analis_koor_instansi_idTouser;

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

    const analis_instansi = data
      .map((item) => item.user_koor_instansi_analis_analis_instansi_idTouser)
      .filter(Boolean)
      .map((analis) => ({
        id: analis.id.toString(),
        nama: analis.name,
        nip: analis.username,
        unit_kerja: analis.work_unit,
        agency_id: analis.agency_id?.toString() ?? null,
        agency_name: analis.agencies?.name ?? null,
      }));

    return res.status(201).json({ koor_instansi, analis_instansi });
  } catch (error) {
    console.error('Error creating entry:', error);
    return res.status(500).json({ error: 'Failed to create entry', detail: error instanceof Error ? error.message : error });
  }
}
