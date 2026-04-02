"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/src/hooks/useAuth";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  Loader2,
  UserCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import AuthShell from "../../auth-shell";

const inputStyles =
  "block w-full border border-gray-200 rounded-xl pl-11 pr-12 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:ring-[#1AC073] transition-colors bg-white";
const labelStyles = "block text-sm font-bold text-gray-700 mb-1.5";

function SetUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setupAccountMutation = useResetPassword();

  const uid = searchParams.get("id");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!uid || !token) {
      toast.warning(
        "Warning: The setup link appears to be invalid or missing parameters.",
        {
          toastId: "missing-setup-token",
        },
      );
    }
  }, [uid, token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uid || !token) {
      toast.error(
        "Invalid or missing setup link. Please contact your administrator.",
      );
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setupAccountMutation.mutate(
      {
        uidb64: uid,
        token: token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Account set up successfully!");
          setTimeout(() => router.push("/login"), 3000);
        },
        onError: (error: any) => {
          const errorMsg =
            error.response?.errors?.confirm_password?.[0] ||
            error.message ||
            "An error occurred while setting up your account.";
          toast.error(errorMsg);
        },
      },
    );
  };

  if (isSuccess) {
    return (
      <div className="text-center animate-in fade-in zoom-in duration-300 py-6">
        <div className="w-20 h-20 bg-[#E8F7F0] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-[#046C3F]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Account Ready!
        </h2>
        <p className="text-gray-500 mb-8 text-base">
          Your account has been successfully set up. You can now log in to
          access the dashboard.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="w-full py-4 px-4 bg-[#046C3F] hover:bg-[#035a34] text-white font-bold rounded-xl transition-colors shadow-md text-base"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-8">
        <div className="w-14 h-14 bg-[#F0FDF4] rounded-2xl flex items-center justify-center mb-6 border border-[#DCFCE7]">
          <UserCheck size={28} className="text-[#046C3F]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          Set up your account
        </h2>
        <p className="text-base text-gray-500">
          Welcome! Please create a secure password to activate your new account.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className={labelStyles}>Create Password</label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={!uid || !token || setupAccountMutation.isPending}
              className={inputStyles}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelStyles}>Confirm Password</label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={!uid || !token || setupAccountMutation.isPending}
              className={inputStyles}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={setupAccountMutation.isPending || !uid || !token}
        className="w-full py-4 px-4 bg-[#046C3F] disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#035a34] text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 mt-4 text-base"
      >
        {setupAccountMutation.isPending && (
          <Loader2 size={20} className="animate-spin" />
        )}
        {setupAccountMutation.isPending ? "Setting up..." : "Complete Setup"}
      </button>
    </form>
  );
}

export default function SetUpAccount() {
  return (
    <AuthShell>
      <div className="w-full p-8 sm:p-10 rounded-[2rem]">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-[#046C3F] mb-4" size={32} />
              <p className="text-gray-500 font-medium">
                Verifying setup link...
              </p>
            </div>
          }
        >
          <SetUpForm />
        </Suspense>
      </div>
    </AuthShell>
  );
}
