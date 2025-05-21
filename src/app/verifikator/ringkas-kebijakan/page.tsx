"use client";

import { useState } from "react";
import Sidebar from '@/components/sidebar-verif';
import { RefreshCcw, MessageSquare, XCircle } from 'lucide-react';

export default function PdfSummarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const MAX_CHAR = 20000; // Misal: batas maksimum karakter

  const handleSummarize = async () => {
    if (!text.trim()) return alert("Please paste some text from your PDF.");

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
    } catch (error) {
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

  const documentTopic = extractTopicFromText(summary);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Sidebar><></></Sidebar>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">
          <MessageSquare className="w-8 h-8 inline-block mr-2 text-blue-600" />
          AI Ringkas Kebijakan (Tanpa Upload PDF)
        </h1>

        <div className="space-y-4">
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text content from your PDF here..."
            className="w-full p-4 border border-gray-300 rounded-md"
          />

          {error && (
            <div className="bg-red-100 p-3 rounded-lg flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSummarize}
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            <RefreshCcw className="w-5 h-5 inline-block mr-2" />
            {isLoading ? "Summarizing..." : "Summarize Text"}
          </button>

          {documentTopic && documentTopic !== "unknown" && (
            <div className="bg-green-100 p-3 rounded-lg">
              <p className="text-green-700 text-sm">Topic detected: {documentTopic}</p>
            </div>
          )}

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
