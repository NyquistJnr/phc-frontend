import { SidebarProvider } from "@/src/components/adminDashboard/generics/sidebar";
import { OICSidebar } from "@/src/components/officerDashboard/generics/sidebar";

export default function OfficerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F6F7F9] font-inter">
        <OICSidebar />
        <div className="flex flex-col flex-1 ml-0 lg:ml-64 min-w-0 overflow-x-clip">
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
