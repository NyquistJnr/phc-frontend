"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import AuthShell from "../../auth-shell";
import { toast } from "react-toastify";
import { useForgotPassword } from "@/src/hooks/useAuth"; 

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    
    forgotPasswordMutation.mutate(email.trim(), {
      onSuccess: () => {
        toast.success("A password reset link has been sent to your email address.");
        setEmail(""); 
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to send reset link. Please try again.");
      },
    });
  };

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
              Enter the email address linked to your account and we&apos;ll send
              you a password reset link.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@phc.gov.ng"
                className="block w-full rounded-xl border border-gray-200 bg-white py-4 pr-4 pl-12 text-base outline-none transition-all focus:ring focus:ring-[#006732]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={forgotPasswordMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006732] py-4 text-center font-bold text-white shadow-md transition-all duration-300 hover:bg-[#005127] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {forgotPasswordMutation.isPending && (
              <Loader2 size={20} className="animate-spin" />
            )}
            {forgotPasswordMutation.isPending
              ? "Sending Link..."
              : "Send reset link"}
          </button>

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