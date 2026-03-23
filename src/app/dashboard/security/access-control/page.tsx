import Header from '@/src/components/adminDashboard/generics/header';

export default function AccessControlPage() {
  const breadcrumbs = [
    { label: 'Security' },
    { label: 'Access Control', active: true }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Security" breadcrumbs={breadcrumbs} />
      <div className="p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Access Control</h2>
        <p className="text-gray-500 font-medium">Manage access control policies.</p>
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          Coming soon
        </div>
      </div>
    </div>
  );
}
