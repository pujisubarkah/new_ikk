import React from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar-admin';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar>
        {/* Add any child elements or leave it empty if no children are needed */}
        <div></div>
      </Sidebar>
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold">Admin Nasional Dashboard</h1>
          {/* Konten dashboard lainnya bisa ditambahkan di sini */}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;