import React from 'react';
import Sidebar from '@/components/sidebar-admin';

const DashboardPage: React.FC = () => {
  return (
      <Sidebar>
      <div className="w-full px-6 py-8">
      <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Nasional Dashboard</h1>
          {/* Konten dashboard lainnya bisa ditambahkan di sini */}
        </div>
        </div>
        </Sidebar>
  );
};

export default DashboardPage;
