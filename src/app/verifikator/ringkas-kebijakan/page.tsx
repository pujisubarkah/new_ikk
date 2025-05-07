"use client";

// pages/index.js
import { useState } from "react";
import Sidebar from '@/components/sidebar-verif';
import { Paperclip, RefreshCcw, MessageSquare, XCircle } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [documentTopic, setDocumentTopic] = useState("");

  const validTopics = ["kebijakan tata ruang", "perencanaan wilayah", "pembangunan kota"]; // Daftar topik yang valid

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      
      // Check if the file is a PDF
      if (uploadedFile.type !== 'application/pdf') {
        setError("Please upload a valid PDF document.");
        setFile(null);
        return;
      }
      
      setFile(uploadedFile);
      setError(""); // Clear any previous error
    }
  };

  const handleSummarize = async () => {
    if (!file) return alert("Please upload a PDF file");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        if (!data.summary) {
          setError("The document does not contain enough text to summarize.");
          setSummary(""); // Clear previous summary
        } else {
          // Extract document topic (You can integrate NLP or ML model for this)
          const extractedTopic = extractTopicFromText(data.summary);

          if (!validTopics.includes(extractedTopic)) {
            setError(`This document is not relevant to the expected topic: ${extractedTopic}`);
            setSummary(""); // Clear summary if topic is incorrect
          } else {
            setSummary(data.summary);
            setError(""); // Clear error if successful
          }

          setDocumentTopic(extractedTopic); // Set extracted topic for display
        }
      } else {
        setError(data.error || "Failed to summarize");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError("An error occurred: " + error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Dummy function to simulate topic extraction. This can be replaced with a proper NLP model
  const extractTopicFromText = (text: string) => {
    // Simple keyword-based topic detection
    const keywords = {
      "kebijakan tata ruang": ["tata ruang", "ruang wilayah", "perencanaan wilayah"],
      "energi": ["energi", "listrik", "sumber daya energi"],
      // Add other topics here
    };

    for (const topic in keywords) {
      for (const keyword of keywords[topic as keyof typeof keywords]) {
        if (text.toLowerCase().includes(keyword)) {
          return topic;
        }
      }
    }
    return "unknown"; // If no topic matched
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Sidebar>
        <></>
      </Sidebar>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">
          <MessageSquare className="w-8 h-8 inline-block mr-2 text-blue-600" />
          AI Ringkas Kebijakan
        </h1>

        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-4">
            {/* Chat-like Interface */}
            <div className="flex flex-col space-y-4">
              <div className="flex justify-start">
                <div className="bg-blue-100 p-3 rounded-lg max-w-xs">
                  <p className="text-gray-700 text-sm">
                    Upload a PDF file to get a summary.
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex justify-start">
                  <div className="bg-red-100 p-3 rounded-lg max-w-xs flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div className="flex justify-start items-center space-x-2">
                <Paperclip className="w-5 h-5 text-gray-600" />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md"
                />
              </div>

              {/* Summarize Button */}
              <div className="flex justify-start">
                <button
                  onClick={handleSummarize}
                  disabled={isLoading}
                  className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
                    isLoading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
                >
                  <RefreshCcw className="w-5 h-5 inline-block mr-2" />
                  {isLoading ? "Summarizing..." : "Summarize Document"}
                </button>
              </div>

              {/* Document Topic */}
              {documentTopic && documentTopic !== "unknown" && (
                <div className="flex justify-start">
                  <div className="bg-green-100 p-3 rounded-lg max-w-xs">
                    <p className="text-green-700 text-sm">Topic detected: {documentTopic}</p>
                  </div>
                </div>
              )}

              {/* Chat Response Area */}
              {summary && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                    <p className="text-gray-700 text-sm">{summary}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
