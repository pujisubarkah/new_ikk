"use client";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface PolicyCount {
  label: string;
  count: number;
  color: string;
}

export default function PolicySummaryCard({ label, count, color }: PolicyCount) {
  // Tailwind dynamic classes workaround:
  const bgColor = `bg-${color}-100`;
  const borderColor = `border-${color}-300`;
  const textColor = `text-${color}-700`;
  const iconColor = `text-${color}-600`;

  const renderIcon = () => {
    if (label === "Diajukan") return <FaHourglassHalf />;
    if (label === "Disetujui") return <FaCheckCircle />;
    if (label === "Ditolak") return <FaTimesCircle />;
    return null;
  };

  return (
    <div
        className={`w-full flex items-center justify-between ${bgColor} ${borderColor} p-5 rounded-lg shadow-md
      hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
    >
      <div className={`${textColor} font-semibold text-lg`}>{label}</div>
      <div className={`flex items-center gap-3 ${iconColor} font-bold text-2xl`}>
        {renderIcon()}
        {count}
      </div>
    </div>
  );
}
