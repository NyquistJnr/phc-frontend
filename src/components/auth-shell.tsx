import type { ReactNode } from 'react';

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#F4F5FA] font-sans">
      <div className="grid min-h-screen grid-cols-1 bg-[#F4F5FA] md:grid-cols-2">
        
        {/* LEFT PANEL */}
        <div className="relative hidden flex-col justify-between overflow-hidden rounded-lg bg-[#006732] shadow-2xl md:m-2 md:flex lg:m-3">
          <div className="absolute inset-0 bg-[url('/images/black-orchid.png')] opacity-80 mix-blend-overlay pointer-events-none"></div>

          <div className="relative z-10 flex grow flex-col p-8 lg:p-12 xl:p-16 mb-24">
            
            {/* LOGO */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E] shadow-lg">
                <div className="h-7 w-7 rotate-45 rounded-full border-[5px] border-t-transparent border-white"></div>
              </div>
              <span className="text-lg font-bold tracking-[0.18em] text-white">
                LOGO
              </span>
            </div>

            {/* HEADING */}
            <h1 className="font-poppins text-white text-4xl lg:text-5xl xl:text-6xl font-normal leading-[1.2] lg:leading-[1.25] tracking-[-0.01em] mb-3 lg:mb-6">
              Nigeria Primary <br />
              Health Care <br />
              Electronic Health <br />
              Record
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-auto max-w-md text-base lg:text-lg leading-[1.6] font-light text-white/80">
              A secure platform for managing patient records, consultations,
              laboratory services, prescriptions, and facility reporting.
            </p>
          </div>

          {/* FOOTER */}
          <div className="relative z-10 px-8 pb-8 lg:px-12 lg:pb-12 xl:px-16">
            <p className="text-sm tracking-wide text-white/50">
              © 2026 PHC EHR System v1.0.0
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center bg-[#F4F5FA] px-6 py-10 sm:px-10 md:px-12 md:py-0 lg:px-16 xl:px-24">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </div>
    </div>
  );
}