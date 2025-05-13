"use client";

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Sidebar from "@/components/sidebar-koornas";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import TimVerifikasiTab from "@/components/koorutama/verifikatorTabs";
import PilihVerifikatorTab from "@/components/koorutama/pilihverifikatorTabs";

interface DataRow {
  no: number;
  nama: string;
  nip: string;
  validator_id?: string;
  work_unit?: string;
}

interface VerifikatorAPIResponse {
  agency_id_panrb: string;
  instansi: string;
  total_kebijakan: number;
}

interface VerifikatorData {
  no: number;
  instansi: string;
  total: number;
  id: string;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"koordinator" | "pilih-verifikator">("koordinator");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [koordinatorData, setKoordinatorData] = useState<DataRow[]>([]);
  const [verifikatorData, setVerifikatorData] = useState<VerifikatorData[]>([]);
  const [searchVerifikator, setSearchVerifikator] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Debounce pencarian tim verifikasi
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load data tim verifikasi
  useEffect(() => {
    const fetchKoordinatorData = async () => {
      const id = typeof window !== "undefined" ? localStorage.getItem("id") : null;
      if (id) {
        try {
          const response = await axios.get(`/api/koordinator_utama?id=${id}`);
          const formattedData = response.data.map((item: any, index: number) => ({
            no: index + 1,
            nama: item.name,
            nip: item.username,
            validator_id: item.validator_id,
            work_unit: item.work_unit,
          }));
          setKoordinatorData(formattedData);
        } catch (error) {
          console.error("Error fetching koordinator data:", error);
        }
      }
    };
    fetchKoordinatorData();
  }, []);

  // Load data verifikator saat tab aktif
  useEffect(() => {
    if (activeTab === "pilih-verifikator") {
      const fetchVerifikatorData = async () => {
        try {
          const res = await fetch("/api/koorinstansi/kebijakan_unverified");
          const result: VerifikatorAPIResponse[] = await res.json();
          const formatted = result.map((item, idx) => ({
            no: idx + 1,
            instansi: item.instansi || "-",
            total: item.total_kebijakan || 0,
            id: item.agency_id_panrb,
          }));
          setVerifikatorData(formatted);
        } catch (error) {
          console.error("Gagal memuat data verifikator", error);
        }
      };
      fetchVerifikatorData();
    }
  }, [activeTab]);

  const handleKeluarkan = (nama: string) => {
    if (confirm(`Yakin ingin mengeluarkan ${nama}?`)) {
      console.log(`Mengeluarkan ${nama}`);
    }
  };

  const handleTambah = () => {
    if (activeTab === "koordinator") {
      router.push("/koordinator-utama/pengguna/tambah-verifikator");
    } else {
      router.push("/koordinator-utama/pengguna/tambah-verifikator"); // Sesuaikan jika ada halaman tambah berbeda
    }
  };

  const totalPages = Math.ceil(
    verifikatorData.filter((item) =>
      item.instansi.toLowerCase().includes(searchVerifikator.toLowerCase())
    ).length / ITEMS_PER_PAGE
  );

  return (
    <Sidebar>
      <div className="w-full px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Daftar {activeTab === "koordinator" ? "Tim Verifikasi" : "Instansi Belum Diverifikasi"}
          </h1>
          <div className="flex items-center gap-4">
            <Button onClick={handleTambah}>Tambah</Button>
            <Input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs UI */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => {
              setActiveTab("koordinator");
              setSearch("");
            }}
            className={classNames(
              "px-4 py-2 rounded-lg transition duration-150",
              activeTab === "koordinator"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            Tim Verifikasi
          </button>
          <button
            onClick={() => {
              setActiveTab("pilih-verifikator");
              setSearch("");
              setSearchVerifikator("");
              setCurrentPage(1);
            }}
            className={classNames(
              "px-4 py-2 rounded-lg transition duration-150",
              activeTab === "pilih-verifikator"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            Pilih Verifikator
          </button>
        </div>

        {/* Render Tab Content */}
        {activeTab === "koordinator" && (
          <TimVerifikasiTab
            data={koordinatorData}
            search={debouncedSearch}
            onKeluarkan={handleKeluarkan}
          />
        )}

        {activeTab === "pilih-verifikator" && (
          <PilihVerifikatorTab
            data={verifikatorData}
            search={searchVerifikator}
            currentPage={currentPage}
            totalPages={totalPages}
            onSearchChange={(e) => setSearchVerifikator(e.target.value)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Sidebar>
  );
}
