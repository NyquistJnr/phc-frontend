import Link from 'next/link';
import { ArrowLeft, EyeOff, Lock } from 'lucide-react';
import AuthShell from '@/src/components/auth-shell';
import PasswordRules from '@/src/components/password-rules';

export default function NewPasswordPage() {
  return (
    <AuthShell>
      <div className="space-y-8">
        <div className="space-y-4">
          {/* <Link
            href="/reset-password/verify"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#006732] transition hover:text-[#005127]"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link> */}

          <div>
            <h2 className="mb-3 font-poppins text-3xl font-medium text-[#1B1818] md:text-5xl">
              Set new password
            </h2>
            <p className="text-sm text-[#645D5D] md:text-base">
              Choose a strong password for your account and make sure it matches the security requirements below.
            </p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium font-poppins tracking-wider text-[#1B1818] md:text-sm">
              Old Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#9CA3AF]">
                <Lock size={20} />
              </div>
              <input
                type="password"
                placeholder="Enter old password"
                className="block w-full rounded-xl border border-gray-200 bg-white py-4 pr-12 pl-12 text-base outline-none transition-all focus:ring focus:ring-[#006732]"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#9CA3AF] transition-colors hover:text-[#006732]">
                <EyeOff size={20} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium font-poppins tracking-wider text-[#1B1818] md:text-sm">
              New Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#9CA3AF]">
                <Lock size={20} />
              </div>
              <input
                type="password"
                placeholder="Enter new password"
                className="block w-full rounded-xl border border-gray-200 bg-white py-4 pr-12 pl-12 text-base outline-none transition-all focus:ring focus:ring-[#006732]"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#9CA3AF] transition-colors hover:text-[#006732]">
                <EyeOff size={20} />
              </div>
            </div>
          </div>

          <PasswordRules />

          <button
            type="submit"
            className="w-full rounded-xl bg-[#006732] py-4 font-bold text-white shadow-md transition-all duration-300 hover:bg-[#005127] active:scale-[0.98]"
          >
            Update password
          </button>
        </form>
      </div>
    </AuthShell>
  );
}