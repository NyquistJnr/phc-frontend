import Link from 'next/link';

const quickLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/facility-levels', label: 'Facility Levels' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/login', label: 'Sign in' },
];

const standards = [
  'NPHCDA Act 2022',
  'National Health Act 2014',
  'PHC Under One Roof',
  'BHCPF Guidelines',
];

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 space-y-6 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22C55E]">
                <div className="h-5 w-5 rotate-45 rounded-full border-4 border-t-transparent border-white"></div>
              </div>
              <span className="font-bold tracking-wider text-[#006732]">LOGO</span>
            </Link>
            <p className="text-sm leading-relaxed text-[#645D5D]">
              Electronic Health Record system aligned with NPHCDA Minimum Standards for Primary Health Care in Nigeria. Supporting healthcare delivery across all 36 states and the FCT.
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-medium text-[#645D5D] transition-colors hover:text-[#006732]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">Standards</h4>
            <ul className="space-y-4">
              {standards.map((item) => (
                <li key={item}>
                  <span className="text-sm font-medium text-[#645D5D]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-xs font-medium tracking-wide text-[#9CA3AF]">
            © 2026 PHC-EHR-NG. ALIGNED WITH NPHCDA MINIMUM STANDARDS FOR PRIMARY HEALTH CARE.
          </p>
        </div>
      </div>
    </footer>
  );
}