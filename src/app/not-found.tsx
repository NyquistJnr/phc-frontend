"use client";

import Link from "next/link";
import { MoveLeft, Home, Search, Compass } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200 rounded-full blur-[120px] opacity-40 mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200 rounded-full blur-[120px] opacity-40 mix-blend-multiply" />

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Animated Icon Container */}
        <div className="mx-auto w-24 h-24 bg-white shadow-xl rounded-3xl flex items-center justify-center mb-8 rotate-3 transition-transform hover:rotate-6">
          <Compass size={40} className="text-[#046C3F]" />
        </div>

        {/* 404 Typography */}
        <h1 className="text-8xl md:text-9xl font-black text-gray-900 tracking-tighter mb-4 drop-shadow-sm">
          4<span className="text-[#046C3F]">0</span>4
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Page not found
        </h2>

        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Oops! The page you are looking for seems to have wandered off. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 group"
          >
            <MoveLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-semibold shadow-lg shadow-green-900/20 hover:shadow-xl hover:shadow-green-900/30 transition-all flex items-center justify-center gap-2 group"
            style={{ background: "linear-gradient(135deg, #046C3F 0%, #034D2D 100%)" }}
          >
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Support Link */}
        <div className="mt-16 text-sm text-gray-400">
          Need help? <a href="#" className="text-[#046C3F] font-medium hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
