import React from 'react';
import Head from 'next/head';
import { 
  Users, 
  AlertTriangle, 
  Activity, 
  Server, 
  Database, 
  AlertCircle, 
  Clock, 
  UserCheck, 
  LogIn, 
  UserX,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { MetricCardProps, StatusRowProps } from '../generics/types';
import Header from "@/src/components/adminDashboard/generics/header";
import { Sidebar } from '@/src/components/adminDashboard/generics/sidebar';

// Sub-component for the top 3 metric cards
const MetricCard = ({ icon: Icon, title, value, colorClass, subValue }: MetricCardProps) => (
  <div className={`${colorClass} p-6 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[160px]`}>
    <div className="flex justify-between items-start">
      <div className="p-2 bg-white/20 rounded-lg">
        <Icon size={24} className="text-white" />
      </div>
      <div className="flex items-center gap-1 text-[10px] text-white/80 font-medium">
        This Week <ArrowRight size={10} className="rotate-90" />
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-white/90">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-bold text-white">{value}</p>
        {subValue && <span className="text-lg font-medium text-white/70">{subValue}</span>}
      </div>
    </div>
  </div>
);

// Sub-component for Status Rows (Server, Database, etc)
const StatusRow = ({ icon: Icon, label, status, badgeColor, subText }: StatusRowProps) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
        <Icon size={20} />
      </div>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </div>
    <div className="text-right">
      <div className={`${badgeColor} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block mb-1`}>
        {status}
      </div>
      <p className="text-[10px] text-gray-400 font-medium">{subText}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const breadcrumbs = [{ label: '', active: true }]; // Dashboard has home icon only in your image

  return (
    <>
      <Head>
        <title>Dashboard | PHC EHR</title>
      </Head>

      <div className="min-w-8xl flex bg-[#F6F7F9]">
        <Sidebar />

        <main className="flex-1 flex flex-col">
          <Header title="Dashboard" breadcrumbs={breadcrumbs} />

          <div className="flex-1 p-8 space-y-8">
            {/* Welcome Section */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome Nobert</h2>
                <p className="text-gray-500 font-medium mt-1">Here is your facility overview for today</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Today&apos;s Date</p>
                  <p className="text-sm font-bold text-gray-800">1st March, 2026</p>
                </div>
              </div>
            </div>

            {/* Top Metric Grid */}
            <div className="grid grid-cols-3 gap-6">
              <MetricCard icon={Users} title="Total User" value="0" colorClass="bg-[#046C3F]" />
              <MetricCard icon={AlertTriangle} title="System Alert" value="0" colorClass="bg-white !text-gray-900 border border-gray-100" />
              <MetricCard icon={Activity} title="System Uptime" value="0.00" subValue="%" colorClass="bg-white !text-gray-900 border border-gray-100" />
            </div>

            {/* Health & Activity Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* System Status Card */}
              <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900">System Status</h3>
                  <p className="text-xs text-gray-400 font-medium">Real-time infrastructure health</p>
                </div>
                <div className="space-y-1">
                  <StatusRow icon={Server} label="Server health" status="Online" badgeColor="bg-emerald-50 text-emerald-600" subText="0.00%" />
                  <StatusRow icon={Database} label="Database status" status="Connected" badgeColor="bg-emerald-50 text-emerald-600" subText="0.00%" />
                  <StatusRow icon={AlertCircle} label="Error alerts" status="0 Active" badgeColor="bg-red-50 text-red-400" subText="0.00%" />
                  <StatusRow icon={Clock} label="System Uptime" status="00d 00h 00m" badgeColor="bg-emerald-50 text-emerald-600" subText="0.00%" />
                </div>
              </div>

              {/* User Activity Card */}
              <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">User Activity</h3>
                    <p className="text-xs text-gray-400 font-medium">Real-time User Activity</p>
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                    This Week <ArrowRight size={10} className="rotate-90" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><UserCheck size={20} /></div>
                      <span className="text-sm font-semibold text-gray-700">Active Users</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><LogIn size={20} /></div>
                      <span className="text-sm font-semibold text-gray-700">Login Attempts</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><UserX size={20} /></div>
                      <span className="text-sm font-semibold text-gray-700">Failed Logins</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">0</span>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-gray-400 font-bold">Failed login rate</span>
                      <span className="text-[10px] text-indigo-400 font-bold font-mono">0.00%</span>
                    </div>
                    <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-400 h-full w-[0%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Logs Table Preview */}
            <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Recent Audit Logs</h3>
                <button className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={14} />
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-[#F6F7F9]/50 border-y border-gray-50">
                  <tr className="text-left">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Module</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timestamp</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { user: 'Dr. Adaeze Nwosu', action: 'User Login', module: 'Authentication', time: '2026-03-08 08:42:15', status: 'Success', sColor: 'text-emerald-600 bg-emerald-50' },
                    { user: 'System Admin', action: 'Password Reset: Chioma Eze', module: 'Security', time: '2026-03-08 08:31:02', status: 'Warning', sColor: 'text-orange-600 bg-orange-50' }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5 text-sm font-medium text-gray-700">{row.user}</td>
                      <td className="px-8 py-5 text-sm text-gray-500">{row.action}</td>
                      <td className="px-8 py-5 text-sm text-gray-500">{row.module}</td>
                      <td className="px-8 py-5 text-sm text-gray-400 font-mono">{row.time}</td>
                      <td className="px-8 py-5">
                        <span className={`${row.sColor} px-3 py-1 rounded-full text-[10px] font-bold uppercase`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}