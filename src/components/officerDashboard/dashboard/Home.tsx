"use client";

import React from 'react';
import { 
  Search, Bell, Stethoscope, ClipboardList, Folder, ChevronDown, 
  ArrowRight, ListFilter, Home, Users
} from 'lucide-react';

export default function OICDashboard() {
  const handleAction = (actionName) => {
    alert(`Action triggered: ${actionName}`);
  };

  // Mock Data
  const visitTrendData = [
    { date: 'Sept 10', height: '85%' },
    { date: 'Sept 11', height: '35%' },
    { date: 'Sept 12', height: '65%' },
    { date: 'Sept 13', height: '20%' },
    { date: 'Sept 14', height: '80%' },
    { date: 'Sept 15', height: '45%' },
    { date: 'Sept 16', height: '80%' },
  ];

  const alertsData = [
    { title: 'Monthly Malaria Report', date: 'Mar 31, 2026', status: 'Pending', border: 'border-[#F59E0B]', bg: 'bg-orange-50', text: 'text-orange-700' },
    { title: 'Staff Performance Report', date: 'Mar 31, 2026', status: 'Overdue', border: 'border-[#EF4444]', bg: 'bg-red-50', text: 'text-red-700' },
    { title: 'Weekly Activity Summary', date: 'Mar 31, 2026', status: 'Submitted', border: 'border-[#22C55E]', bg: 'bg-green-50', text: 'text-green-700' }
  ];

  const diseasesData = [
    'Malaria cases', 'Typhoid cases', 'URTI Cases', 'UTI Cases', 
    'Diarrhea cases', 'pneumonia Cases', 'Others'
  ];

  const recentPatients = [
    { id: 'PAT-PLT-000234', name: 'Aisha Mohammed', module: 'Consultation', time: '2026-03-08 08:42:15', status: 'Seen', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { id: 'PAT-PLT-000234', name: 'Aisha Mohammed', module: 'Laboratory', time: '2026-03-08 08:31:02', status: 'Waiting', statusStyle: 'bg-orange-50 text-orange-600' },
    { id: 'PAT-PLT-000234', name: 'Fatima Bello', module: 'Pharmacy', time: '2026-03-08 08:15:44', status: 'Seen', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
    { id: 'PAT-PLT-000234', name: 'Usman Garba', module: 'Consultation', time: '2026-03-08 07:58:33', status: 'Referred', statusStyle: 'bg-red-50 text-red-600' },
    { id: 'PAT-PLT-000234', name: 'Halima Sani', module: 'Consultation', time: '2026-03-08 07:44:00', status: 'Seen', statusStyle: 'bg-[#EBF7F2] text-[#2A6543]' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen bg-[#F8FAFC] font-sans min-w-0 overflow-hidden">
      
      {/* HEADER */}
      <header className="h-[88px] bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
        <div className="flex items-center gap-6">
          <div className="relative w-[360px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#2A6543] focus:ring-1 focus:ring-[#2A6543]"
            />
          </div>
          
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 leading-tight">Nobert</p>
              <p className="text-[11px] text-gray-500">OIC</p>
            </div>
            <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-10 h-10 rounded-full border border-gray-100 object-cover" />
          </div>
        </div>
      </header>

      {/* SCROLLABLE DASHBOARD CONTENT */}
      <div className="flex-1 overflow-auto p-4 sm:p-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#2A6543] mb-6">
          <Home size={16} />
        </div>

        {/* TOP METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Special Green Card */}
          <div className="bg-[#2A6543] rounded-[20px] p-5 shadow-sm text-white flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Users size={18} className="text-white" />
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors">
                This Week <ChevronDown size={14} />
              </button>
            </div>
            <p className="text-sm font-medium mb-3">Today&apos;s Patients</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-[#F59E0B] font-medium mb-1">Waiting</p>
                <p className="text-2xl font-bold">34</p>
              </div>
              <div>
                <p className="text-xs text-[#4ADE80] font-medium mb-1">Seen</p>
                <p className="text-2xl font-bold">67</p>
              </div>
              <div>
                <p className="text-xs text-[#60A5FA] font-medium mb-1">Referred</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>

          {/* Standard Cards */}
          {[
            { title: 'Consultations', value: '60', icon: Stethoscope },
            { title: 'Lab Tests', value: '45', icon: ClipboardList },
            { title: 'Pending Reports', value: '10', icon: Folder }
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <card.icon size={18} className="text-gray-600" />
                </div>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  This Week <ChevronDown size={14} />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MIDDLE SECTION: Charts & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Patient Visit Trend */}
          <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-gray-900">Patient Visit Trend</h3>
              <button className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                This Month <ChevronDown size={14} />
              </button>
            </div>
            
            <div className="flex items-end justify-between h-[220px] pb-6 relative">
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 pb-6">
                <span>500</span><span>400</span><span>300</span><span>200</span><span>100</span><span>0</span>
              </div>
              
              {/* Bars */}
              <div className="flex justify-between items-end w-full h-full ml-10">
                {visitTrendData.map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3">
                    <div className="w-[14px] h-[180px] bg-gray-100 rounded-full relative overflow-hidden">
                      <div 
                        className="absolute bottom-0 w-full bg-[#2A6543] rounded-full" 
                        style={{ height: data.height }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{data.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reporting Alerts */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Reporting Alerts</h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Reports alerts & Notification</p>
              </div>
              <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-full">
                3 New
              </span>
            </div>
            
            <div className="space-y-4 flex-1">
              {alertsData.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-xl border-l-4 ${alert.border} ${alert.bg} flex justify-between items-center cursor-pointer hover:opacity-90 transition-opacity`} onClick={() => handleAction(`View Alert: ${alert.title}`)}>
                  <div>
                    <p className={`text-sm font-semibold ${alert.text}`}>{alert.title}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{alert.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-gray-700">
                    {alert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Donut Chart & Disease Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Clinical Activity */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col items-center relative">
            <div className="w-full flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Clinical Activity</h3>
              <button className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                This Week <ChevronDown size={14} />
              </button>
            </div>
            
            {/* Legend */}
            <div className="w-full flex justify-center gap-4 mb-8 text-[11px] text-gray-500 font-medium">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#2A6543]"></span>Consultations</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#68D391]"></span>Lab Test</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FDBA74]"></span>Prescriptions</div>
            </div>

            {/* CSS Donut Chart */}
            <div className="relative w-48 h-48 rounded-full mb-4" style={{ background: 'conic-gradient(#2A6543 0% 55%, #68D391 55% 70%, #FDBA74 70% 100%)' }}>
              <div className="absolute inset-5 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Disease Overview */}
          <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Disease Overview</h3>
              <button className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                This Week <ChevronDown size={14} />
              </button>
            </div>

            <div className="space-y-5 flex-1">
              {diseasesData.map((disease, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-xs text-gray-600 font-medium w-[120px] truncate">{disease}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2A6543] rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium w-8 text-right">80%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Recent Patients</h3>
            <button 
              onClick={() => handleAction('View All Recent Patients')}
              className="flex items-center gap-2 text-[#2A6543] text-sm font-semibold hover:underline"
            >
              View all <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-50 text-gray-500 text-xs font-semibold">
                  <th className="py-4 px-6"><div className="flex items-center gap-2">Patient ID <ListFilter size={14}/></div></th>
                  <th className="py-4 px-6"><div className="flex items-center gap-2">Patient Name <ListFilter size={14}/></div></th>
                  <th className="py-4 px-6"><div className="flex items-center gap-2">Module <ListFilter size={14}/></div></th>
                  <th className="py-4 px-6"><div className="flex items-center gap-2">Timestamp <ListFilter size={14}/></div></th>
                  <th className="py-4 px-6"><div className="flex items-center gap-2">Status <ListFilter size={14}/></div></th>
                  <th className="py-4 px-6"><div className="flex items-center gap-2">Action <ListFilter size={14}/></div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentPatients.map((patient, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-500 font-medium">{patient.id}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-medium">{patient.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{patient.module}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{patient.time}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${patient.statusStyle}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => handleAction(`View Patient: ${patient.name}`)}
                        className="text-sm font-semibold text-[#2A6543] hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}