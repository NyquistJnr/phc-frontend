import Link from 'next/link';

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/facility-levels', label: 'Facility Levels' },
  { href: '/faqs', label: 'FAQs' },
];

export default function SiteNav() {
  return (
    <nav className="relative z-20 bg-[#006732] px-6 py-4 md:px-12">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22C55E]">
            <div className="h-5 w-5 rotate-45 rounded-full border-4 border-t-transparent border-white"></div>
          </div>
          <span className="font-bold tracking-wider text-white">LOGO</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/90 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-md bg-white px-6 py-2 text-sm font-bold text-[#006732] transition-all hover:bg-white/90"
          >
            Sign in
          </Link>
        </div>

        <Link
          href="/login"
          className="rounded-md bg-white px-4 py-2 text-sm font-bold text-[#006732] transition-all hover:bg-white/90 md:hidden"
        >
          Sign in
        </Link>
      </div>

      <div className="mt-3 flex gap-4 overflow-x-auto pb-1 md:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/40 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}