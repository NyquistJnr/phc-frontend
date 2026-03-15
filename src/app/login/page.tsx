import Link from 'next/link';
import { Mail, Lock, EyeOff } from 'lucide-react';
// import AuthShell from '/components/auth-shell';
import AuthShell from '@/src/components/auth-shell';

export default function LoginPage() {
  return (
    <AuthShell>
      <div className="space-y-7 md:space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1B1818] mb-3">
                Welcome back!
              </h2>
              <p className="text-[#645D5D] text-sm md:text-base">
                Sign in to access your dashboard
              </p>
            </div>

            <form className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-bold text-[#1B1818] uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF]">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="you@phc.gov.ng"
                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring focus:ring-[#006732] outline-none transition-all bg-white text-base"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-bold text-[#1B1818] uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF]">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring focus:ring-[#006732] outline-none transition-all bg-white text-base"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-[#9CA3AF] hover:text-[#006732] transition-colors">
                    <EyeOff size={20} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D1D5DB] hover:bg-[#006732] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md active:scale-[0.98] mt-2"
              >
                Login
              </button>

              <div className="text-center pt-2">
                <p className="text-sm text-[#645D5D]">
                  Forgot Password?{" "}
                  <Link
                    href="/reset-password"
                    className="text-[#006732] font-bold hover:underline underline-offset-4 ml-1"
                  >
                    Recover
                  </Link>
                </p>
              </div>
            </form>
      </div>
    </AuthShell>
  );
}