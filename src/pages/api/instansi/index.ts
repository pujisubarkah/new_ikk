import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { active_year, agency_id_panrb } = req.body;

    if (!active_year || !agency_id_panrb) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const newAgency = await prisma.agencies.create({
        data: {
          active_year,
          agency_id_panrb,
        },
      });

      return res.status(201).json(newAgency);
    } catch (error) {
      console.error('Error creating agency:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const agencies = await prisma.agencies.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          active_year: true,
          instansi: {
            select: {
              agency_id: true,
              agency_name: true,
              instansi_kategori: {
                select: {
                  id: true,
                  kat_instansi: true
                }
              }
            }
          },
        },
      })

      // Pakai serializeBigInt untuk handle BigInt
      const serializedAgencies = agencies.map((agency: Record<string, unknown>) => serializeBigInt(agency))

      return res.status(200).json(serializedAgencies)
    } catch (error) {
      console.error('Error fetching agencies:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });

}
