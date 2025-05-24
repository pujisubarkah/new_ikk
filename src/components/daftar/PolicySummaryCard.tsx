import { CheckCircle, XCircle, Clock } from "lucide-react";

interface PolicySummaryCardProps {
  label: string;
  count: number;
  color: "amber" | "green" | "red";
}

const iconMap = {
  amber: <Clock className="text-amber-500 w-6 h-6" />,
  green: <CheckCircle className="text-green-500 w-6 h-6" />,
  red: <XCircle className="text-red-500 w-6 h-6" />,
};

const colorClasses = {
  amber: "bg-amber-100 text-amber-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
};

export default function PolicySummaryCard({
  label,
  count,
  color,
}: PolicySummaryCardProps) {
  return (
    <div className={`p-5 rounded-xl shadow-sm ${colorClasses[color]} transition-all duration-300`}>
      <div className="flex items-center space-x-3 mb-2">
        {iconMap[color]}
        <h2 className="text-lg font-semibold">{label}</h2>
      </div>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
}
