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
          <Link
            href="/reset-password"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#006732] transition hover:text-[#005127]"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>

          <div className="rounded-[28px] border border-[#D9DEE8] bg-white px-6 py-8 text-center shadow-sm">
            <Image
              src="/images/mail.png"
              alt="Email illustration"
              width={120}
              height={120}
              className="mx-auto h-auto w-[120px]"
              priority
            />

            <h2 className="mt-6 font-display text-3xl font-bold text-[#1B1818] md:text-4xl">
              Check your email
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#645D5D] md:text-base">
              Enter the 6-digit verification code sent to your email address to continue resetting your password.
            </p>

            <div className="mt-8 flex justify-center gap-2 sm:gap-3">
              {otpFields.map((field) => (
                <input
                  key={field}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`OTP digit ${field + 1}`}
                  className="h-14 w-11 rounded-2xl border border-[#D9DEE8] bg-[#F8FAFC] text-center text-lg font-semibold text-[#1B1818] outline-none transition focus:border-[#006732] focus:ring-2 focus:ring-[#006732]/20 sm:w-12"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/reset-password/new-password"
            className="flex w-full items-center justify-center rounded-xl bg-[#006732] py-4 text-center font-bold text-white shadow-md transition-all duration-300 hover:bg-[#005127] active:scale-[0.98]"
          >
            Verify code
          </Link>

          <p className="text-center text-sm text-[#645D5D]">
            Didn&apos;t receive the code?{' '}
            <button type="button" className="font-semibold text-[#006732] hover:underline">
              Resend
            </button>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}