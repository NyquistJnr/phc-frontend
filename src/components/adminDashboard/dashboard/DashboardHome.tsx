"use client";

import React from 'react';
import {
  Users,
  AlertTriangle, Activity, Server, Database,
  AlertCircle, Clock, UserCheck, LogIn,
  UserX, Calendar, ArrowRight, ListFilter, ChevronDown
} from 'lucide-react';
import Header from "@/src/components/adminDashboard/generics/header";
import MetricCard from '@/src/components/adminDashboard/generics/MetricCard';
import StatusRow from '@/src/components/adminDashboard/generics/StatusRow';
import AlertRow from '@/src/components/adminDashboard/generics/AlertRow';

export default function Dashboard() {
  const breadcrumbs = [{ label: '', active: true }];

  const auditLogs = [
    { user: 'Dr. Adaeze Nwosu', action: 'User Login', module: 'Authentication', timestamp: '2026-03-08 08:42:15', ip: '192.168.1.14', status: 'Success', statusColor: 'bg-emerald-50 text-emerald-600' },
    { user: 'System Admin', action: 'Password Reset: Chioma Eze', module: 'Security', timestamp: '2026-03-08 08:31:02', ip: '192.168.1.1', status: 'warning', statusColor: 'bg-orange-50 text-orange-600' },
    { user: 'Fatima Bello', action: 'Role Changed: Nurse → Doctor', module: 'User Management', timestamp: '2026-03-08 08:15:44', ip: '192.168.1.1', status: 'Info', statusColor: 'bg-blue-50 text-blue-600' },
    { user: 'Unknown (IP: 10.0.0.45)', action: 'Failed Login Attempt', module: 'Authentication', timestamp: '2026-03-08 07:58:33', ip: '192.168.1.18', status: 'Critical', statusColor: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0 overflow-hidden">
      <Header title="Dashboard" breadcrumbs={breadcrumbs} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 space-y-6 sm:space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium font-inter text-gray-900 tracking-tight">
              Welcome Nobert
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
              Here is your facility overview for today
            </p>
          </div>
          
          <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Today&apos;s Date</p>
              <p className="text-sm font-bold text-gray-800">1st March, 2026</p>
            </div>
          </div>
        </div>

        {/* Top Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <MetricCard icon={Users} title="Total User" value="0" colorClass="bg-[#046C3F]" />
          <MetricCard icon={AlertTriangle} title="System Alert" value="0" colorClass="bg-white border border-gray-100" />
          <MetricCard icon={Activity} title="System Uptime" value="0.00" subValue="%" colorClass="bg-white border border-gray-100" />
        </div>

        {/* Health & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          
          {/* System Status */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#101928]">System Status</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Real-time infrastructure health</p>
            </div>
            <div className="space-y-1 flex-1">
              <StatusRow icon={Server} label="Server health" status="Online" badgeColor="bg-emerald-50 text-emerald-600" subText="0.00%" />
              <StatusRow icon={Database} label="Database status" status="Connected" badgeColor="bg-emerald-50 text-emerald-600" subText="0.00%" />
              <StatusRow icon={AlertCircle} label="Error alerts" status="0 Active" badgeColor="bg-red-50 text-red-400" subText="0.00%" />
              <StatusRow icon={Clock} label="System Uptime" status="00d 00h 00m" badgeColor="bg-emerald-50 text-emerald-600" subText="0.00%" />
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">User Activity</h3>
                <p className="text-xs text-gray-400 font-medium mt-1">Real-time User Activity</p>
              </div>
              <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1 cursor-pointer bg-gray-50 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                This Week <ChevronDown size={12} />
              </div>
            </div>
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              {[
                { label: 'Active Users', icon: UserCheck, val: '0' },
                { label: 'Login Attempts', icon: LogIn, val: '0' },
                { label: 'Failed Logins', icon: UserX, val: '0' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                      <item.icon size={20} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="bg-white rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100 flex flex-col min-w-0">
          <div className="p-5 sm:p-8 flex justify-between items-center border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Recent Audit Logs</h3>
            <button className="flex items-center gap-2 text-[#046C3F] text-sm font-bold hover:underline">
              View all <ArrowRight size={16} />
            </button>
          </div>
          
          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-50 bg-gray-50/30">
                  <th className="px-5 sm:px-8 py-4 whitespace-nowrap"><div className="flex items-center gap-2">User <ListFilter size={14} /></div></th>
                  <th className="px-5 py-4 whitespace-nowrap"><div className="flex items-center gap-2">Action <ListFilter size={14} /></div></th>
                  <th className="px-5 py-4 whitespace-nowrap"><div className="flex items-center gap-2">Module <ListFilter size={14} /></div></th>
                  <th className="px-5 py-4 whitespace-nowrap"><div className="flex items-center gap-2">Timestamp <ListFilter size={14} /></div></th>
                  <th className="px-5 py-4 whitespace-nowrap"><div className="flex items-center gap-2">IP Address <ListFilter size={14} /></div></th>
                  <th className="px-5 sm:px-8 py-4 whitespace-nowrap text-center"><div className="flex items-center justify-center gap-2">Status <ListFilter size={14} /></div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {auditLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 sm:px-8 py-5 text-sm font-semibold text-gray-700 whitespace-nowrap">{log.user}</td>
                    <td className="px-5 py-5 text-sm text-gray-500 whitespace-nowrap truncate max-w-[200px]" title={log.action}>{log.action}</td>
                    <td className="px-5 py-5 text-sm text-gray-500 whitespace-nowrap">{log.module}</td>
                    <td className="px-5 py-5 text-sm text-gray-500 font-mono whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-5 py-5 text-sm text-gray-500 font-mono whitespace-nowrap">{log.ip}</td>
                    <td className="px-5 sm:px-8 py-5 whitespace-nowrap">
                      <div className="flex justify-center">
                        <span className={`${log.statusColor} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">System Alerts</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Security and operational warnings</p>
            </div>
            <button className="flex items-center gap-2 text-[#046C3F] text-sm font-bold hover:underline self-start sm:self-auto">
              View all <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            <AlertRow title="Multiple Failed Login Attempts" desc="Repeated failed logins from IP 10.0.0.45 detected." time="1hr ago" borderColor="border-red-400" bgColor="bg-red-50/30" titleColor="text-red-600" />
            <AlertRow title="High Memory Usage" desc="Application server memory at 82% capacity" time="1hr ago" borderColor="border-orange-400" bgColor="bg-orange-50/30" titleColor="text-orange-600" />
            <AlertRow title="Database Sync Delay" desc="Data synchronization with backup server delayed by 30 minutes" time="1hr ago" borderColor="border-[#FFD66B]" bgColor="bg-[#FFD66B]/10" titleColor="text-orange-800" />
          </div>
        </div>

      </div>
    </div>
  );
}