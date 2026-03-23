import Header from '@/src/components/adminDashboard/generics/header';

export default function SystemLogsPage() {
  const breadcrumbs = [
    { label: 'System Logs' },
    { label: 'System Logs', active: true }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="System Logs" breadcrumbs={breadcrumbs} />
      <div className="p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">System Logs</h2>
        <p className="text-gray-500 font-medium">System logs will appear here.</p>
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          Coming soon
        </div>
      </div>
    </div>
  );
}
