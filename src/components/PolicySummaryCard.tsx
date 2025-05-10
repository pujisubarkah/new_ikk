// components/PolicySummaryCard.tsx
"use client";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface PolicyCount {
  label: string;
  count: number;
  color: string;
}

export default function PolicySummaryCard({ label, count, color }: PolicyCount) {
  const bgColor = `bg-${color}-100`;
  const textColor = `text-${color}-700`;
  const iconColor = `text-${color}-600`;

  return (
    <div className={`flex items-center justify-between ${bgColor} border border-${color}-300 p-4 rounded-lg shadow-sm`}>
      <div className={textColor + " font-semibold"}>{label}</div>
      <div className={`flex items-center gap-2 ${iconColor} font-bold text-xl`}>
        {label === "Diajukan" && <FaHourglassHalf />}
        {label === "Disetujui" && <FaCheckCircle />}
        {label === "Ditolak" && <FaTimesCircle />}
        {count}
      </div>
    </div>
  );
}