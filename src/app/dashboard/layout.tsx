import { Sidebar } from '@/src/components/adminDashboard/generics/sidebar';
import  Header  from '@/src/components/adminDashboard/generics/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F6F7F9]">
      
      {/* 1. FIXED SIDEBAR */}
      {/* We use a fixed width (w-64) to match your design */}
      <Sidebar />

      {/* 2. MAIN CONTENT AREA */}
      {/* We add margin-left (ml-64) so the content isn't hidden under the fixed sidebar */}
      <div className="flex flex-col flex-1 ml-64">
        
        {/* 3. PERSISTENT HEADER */}
        {/* <Header title="PHC EHR System" /> */}

        {/* 4. DYNAMIC PAGE CONTENT */}
        <main>
          {children}
        </main>
        
      </div>
    </div>
  );
}