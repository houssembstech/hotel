import React from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';

export default function DirectorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <DashboardSidebar role="DIRECTOR" />
      <div className="flex-1 md:ml-64 p-8 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
