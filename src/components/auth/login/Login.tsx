"use client";

import Link from "next/link";
import { Mail, Lock, EyeOff, Loader2 } from "lucide-react";
import AuthShell from "../../auth-shell";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both fields");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      } else {
        toast.success("Login successful! Redirecting...");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="space-y-7 md:space-y-8">
        <div>
          <h2 className="text-3xl md:text-6xl font-poppins font-medium text-[#1B1818] mb-3">
            Welcome back!
          </h2>
          <p className="text-[#645D5D] text-sm md:text-base">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-poppins font-medium text-[#1B1818] tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF]">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="you@phc.gov.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring focus:ring-[#006732] outline-none transition-all bg-white text-base disabled:opacity-75"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-poppins font-medium text-[#1B1818] tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF]">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring focus:ring-[#006732] outline-none transition-all bg-white text-base disabled:opacity-75"
              />
              <div
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-[#9CA3AF] hover:text-[#006732] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeOff size={20} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-[#006732] hover:bg-[#006732]/90 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md active:scale-[0.98] mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 mr-3" />
            ) : (
              "Login"
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-[#645D5D]">
              Forgot Password?{" "}
              <Link
                href="/forgot-password"
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
