import { SidebarProvider } from "@/src/components/adminDashboard/generics/sidebar";
import LabSidebar from "@/src/components/lab-dashboard/generics/LabSidebar";

export default function LabDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F6F7F9] font-inter">
        <LabSidebar />
        <div className="ml-0 flex min-w-0 flex-1 flex-col overflow-x-clip lg:ml-64">
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
