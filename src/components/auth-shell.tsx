import type { ReactNode } from 'react';

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#F4F5FA] font-sans">
      <div className="grid min-h-screen grid-cols-1 bg-[#F4F5FA] md:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden rounded-lg bg-[#006732] shadow-2xl md:m-2 md:flex lg:m-3">
          <div className="absolute inset-0 bg-[url('/images/black-orchid.png')] opacity-80 mix-blend-overlay pointer-events-none"></div>

          <div className="relative z-10 flex flex-grow flex-col p-8 lg:p-12 xl:p-16">
            <div className="mb-12 flex items-center gap-4 lg:mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E] shadow-lg">
                <div className="h-7 w-7 rotate-45 rounded-full border-[5px] border-t-transparent border-white"></div>
              </div>
              <span className="text-lg font-bold tracking-[0.18em] text-white">LOGO</span>
            </div>

            <h1 className="mb-2 font-medium text-5xl leading-tight font-semibold text-white lg:mb-12 lg:text-5xl xl:text-6xl">
              Nigeria Primary <br />
              Health Care <br />
              Electronic Health <br />
              Record
            </h1>

            <p className="mt-auto max-w-md text-base leading-relaxed font-light text-white/85 lg:text-lg">
              A secure platform for managing patient records, consultations,
              laboratory services, prescriptions, and facility reporting.
            </p>
          </div>

          <div className="relative z-10 px-8 pb-8 lg:px-12 lg:pb-12 xl:px-16">
            <p className="text-sm tracking-wide text-white/50">
              © 2026 PHC EHR System v1.0.0
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center bg-[#F4F5FA] px-6 py-10 sm:px-10 md:px-12 md:py-0 lg:px-16 xl:px-24">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}