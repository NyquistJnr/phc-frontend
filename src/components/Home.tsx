import React from 'react';
import Image from 'next/image';
import { 
  LogIn, Building2, LayoutGrid, Database, Clock, 
  SquareCheck, ArrowRight, HeartPulse, Mail, Phone, MapPin
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
      {/* Navigation Bar - Stays Green */}
      <nav className="bg-[#006732] px-6 py-4 md:px-12 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#22C55E] rounded-full flex items-center justify-center">
            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full rotate-45"></div>
          </div>
          <span className="text-white font-bold tracking-wider">LOGO</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-white/90 hover:text-white text-sm font-medium">Services</a>
          <a href="#" className="text-white/90 hover:text-white text-sm font-medium">Facility Levels</a>
          <a href="#" className="text-white/90 hover:text-white text-sm font-medium">FAQs</a>
          <button className="bg-white text-[#006732] px-6 py-2 rounded-md text-sm font-bold hover:bg-opacity-90 transition-all">
            Sign in
          </button>
        </div>
      </nav>

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
            <button className="bg-[#006732] text-white px-8 py-4 rounded-lg flex items-center gap-3 font-normal hover:bg-[#005228] transition-all shadow-lg group">
              <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
              Sign in
            </button>
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
        <section className="max-w-8xl mx-auto px-6 py-20 md:py-32">
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
                <a href="#" className="flex items-center gap-2 text-[#006732] text-sm font-bold group-hover:gap-3 transition-all">
                  Learn more <ArrowRight size={18} />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Supported Facility Levels Wrapper - Full Width Background #F4F5FA */}
      <div className="w-full bg-[#F4F5FA]">
        <section className="max-w-8xl mx-auto px-6 py-20 md:py-32">
          {/* Header Section */}
          <div className="text-center mb-10 space-y-4">
            <span className="bg-[#D1FAE5]/16 text-[#00A242] text-sm font-medium px-6 py-2 rounded-full tracking-wider">
              Facility Structure
            </span>
            <h2 className="text-[#006732] text-4xl md:text-5xl mt-2 font-display font-bold">
              Supported Facility Levels
            </h2>
            <p className="text-[#645D5D] max-w-3xl mx-auto text-sm md:text-base font-inter">
              The system supports all three tiers of Primary Health Care facilities as defined by NPHCDA standards.
            </p>
          </div>

          {/* Facility Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Level 0 - Health Post */}
            <div className="bg-white p-8 rounded-[2rem] border-t-4 border-[#1C1D22] shadow-sm flex flex-col h-full">
              <div className="mb-6">
                <span className="text-[#006732] font-display font-bold text-2xl uppercase tracking-tight">Level 0</span>
              </div>
              <div className="w-16 h-16 mb-6">
                 {/* Custom Icon Representation */}
                 <div className="relative w-12 h-12 bg-[#006732] rounded-lg flex items-center justify-center">
                    <div className="w-6 h-1.5 bg-white absolute rounded-full"></div>
                    <div className="h-6 w-1.5 bg-white absolute rounded-full"></div>
                 </div>
              </div>
              <h3 className="text-[#006732] text-3xl font-display font-bold mb-4">Health Post</h3>
              <p className="text-[#645D5D] text-md leading-relaxed mb-8 font-inter">
                Basic community health services provided at the grassroots level
              </p>
              <ul className="space-y-4 mt-auto">
                {["Health Education", "First Aid", "Referrals", "Community Outreach"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-md text-[#645D5D] font-inter">
                    <SquareCheck size={22} className="fill-[#006732] text-[#ffffff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Level 1 - PHC Clinic */}
            <div className="bg-[#ECFFF4] p-8 rounded-[2rem] border-t-4 border-[#006732] shadow-sm flex flex-col h-full">
              <div className="mb-6">
                <span className="text-[#006732] font-display font-bold text-2xl uppercase tracking-tight">Level 1</span>
              </div>
              <div className="w-16 h-16 mb-6">
                 <div className="relative w-12 h-12 bg-[#006732] rounded-lg flex items-center justify-center">
                    <div className="w-6 h-1.5 bg-white absolute rounded-full"></div>
                    <div className="h-6 w-1.5 bg-white absolute rounded-full"></div>
                 </div>
              </div>
              <h3 className="text-[#006732] text-3xl font-display font-bold mb-4">PHC Clinic</h3>
              <p className="text-[#645D5D] text-md leading-relaxed mb-8 font-inter">
                Primary health care services with basic maternal and child health
              </p>
              <ul className="space-y-4 mt-auto">
                {["ANC Services", "Routine Immunization", "Outpatient Care", "Basic Lab"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-md text-[#645D5D] font-inter">
                    <SquareCheck size={22} className="fill-[#006732] text-[#ffffff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Level 2 + - PHC Centre */}
            <div className="bg-[#FEF9F2] p-8 rounded-[2rem] border-t-4 border-[#FF8D28] shadow-sm flex flex-col h-full">
              <div className="mb-6">
                <span className="text-[#006732] font-display font-bold text-2xl uppercase tracking-tight">Level 2 +</span>
              </div>
              <div className="w-16 h-16 mb-6">
                 <div className="relative w-12 h-12 bg-[#006732] rounded-lg flex items-center justify-center">
                    <div className="w-6 h-1.5 bg-white absolute rounded-full"></div>
                    <div className="h-6 w-1.5 bg-white absolute rounded-full"></div>
                 </div>
              </div>
              <h3 className="text-[#006732] text-3xl font-display font-bold mb-4">PHC Centre</h3>
              <p className="text-[#645D5D] text-md leading-relaxed mb-8 font-inter">
                Comprehensive primary health care with 24/7 services
              </p>
              <ul className="space-y-4 mt-auto">
                {["Full Maternal Health", "24/7 Delivery", "Inpatient Care", "Advanced Lab"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-md text-[#645D5D] font-inter">
                    <SquareCheck size={22} className="fill-[#006732] text-[#ffffff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

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
          <button className="bg-[#D1FAE5] text-[#006732] px-40 py-3.5 rounded-lg font-medium font-inter text-lg hover:bg-white transition-all shadow-xl hover:scale-105 active:scale-95">
            Join Now
          </button>
        </section>
      </div>

      {/* Footer Section - Full Width Background White */}
      <footer className="w-full bg-white pt-20 pb-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            
            {/* Branding & About */}
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#22C55E] rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full rotate-45"></div>
                </div>
                <span className="text-[#006732] font-bold tracking-wider">LOGO</span>
              </div>
              <p className="text-[#645D5D] text-sm leading-relaxed font-inter">
                Electronic Health Record system aligned with NPHCDA Minimum Standards for Primary Health Care in Nigeria. Supporting healthcare delivery across all 36 states and the FCT.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[#9CA3AF] font-bold text-xs uppercase tracking-[0.2em] mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {['Services', 'Facility Levels', 'FAQs', 'Sign in'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[#645D5D] hover:text-[#006732] text-sm font-medium transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Standards */}
            <div>
              <h4 className="text-[#9CA3AF] font-bold text-xs uppercase tracking-[0.2em] mb-6">Standards</h4>
              <ul className="space-y-4">
                {['NPHCDA Act 2022', 'National Health Act 2014', 'PHC Under One Roof', 'BHCPF Guidelines'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[#645D5D] hover:text-[#006732] text-sm font-medium transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-[#9CA3AF] text-xs font-medium tracking-wide">
              © 2026 PHC-EHR-NG. ALIGNED WITH NPHCDA MINIMUM STANDARDS FOR PRIMARY HEALTH CARE.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatCard({ icon, val, label }) {
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