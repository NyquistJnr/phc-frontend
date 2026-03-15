import Link from 'next/link';
import { SquareCheck } from 'lucide-react';

export default function FacilityAndCTA() {
  const facilities = [
    {
      level: "Level 0",
      title: "Health Post",
      description: "Basic community health services provided at the grassroots level",
      items: ["Health Education", "First Aid", "Referrals", "Community Outreach"],
      bgColor: "bg-white",
      borderColor: "border-[#1C1D22]"
    },
    {
      level: "Level 1",
      title: "PHC Clinic",
      description: "Primary health care services with basic maternal and child health",
      items: ["ANC Services", "Routine Immunization", "Outpatient Care", "Basic Lab"],
      bgColor: "bg-[#ECFFF4]",
      borderColor: "border-[#006732]"
    },
    {
      level: "Level 2 +",
      title: "PHC Centre",
      description: "Comprehensive primary health care with 24/7 services",
      items: ["Full Maternal Health", "24/7 Delivery", "Inpatient Care", "Advanced Lab"],
      bgColor: "bg-[#FEF9F2]",
      borderColor: "border-[#FF8D28]"
    }
  ];

  return (
    <>
      {/* Supported Facility Levels Section */}
      <div className="w-full bg-[#F4F5FA]">
        <section id="facility-levels" className="max-w-8xl mx-auto px-6 py-20 md:py-32 scroll-mt-24">
          <div className="text-center mb-10 space-y-4">
            <span className="bg-[#D1FAE5]/16 text-[#00A242] text-sm font-medium px-6 py-2 rounded-full tracking-wider">
              Facility Structure
            </span>
            <h2 className="text-[#006732] text-4xl md:text-5xl mt-2 font-display font-semibold">
              Supported Facility Levels
            </h2>
            <p className="text-[#645D5D] max-w-3xl mx-auto text-sm md:text-base font-inter">
              The system supports all three tiers of Primary Health Care facilities as defined by NPHCDA standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.map((f, idx) => (
              <div key={idx} className={`${f.bgColor} p-8 rounded-[2rem] border-t-4 ${f.borderColor} shadow-sm flex flex-col h-full`}>
                <div className="mb-6">
                  <span className="text-[#006732] font-display font-medium text-2xl uppercase tracking-tight">{f.level}</span>
                </div>
                <div className="w-16 h-16 mb-6">
                  <div className="relative w-12 h-12 bg-[#006732] rounded-lg flex items-center justify-center">
                    <div className="w-6 h-1.5 bg-white absolute rounded-full"></div>
                    <div className="h-6 w-1.5 bg-white absolute rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-[#006732] text-3xl font-display font-bold mb-4">{f.title}</h3>
                <p className="text-[#645D5D] text-md leading-relaxed mb-8 font-inter">
                  {f.description}
                </p>
                <ul className="space-y-4 mt-auto">
                  {f.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-md text-[#645D5D] font-inter">
                      <SquareCheck size={22} className="fill-[#006732] text-[#ffffff]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-[#006732] relative overflow-hidden">
        {/* Subtle Texture Overlay */}
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
    </>
  );
}