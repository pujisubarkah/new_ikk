import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Log seluruh request body untuk debugging
  console.log("Received request body:", req.body);

  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ 
      error: "Method not allowed",
      received_body: req.body,
      allowed_methods: ["POST", "PUT"]
    });
  }

  const { policyId, analystId } = req.body;

  // Validasi dengan menambahkan received_body
  if (!policyId || !analystId) {
    return res.status(400).json({ 
      error: "Policy ID and Analyst ID are required",
      received_body: req.body,
      required_fields: {
        policyId: "string",
        analystId: "string"
      }
    });
  }

  try {
    // Convert string IDs to BigInt dengan error handling
    let policyIdBigInt, analystIdBigInt;
    try {
      policyIdBigInt = BigInt(policyId); // Menggunakan policyId dari request body
      analystIdBigInt = BigInt(analystId); // Menggunakan analystId dari request body
    } catch (e) {
      return res.status(400).json({
        error: "Invalid ID format",
        message: "IDs must be valid numeric strings",
        received_body: req.body,
        conversion_error: e instanceof Error ? e.message : "Unknown error"
      });
    }

    // Debugging: Periksa data sebelum diupdate
    console.log(`Trying to update policy with ID: ${policyIdBigInt} and analyst ID: ${analystIdBigInt}`);

    // Update policy dengan transaction untuk rollback jika error
    const result = await prisma.$transaction(async (prisma) => {
      const updatedPolicy = await prisma.policy.update({
        where: { id: policyIdBigInt }, // Menggunakan id sebagai key pencarian
        data: {
          enumerator_id: analystIdBigInt, // Mengupdate enumerator_id
          processed_by_enumerator_id: analystIdBigInt, // Mengupdate processed_by_enumerator_id
          assigned_by_admin_at: new Date(), // Timestamp untuk assigned
          policy_process: "PROSES" // Status proses
        }
      });

      return {
        success: true,
        data: updatedPolicy
      };
    });

    // Serialize response dengan tambahan metadata
    const serializedResponse = serializeBigInt({
      ...result,
      metadata: {
        timestamp: new Date().toISOString(),
        processed_values: {
          policy_id: policyIdBigInt.toString(),
          enumerator_id: analystIdBigInt.toString()
        }
      }
    });

    return res.status(200).json(serializedResponse);

  } catch (error: any) {
    console.error("Error assigning analyst:", {
      error: error.message,
      stack: error.stack,
      received_body: req.body
    });

    return res.status(500).json({
      error: "Failed to assign analyst",
      message: error.message,
      received_body: req.body,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        raw_error: serializeBigInt(error)
      } : undefined
    });
  }
}
