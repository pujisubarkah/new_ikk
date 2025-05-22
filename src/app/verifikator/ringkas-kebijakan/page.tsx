"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar-verif"; // Sesuaikan dengan struktur Anda
import { RefreshCcw, MessageSquare, XCircle } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Set worker source to CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

export default function PdfSummarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const MAX_CHAR = 20000;

  const handleSummarize = async () => {
    if (!text.trim()) return alert("Please upload a PDF or paste some text.");

    if (text.length > MAX_CHAR) {
      setError(`Text exceeds maximum allowed length of ${MAX_CHAR} characters.`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/summarize-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
      } else {
        setError(data.message || "Failed to summarize");
      }
    } catch {
      setError("An error occurred while summarizing.");
    } finally {
      setIsLoading(false);
    }
  };

  const extractTopicFromText = (text: string) => {
    const keywords = {
      "kebijakan tata ruang": ["tata ruang", "ruang wilayah", "perencanaan wilayah"],
      "energi": ["energi", "listrik", "sumber daya energi"],
    };

    for (const topic in keywords) {
      for (const keyword of keywords[topic as keyof typeof keywords]) {
        if (text.toLowerCase().includes(keyword)) {
          return topic;
        }
      }
    }
    return "unknown";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result as ArrayBuffer);

      try {
        const pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const strings = textContent.items.map((item: any) => item.str).join(" ");
          fullText += strings + "\n";
        }

        setText(fullText); // Simpan teks PDF ke state
        setError(""); // Reset error
      } catch (err) {
        setError("Failed to parse PDF content.");
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file.");
    };

    reader.readAsArrayBuffer(file);
  };

  const documentTopic = extractTopicFromText(summary);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Sidebar><></></Sidebar>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">
          <MessageSquare className="w-8 h-8 inline-block mr-2 text-blue-600" />
          AI Ringkas Kebijakan
        </h1>

        <div className="space-y-4">
          {/* Input File PDF */}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />

          {/* Tampilkan hasil parsing atau error */}
          {error && (
            <div className="bg-red-100 p-3 rounded-lg flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Tombol Summarize */}
          <button
            onClick={handleSummarize}
            disabled={isLoading || !text}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
              isLoading || !text ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            <RefreshCcw className="w-5 h-5 inline-block mr-2" />
            {isLoading ? "Summarizing..." : "Summarize Text"}
          </button>

          {/* Topic Detection */}
          {documentTopic && documentTopic !== "unknown" && (
            <div className="bg-green-100 p-3 rounded-lg">
              <p className="text-green-700 text-sm">Topik terdeteksi: {documentTopic}</p>
            </div>
          )}

          {/* Summary Result */}
          {summary && (
            <div className="bg-gray-100 p-3 rounded-lg whitespace-pre-wrap">
              <p className="text-gray-700 text-sm">{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
