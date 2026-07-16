"use client";

import { CreditCard, Sparkles, Receipt, Wallet, Bell } from "lucide-react";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";

export default function PharmacistPaymentsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Payments"
        breadcrumbs={[
          {
            label: "Payments",
            href: "/pharmacist-dashboard/payments",
          },
        ]}
      />

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white p-12 text-center shadow-2xl shadow-[#046C3F]/5 sm:p-16">
          {/* Decorative Background Elements */}
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-[#E8F7F0] to-transparent opacity-50 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-gradient-to-tl from-[#DFF3EA] to-transparent opacity-50 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Icon Cluster */}
            <div className="relative mb-8 flex h-32 w-32 items-center justify-center">
              <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full border border-dashed border-[#046C3F]/30"></div>
              <div className="absolute h-24 w-24 animate-pulse rounded-full bg-[#E8F7F0]"></div>
              
              <CreditCard size={48} className="relative z-10 text-[#046C3F]" strokeWidth={1.5} />
              
              <div className="absolute -right-2 -top-2 animate-bounce text-[#F59E0B]">
                <Sparkles size={24} />
              </div>
              <div className="absolute -left-4 bottom-4 animate-[bounce_2.5s_infinite] text-[#046C3F]/60">
                <Receipt size={24} />
              </div>
              <div className="absolute -right-4 bottom-2 animate-[bounce_3s_infinite] text-[#046C3F]/60">
                <Wallet size={24} />
              </div>
            </div>

            {/* Content */}
            <h1 className="mb-4 bg-gradient-to-r from-[#046C3F] to-[#0a9e5b] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              Payments are Evolving
            </h1>
            
            <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-gray-500">
              We&apos;re building a seamless, secure, and blazing-fast payment experience tailored just for your pharmacy. Manage bills, track insurance claims, and process patient transactions—all in one place.
            </p>

            {/* Action Button */}
            <button
              type="button"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#046C3F] px-8 py-4 font-semibold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-[#046C3F]/20"
            >
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:animate-[shine_1.5s] group-hover:bg-white/20"></div>
              <Bell size={20} className="transition-transform group-hover:rotate-[15deg]" />
              <span>Notify me when it&apos;s live</span>
            </button>
          </div>
        </div>
      </main>

      {/* Global Shine Animation Definition */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          100% {
            transform: skew(-12deg) translateX(150%);
          }
        }
      `}} />
    </div>
  );
}
