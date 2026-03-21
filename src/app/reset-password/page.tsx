import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import AuthShell from '@/src/components/auth-shell';

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <div className="space-y-8">
        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#006732] transition hover:text-[#005127]"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>

          <div>
            <h2 className="mb-3 font-poppins text-4xl font-medium text-[#1B1818] md:text-5xl">
              Reset password
            </h2>
            <p className="text-sm text-[#645D5D] md:text-base">
              Enter the email address linked to your account and we&apos;ll send you a verification code.
            </p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium font-poppins tracking-wider text-[#1B1818] md:text-sm">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#9CA3AF]">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="you@phc.gov.ng"
                className="block w-full rounded-xl border border-gray-200 bg-white py-4 pr-4 pl-12 text-base outline-none transition-all focus:ring focus:ring-[#006732]"
              />
            </div>
          </div>

          <Link
            href="/reset-password/verify"
            className="flex w-full items-center justify-center rounded-xl bg-[#006732] py-4 text-center font-bold text-white shadow-md transition-all duration-300 hover:bg-[#005127] active:scale-[0.98]"
          >
            Send verification code
          </Link>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#006732] hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}