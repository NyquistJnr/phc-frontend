import { SidebarProvider } from "@/src/components/adminDashboard/generics/sidebar";
import PharmacistSidebar from "@/src/components/pharmacist-dashboard/generics/PharmacistSidebar";

export default function PharmacistDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F6F7F9] font-inter">
        <PharmacistSidebar />
        <div className="ml-0 flex min-w-0 flex-1 flex-col overflow-x-clip lg:ml-64">
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
