import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Invalid text input" });
  }

  // Simulasi summarization (ganti dengan model nyata jika perlu)
  const summary = text.split(".").slice(0, 3).join(".") + "...";

  return res.status(200).json({ summary });
}
