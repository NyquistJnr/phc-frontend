import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AuthShell from '@/src/components/auth-shell';

const otpFields = Array.from({ length: 6 }, (_, index) => index);

export default function VerifyResetPasswordPage() {
  return (
    <AuthShell>
      <div className="space-y-8">
        
        <div className="space-y-4">

          {/* Content */}
          <div className="px-0 py-2">
            <Image
              src="/images/mail.png"
              alt="Email illustration"
              width={120}
              height={120}
              className="h-auto w-[120px]"
              priority
            />

            <h2 className="mt-6 font-poppins text-3xl font-medium text-[#1B1818] md:text-5xl">
              Check your email
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#667185] md:text-base max-w-md">
              We have sent a 6-digits code to N*****@phc.gov.ng
            </p>

            {/* OTP Inputs */}
            <div className="mt-8 flex gap-2 sm:gap-3">
              {otpFields.map((field) => (
                <input
                  key={field}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`OTP digit ${field + 1}`}
                  className="h-14 w-full rounded-2xl border border-[#D9DEE8] text-center text-lg font-semibold text-[#1B1818] outline-none transition focus:border-[#006732] focus:ring sm:w-12"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Link
            href="/reset-password/new-password"
            className="flex w-full items-center justify-center rounded-xl bg-[#006732] py-4 font-bold text-white shadow-md transition-all duration-300 hover:bg-[#005127] active:scale-[0.98]"
          >
            Verify code
          </Link>

          <div className="flex items-center justify-between text-sm">
            <p className="text-[#645D5D]">
              Resend Code in 34s
            </p>

            {/* <button
              type="button"
              className="font-semibold text-[#006732] hover:underline"
            >
              Resend
            </button> */}
          </div>
        </div>

      </div>
    </AuthShell>
  );
}