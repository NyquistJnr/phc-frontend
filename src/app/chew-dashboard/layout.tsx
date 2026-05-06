import { SidebarProvider } from "@/src/components/adminDashboard/generics/sidebar";
import { ChewSidebar } from "@/src/components/chewDashboard/generics/sidebar";

export default function ChewDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F6F7F9] font-inter">
        <ChewSidebar />
        <div className="flex flex-col flex-1 ml-0 lg:ml-64 min-w-0 overflow-x-clip">
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
