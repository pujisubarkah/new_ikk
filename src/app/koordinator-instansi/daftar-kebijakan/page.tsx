// pages/kebijakan/index.tsx
"use client";
import Sidebar from "@/components/sidebar-koorins";
import PolicySummaryCard from "@/components/PolicySummaryCard";
import PolicyTabTable from "@/components/daftar/PolicyTabTable";
import AddPolicyFormDialog from "@/components/AddPolicyFormDialog";

export default function KebijakanTable() {
  return (
    <Sidebar>
      <div className="flex flex-col p-6 space-y-6 bg-gray-50">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <PolicySummaryCard label="Diajukan" count={0} color="blue" />
          <PolicySummaryCard label="Disetujui" count={0} color="green" />
          <PolicySummaryCard label="Ditolak" count={0} color="red" />
        </div>

        {/* Header & Tombol Aksi */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-700">Daftar Kebijakan</h2>
          <div className="flex gap-4">
            <AddPolicyFormDialog onPolicyAdded={() => {}} />
          </div>
        </div>

        {/* Tabs & Tabel */}
        <PolicyTabTable />
      </div>
    </Sidebar>
  );
}