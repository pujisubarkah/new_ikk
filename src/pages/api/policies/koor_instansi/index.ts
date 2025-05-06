import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { user_id } = req.query;

    if (!user_id || typeof user_id !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid user_id' });
    }

    try {
        // Fetch user with role_id = 4 and their related agencies and policies
        const userWithPolicies = await prisma.role_user.findFirst({
            where: {
                user_id: parseInt(user_id, 10),
                role_id: 4,
            },
            select: {
                user:{
                    select: {
                        id: true,
                        name: true,
                        agencies: {
                            select: {
                                active_year: true,
                                instansi: {
                                    select: {
                                        agency_name: true,
                                        },
                                    },
                                policy: {
                                    select: {
                                        id: true,
                                        name: true,
                                        is_valid: true,
                                        sector: true,
                                        type: true,
                                        file_url: true,
                                        progress: true,
                                        policy_process: true,
                                        policy_status: true,
                                    },
                                },
                            },

                            },
                    },
                    },
            },
        });

        if (!userWithPolicies) {
            return res.status(404).json({ error: 'User not found or does not have the required role' });
        }

        res.status(200).json(JSON.parse(JSON.stringify(userWithPolicies, (_, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
}