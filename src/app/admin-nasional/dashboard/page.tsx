import React from 'react';
import Sidebar from '@/components/sidebar-admin';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar>
    
        <main className="p-6">
          <h1 className="text-2xl font-bold">Admin Nasional Dashboard</h1>
          {/* Konten dashboard lainnya bisa ditambahkan di sini */}
        </main>
        </Sidebar>
    </div>
  );
};

export default DashboardPage;
