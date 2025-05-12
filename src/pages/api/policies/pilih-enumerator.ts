import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serializeBigInt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Received request body:", req.body);

  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({
      error: "Method not allowed",
      received_body: req.body,
      allowed_methods: ["POST", "PUT"]
    });
  }

  const { policyId, analystId } = req.body;

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
    let policyIdBigInt: bigint;
    let analystIdBigInt: bigint;

    try {
      policyIdBigInt = BigInt(policyId);
      analystIdBigInt = BigInt(analystId);
    } catch (e) {
      return res.status(400).json({
        error: "Invalid ID format",
        message: "IDs must be valid numeric strings",
        received_body: req.body,
        conversion_error: e instanceof Error ? e.message : "Unknown error"
      });
    }

    console.log(`Trying to update policy with ID: ${policyIdBigInt} and analyst ID: ${analystIdBigInt}`);

    const result = await prisma.$transaction(async (prisma) => {
      const updatedPolicy = await prisma.policy.update({
        where: { id: policyIdBigInt },
        data: {
          enumerator_id: analystIdBigInt,
          processed_by_enumerator_id: analystIdBigInt,
          assigned_by_admin_at: new Date(),
          policy_process: "PROSES"
        }
      });

      return {
        success: true,
        data: updatedPolicy
      };
    });

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

  } catch (error: unknown) {
    let errorMessage = "Unknown error";
    let stackTrace: string | undefined = undefined;

    if (error instanceof Error) {
      errorMessage = error.message;
      stackTrace = error.stack;
    }

    console.error("Error assigning analyst:", {
      error: errorMessage,
      stack: stackTrace,
      received_body: req.body
    });

    return res.status(500).json({
      error: "Failed to assign analyst",
      message: errorMessage,
      received_body: req.body,
      details: process.env.NODE_ENV === 'development' ? {
        stack: stackTrace,
        raw_error: serializeBigInt(error as Record<string, unknown>)
      } : undefined
    });
  }
}
