import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LogIn, Building2, LayoutGrid, Database, Clock,
  SquareCheck, ArrowRight, HeartPulse
} from 'lucide-react';

export default function Home() {
  const services = [
    {
      title: "Maternal Health",
      desc: "Comprehensive antenatal care, facility-based deliveries, postnatal care, and family planning services.",
      items: ["Antenatal Care", "Delivery Services", "Postnatal Care", "Family Planning"]
    },
    {
      title: "Immunization",
      desc: "Comprehensive antenatal care, facility- based deliveries, postnatal care, and family planning services.",
      items: ["Routine Vaccines", "Vitamin A", "Growth Monitoring", "Outreach Programs"]
    },
    {
      title: "Curative Services",
      desc: "Outpatient consultations, laboratory tests, and treatment of common ailments.",
      items: ["Consultation", "Lab Services", "Treatment", "Referrals"]
    },
    {
      title: "Child Health",
      desc: "Growth monitoring, deworming, nutrition counseling, and sick child care.",
      items: ["Growth Monitoring", "Nutrition", "Deworming", "Sick Child Care"]
    },
    {
      title: "Pharmacy",
      desc: "Essential drug dispensing, inventory management, and stock control.",
      items: ["Drug Dispensing", "Inventory", "Stock Control", "Essential Medicines"]
    },
    {
      title: "Health Promotion",
      desc: "Health education, community mobilization, and behavior change communication.",
      items: ["Health Education", "Community Outreach", "Behavior Change", "IEC Materials"]
    }
  ];

  return (
    <main className="min-h-screen font-sans">
      {/* Hero Wrapper - Full Width Background #F4F5FA */}
      <div className="w-full bg-[#F4F5FA]">
        <section className="max-w-8xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-[#006732] text-5xl md:text-7xl font-display font-bold leading-[1.1]">
              Nigeria Primary <br />
              Health Care <br />
              Electronic Health <br />
              Record
            </h1>
            <p className="text-[#1B1818] text-lg md:text-xl leading-relaxed max-w-lg">
              A comprehensive, standardized digital health system for Primary Health Care 
              facilities across Nigeria, aligned with NPHCDA Minimum Standards.
            </p>
            <Link href="/login" className="flex w-fit items-center gap-3 rounded-lg bg-[#006732] px-8 py-4 font-normal text-white shadow-lg transition-all hover:bg-[#005228] group">
              <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
              Sign in
            </Link>
          </div>

          <div className="relative">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 relative z-10">
              <div className="relative w-full h-[300px] rounded-[1.5rem] overflow-hidden mb-6">
                <Image src="/images/hero.jpg" alt="Doctor" fill className="object-cover" priority />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={<Building2 size={24} />} val="3" label="Facility Levels" />
                <StatCard icon={<LayoutGrid size={24} />} val="6" label="Core Services" />
                <StatCard icon={<Database size={24} />} val="36" label="States Coverage" />
                <StatCard icon={<Clock size={24} />} val="24/7" label="System Access" />
              </div>
            </div>
            <div className="absolute -inset-4 bg-[#006732]/5 blur-3xl rounded-full -z-10"></div>
          </div>
        </section>
      </div>

      {/* Core Services Wrapper - Full Width Background White */}
      <div className="w-full bg-white">
        <section id="services" className="max-w-8xl mx-auto px-6 py-20 md:py-32 scroll-mt-24">
          <div className="text-center mb-10 space-y-4">
            <span className="bg-[#D1FAE5]/16 text-[#00A242] text-sm font-medium px-6 py-2 rounded-full tracking-wider">
              Core Services
            </span>
            <h2 className="text-[#006732] text-4xl md:text-5xl font-display font-bold">
              NPHCDA-Compliant Services
            </h2>
            <p className="text-[#645D5D] max-w-3xl mx-auto text-sm md:text-base font-inter">
              Comprehensive health services aligned with the National Primary Health Care Development Agency minimum standards for PHC facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-[#F4F5FA] p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group border border-transparent hover:border-[#006732]/10">
                <div>
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <HeartPulse className="text-[#006732]" size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[#006732] text-2xl font-display font-bold mb-4">{service.title}</h3>
                  <p className="text-[#645D5D] text-md leading-relaxed mb-6 font-inter">
                    {service.desc}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-md text-[#645D5D] font-inter">
                        <SquareCheck size={24} className="fill-[#006732] text-[#ffffff] rounded-2xl" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/facility-levels" className="flex items-center gap-2 text-[#006732] text-sm font-bold group-hover:gap-3 transition-all">
                  Learn more <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section - Full Width Background #006732 */}
      <div className="w-full bg-[#006732] relative overflow-hidden">
        {/* Subtle Texture Overlay to match login card */}
        <div className="absolute inset-0 opacity-80 pointer-events-none bg-[url('/images/black-orchid.png')] mix-blend-overlay"></div>
        
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center relative z-10">
          <h2 className="text-white text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
            Ready to Transform Primary <br className="hidden md:block" /> Health Care?
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-5xl mx-auto mb-12 font-inter font-light">
            Join health facilities across Nigeria in adopting a standardized, efficient electronic health record system.
          </p>
          <Link href="/login" className="inline-flex rounded-lg bg-[#D1FAE5] px-12 py-3.5 text-lg font-medium text-[#006732] shadow-xl transition-all hover:scale-105 hover:bg-white active:scale-95 md:px-40">
            Join Now
          </Link>
        </section>
      </div>
    </main>
  );
}

type StatCardProps = {
  icon: ReactNode;
  val: string;
  label: string;
};

function StatCard({ icon, val, label }: StatCardProps) {
  return (
    <div className="bg-[#F4F5FA] p-6 rounded-2xl flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[#006732]">{icon}</span>
        <span className="text-4xl font-display font-bold text-[#1B1818]">{val}</span>
      </div>
      <p className="text-[#645D5D] text-xs font-medium font-inter">{label}</p>
    </div>
  );
}