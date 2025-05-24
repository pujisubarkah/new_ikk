"use client";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface PolicyCount {
  label: string;
  count: number;
  color: "blue" | "amber" | "green" | "red"; // Sesuai dengan tab yang ada
}

export default function PolicySummaryCard({ label, count, color }: PolicyCount) {
  const renderIcon = () => {
    switch (label) {
      case "Diajukan":
        return <FaHourglassHalf />;
      case "Disetujui":
        return <FaCheckCircle />;
      case "Ditolak":
        return <FaTimesCircle />;
      default:
        return null;
    }
  };

  // Mapping warna gradien sesuai dengan warna label
  const getBgGradient = () => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-blue-700";
      case "amber":
        return "from-yellow-500 to-yellow-700";
      case "green":
        return "from-green-500 to-green-700";
      case "red":
        return "from-red-500 to-red-700";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  return (
    <div
      className={`bg-gradient-to-br ${getBgGradient()} text-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col items-center justify-between h-full transform transition-transform hover:scale-105 hover:shadow-xl cursor-pointer`}
    >
      <p className="text-sm font-medium uppercase tracking-wide text-center">
        {label}
      </p>
      <div className="flex items-center justify-center mt-2">
        <span className="text-3xl md:text-4xl font-extrabold">{count}</span>
        <span className="ml-2 text-xl md:text-2xl opacity-80">
          {renderIcon()}
        </span>
      </div>
    </div>
  );
}