"use client";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface PolicyCount {
  label: string;
  count: number;
  color: "yellow" | "green" | "red"; // Warna dibatasi agar aman
}

export default function PolicySummaryCard({ label, count, color }: PolicyCount) {
  const renderIcon = () => {
    switch (label) {
      case "Diajukan":
        return <FaHourglassHalf className="text-yellow-600" />;
      case "Disetujui":
        return <FaCheckCircle className="text-green-600" />;
      case "Ditolak":
        return <FaTimesCircle className="text-red-600" />;
      default:
        return null;
    }
  };

  // Mapping warna berdasarkan prop `color`
  const bgColor =
    color === "green"
      ? "bg-green-50"
      : color === "red"
      ? "bg-red-50"
      : "bg-yellow-50";

  const borderColor =
    color === "green"
      ? "border-green-300"
      : color === "red"
      ? "border-red-300"
      : "border-yellow-300";

  const textColor =
    color === "green"
      ? "text-green-700"
      : color === "red"
      ? "text-red-700"
      : "text-yellow-700";

  const iconBg =
    color === "green"
      ? "bg-green-100"
      : color === "red"
      ? "bg-red-100"
      : "bg-yellow-100";

  return (
    <div
      className={`${bgColor} ${borderColor} border-l-4 p-4 rounded-lg shadow-md flex flex-col items-center justify-between gap-3 sm:gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer w-[300px] sm:w-[350px] m-2`}
    >
      <div className={`${textColor} font-semibold text-base sm:text-lg text-center`}>
      {label}
      </div>
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${iconBg}`}>
      <span className="text-xl sm:text-2xl">{renderIcon()}</span>
      <span className="font-bold text-lg sm:text-xl">{count}</span>
      </div>
    </div>
  );
}
