// pages/api/policies/update-status.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log the incoming request body to see if it contains policyIds and userId
    console.log("Request body:", req.body);

    const { policyIds, userId } = req.body; // Array of policy IDs and the user ID

    // Log the policyIds and userId values to check if they are being correctly passed
    console.log("policyIds:", policyIds);
    console.log("userId:", userId);

    if (!Array.isArray(policyIds) || policyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Policy IDs are required and must be an array.',
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required.',
      });
    }

    // Update the status of multiple policies for the specific user
    const updatedPolicies = await prisma.policy.updateMany({
      where: {
        id: { in: policyIds.map(id => BigInt(id)) }, // Convert each ID to BigInt
        created_by: userId, // Only update policies created by the specific user
      },
      data: {
        policy_status: 'SEDANG_VERIFIKASI',
      },
    });

    return res.status(200).json({
      success: true,
      message: `${updatedPolicies.count} kebijakan berhasil diperbarui menjadi SEDANG_VERIFIKASI`,
      data: updatedPolicies, // Mengembalikan hasil update
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : null,
    });
  }
}
