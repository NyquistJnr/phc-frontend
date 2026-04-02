"use client";

import Header from '@/src/components/adminDashboard/generics/header';

export default function SuspendAccountPage() {
  const breadcrumbs = [
    { label: 'User Management' },
    { label: 'Suspend Account', active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="Dashboard" breadcrumbs={breadcrumbs} />
      <div className="p-4 sm:p-8 max-w-[900px]">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Suspend Account</h1>
          <p className="text-gray-500">Suspend or reactivate user accounts.</p>
        </div>
      </div>
    </div>
  );
}
