// pages/kebijakan/index.tsx
"use client";
import Sidebar from "@/components/sidebar-koorins";
import PolicySummary from "@/components/daftar/PolicySummary"; 
import PolicyTabTable from "@/components/daftar/PolicyTabTable";
import AddPolicyFormDialog from "@/components/daftar/AddPolicyFormDialog";

export default function KebijakanTable() {
  return (
    <Sidebar>
      <div className="flex flex-col p-6 space-y-6 bg-gray-50">
        {/* Summary Cards */}
        <PolicySummary />

        {/* Header & Tombol Aksi */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-700">Daftar Kebijakan</h2>
          <div className="flex gap-4">
            <AddPolicyFormDialog />
          </div>
        </div>

        {/* Tabs & Tabel */}
        <PolicyTabTable />
      </div>
    </Sidebar>
  );
}
