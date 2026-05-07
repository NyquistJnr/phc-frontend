import { SidebarProvider } from "@/src/components/adminDashboard/generics/sidebar";
import { NurseSidebar } from "@/src/components/nurse-dashboard/generics/NurseSidebar";

export default function NurseDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F6F7F9] font-inter">
        <NurseSidebar />
        <div className="flex flex-col flex-1 ml-0 lg:ml-64 min-w-0 overflow-x-clip">
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
