'use client'

import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar } from 'lucide-react'
import Sidebar from '@/components/sidebar-admin'
import { withRoleGuard } from '@/lib/withRoleGuard';

function FilterTahun() {
  const [tahunAwal, setTahunAwal] = useState<Date | null>(null)
  const [tahunAkhir, setTahunAkhir] = useState<Date | null>(null)

  // Custom input dengan icon di sebelah kanan
  const CustomInput = ({ value, onClick }: { value?: string, onClick?: () => void }) => (
    <div className="relative">
      <input
        type="text"
        className="w-full pr-10 pl-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        value={value}
        onClick={onClick}
        readOnly
        placeholder="Pilih Tahun"
      />
      <Calendar 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar>
        <main className="p-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md">
       

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Dari Tahun *
                </label>
                <DatePicker
                  selected={tahunAwal}
                  onChange={setTahunAwal}
                  showYearPicker
                  dateFormat="yyyy"
                  customInput={<CustomInput />}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Sampai Tahun *
                </label>
                <DatePicker
                  selected={tahunAkhir}
                  onChange={setTahunAkhir}
                  showYearPicker
                  dateFormat="yyyy"
                  customInput={<CustomInput />}
                />
              </div>
            </div>

            <button className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Simpan
            </button>
          </div>
        </main>
      </Sidebar>
    </div>
  )
}

const ProtectedPage = withRoleGuard(FilterTahun, [1]);
export default function Page() {
  return <ProtectedPage />;
}
