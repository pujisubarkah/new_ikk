"use client";
import { useEffect, useState } from "react";
import PolicySummaryCard from "./PolicySummaryCard";

interface Summary {
  [key: string]: number;
}

export default function PolicySummary() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const adminId = localStorage.getItem("id");
      if (!adminId) return setLoading(false);  // kalau ga ada id, stop loading juga

      try {
        const res = await fetch(`/api/policies/${adminId}/summary`);
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error("❌ Gagal fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Memuat data kebijakan...</p>;
  if (!summary) return <p>Tidak ada data summary ditemukan.</p>;

  // Mapping key API ke label user-friendly dan warna
  const summaryMap = [
    { key: "DIAJUKAN", label: "Diajukan", color: "yellow" },
    { key: "DISETUJUI", label: "Disetujui", color: "green" },
    { key: "DITOLAK", label: "Ditolak", color: "red" },
    // Tambah lagi kalau mau
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {summaryMap.map(({ key, label, color }) => (
        <PolicySummaryCard
          key={key}
          label={label}
          count={summary[key] || 0}
          color={color}
        />
      ))}
    </div>
  );
}
