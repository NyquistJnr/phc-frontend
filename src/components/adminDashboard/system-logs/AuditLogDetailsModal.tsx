import React from "react";
import { 
  X, 
  User, 
  Activity, 
  Clock, 
  Globe, 
  Database, 
  Hash, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { AuditLog } from "@/src/hooks/useAuditLogs";

interface AuditLogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

const formatTimestamp = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString();
};

const getStatusStyles = (action: string) => {
  const normalizedAction = action?.toUpperCase();
  switch (normalizedAction) {
    case "CREATE":
    case "LOGIN":
      return "bg-[#D2F1DF] text-[#046C3F] border-[#1AC073]/20";
    case "UPDATE":
      return "bg-[#E0F2FE] text-[#0284C7] border-[#0284C7]/20";
    case "DELETE":
    case "SUSPEND":
    case "FAILED_LOGIN":
      return "bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/20";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

export default function AuditLogDetailsModal({ isOpen, onClose, log }: AuditLogDetailsModalProps) {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Audit Log Details</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">ID: <span className="font-mono">{log.id}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Actor Info Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={16} className="text-[#046C3F]" />
                Actor Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase">Actor Name</span>
                  <p className="text-sm font-medium text-slate-700 mt-1">{log.actor_name || "System"}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase">Facility</span>
                  <p className="text-sm font-medium text-slate-700 mt-1">{log.facility_name || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Action Details Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity size={16} className="text-blue-500" />
                Action Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase">Action</span>
                    <div className="mt-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyles(log.action)}`}>
                        {log.action}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Timestamp</span>
                    <p className="text-sm font-medium font-mono text-slate-700 mt-1 flex items-center gap-1 justify-end">
                      <Clock size={14} className="text-slate-400" />
                      {formatTimestamp(log.timestamp)}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase">Module</span>
                  <p className="text-sm font-medium text-slate-700 mt-1">{log.module}</p>
                </div>
              </div>
            </div>

            {/* System Info Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm md:col-span-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Database size={16} className="text-purple-500" />
                System Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
                    <Globe size={12} /> IP Address
                  </span>
                  <p className="text-sm font-medium text-slate-700 mt-1 font-mono">{log.ip_address}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
                    <Hash size={12} /> Target Object ID
                  </span>
                  <p className="text-sm font-medium text-slate-700 mt-1 font-mono break-all">{log.target_object_id || "N/A"}</p>
                </div>
                <div className="md:col-span-3">
                  <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
                    <ShieldAlert size={12} /> Endpoint
                  </span>
                  <p className="text-sm font-medium text-slate-700 mt-1 bg-slate-50 p-2 rounded-lg font-mono break-all border border-slate-100">
                    {log.endpoint}
                  </p>
                </div>
              </div>
            </div>

            {/* Changes Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm md:col-span-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Database size={16} className="text-amber-500" />
                Data Changes
              </h3>
              
              {!log.changes || Object.keys(log.changes).length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No changes recorded for this action.
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(log.changes).map(([field, values]: [string, any]) => (
                    <div key={field} className="flex flex-col border border-slate-100 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{field}</span>
                      </div>
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4 bg-white">
                        
                        {/* Old Value */}
                        <div className="bg-red-50/50 p-3 rounded-lg border border-red-100 relative group overflow-hidden">
                          <span className="text-[10px] uppercase font-bold text-red-400 absolute top-2 right-2">Old</span>
                          <p className="text-sm font-mono text-red-700 break-all pt-3">
                            {values.old === null || values.old === undefined ? <span className="italic text-red-300">null</span> : String(values.old)}
                          </p>
                        </div>
                        
                        {/* Arrow */}
                        <div className="flex justify-center hidden sm:flex">
                          <div className="bg-slate-100 p-2 rounded-full text-slate-400">
                            <ArrowRight size={16} />
                          </div>
                        </div>
                        
                        <div className="flex justify-center sm:hidden rotate-90 my-1">
                          <div className="bg-slate-100 p-2 rounded-full text-slate-400">
                            <ArrowRight size={16} />
                          </div>
                        </div>

                        {/* New Value */}
                        <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 relative group overflow-hidden">
                          <span className="text-[10px] uppercase font-bold text-emerald-500 absolute top-2 right-2">New</span>
                          <p className="text-sm font-mono text-emerald-700 break-all pt-3">
                            {values.new === null || values.new === undefined ? <span className="italic text-emerald-300">null</span> : String(values.new)}
                          </p>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
