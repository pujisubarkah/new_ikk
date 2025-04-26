import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { serializeBigInt } from '@/lib/serializeBigInt'; // Assuming this function is in lib/serializeBigInt.ts

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  try {
    if (method === "GET") {
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "A valid numeric Policy ID is required" });
      }

      // Fetch policy from the database
      const policy = await prisma.policies.findUnique({
        where: {
          id: BigInt(id as string),
        },
        select: {
          id: true,
          name: true,
          agencies: {
            select: {
              name: true,
            },
          },
          policy_details: {
            select: {
              progress: true,
              base_score: true,
              validationkiscore: true,
            },
          },
          policy_process: {
            select: {
              name: true,
            },
          },
          policy_status: true, // Include all fields from policy_status
        },
      });

      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }

      // Serialize BigInt to safely return JSON response
      const serializedPolicy = serializeBigInt(policy);

      // Prepare data for the response
      const rowData = {
        id: serializedPolicy.id,
        name: serializedPolicy.name,
        instansi: serializedPolicy.agencies?.name || null,
        progress_pengisian: serializedPolicy.policy_details?.progress || null,
        Nilai1: serializedPolicy.policy_details?.base_score || null,
        Nilai2: serializedPolicy.policy_details?.validationkiscore || null,
        status_kebijakan: serializedPolicy.policy_process?.name || null,
        policy_status: serializedPolicy.policy_status || null, // Include all policy_status fields
      };

      // Send the response back to the client
      res.status(200).json(rowData);

    } else {
      // Handle unsupported HTTP methods
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Ensure to disconnect Prisma client after the operation
    await prisma.$disconnect();
  }
}
