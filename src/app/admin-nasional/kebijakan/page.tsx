'use client'

import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar-admin'

const dummyData = [
  { no: 1, nama: 'Instansi A' },
  { no: 2, nama: 'Instansi B' },
  { no: 3, nama: 'Instansi C' },
]

export default function TabelInstansi() {
  const handleUnduhExcel = () => {
    const aoaData = [['No', 'Nama Instansi'], ...dummyData.map(item => [item.no, item.nama])]
    const worksheet = XLSX.utils.aoa_to_sheet(aoaData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Instansi')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(data, 'data_instansi.xlsx')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <></>
      </Sidebar>

      <div className="flex-1 p-6 bg-gray-50">
        <Header />

        <div className="mt-6 max-w-5xl bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Daftar Instansi</h1>
            <button
              onClick={handleUnduhExcel}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Unduh Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left">No</th>
                  <th className="px-4 py-2 border text-left">Nama Instansi</th>
                  <th className="px-4 py-2 border text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((item) => (
                  <tr key={item.no} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{item.no}</td>
                    <td className="px-4 py-2 border">{item.nama}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">
                        Reset Populasi
                      </button>
                      <button className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded">
                        Reset Verifikasi
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
