import { Sidebar, SidebarProvider } from '@/src/components/adminDashboard/generics/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F6F7F9] font-inter">
        <Sidebar />

        <div className="flex flex-col flex-1 ml-0 lg:ml-64">
          <main>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}