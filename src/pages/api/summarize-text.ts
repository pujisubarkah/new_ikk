import { NextRequest } from "next/server";

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions ";
const MODEL = "mistralai/mistral-7b-instruct"; // Ganti dengan model lain jika mau

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ message: "Invalid input: 'text' is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = `
Ringkas dokumen berikut dalam bahasa Indonesia menjadi maksimal 150 kata.
Berikan ringkasan yang jelas dan informatif tanpa tambahan penjelasan.

Dokumen:
${text}
`;

    const response = await fetch(OPENROUTER_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY!}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", // optional
        "X-Title": "PDF Summarizer", // optional
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content.trim() || "Summary could not be generated.";

    return new Response(
      JSON.stringify({ summary }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error.";
    console.error("Summarization error:", message);
    return new Response(
      JSON.stringify({ message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
