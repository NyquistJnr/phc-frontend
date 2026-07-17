import { IHOSidebar } from "@/src/components/iho-dashboard/generics/IHOSidebar";

export default function IHODashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-[#F6F7FC]">
      <IHOSidebar />
      <main className="flex-1 lg:ml-64 bg-[#F6F7FC] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
