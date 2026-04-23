import { SidebarProvider } from "@/src/components/adminDashboard/generics/sidebar";
import { DoctorSidebar } from "@/src/components/doctorDashboard/generics/sidebar";

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F6F7F9] font-inter">
        <DoctorSidebar />
        <div className="flex flex-col flex-1 ml-0 lg:ml-64 min-w-0 overflow-x-clip">
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
