import React from 'react';
import Sidebar from '@/components/sidebar-admin';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar>
      
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold">Admin Nasional Dashboard</h1>
          {/* Konten dashboard lainnya bisa ditambahkan di sini */}
        </main>
      </div>
        </Sidebar>
    </div>
  );
};

export default DashboardPage;
