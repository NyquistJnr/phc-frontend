"use client";

import React, { useEffect } from 'react';
import { CircleCheck, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type?: ToastType;
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const toastConfig: Record<ToastType, { icon: React.ElementType; borderColor: string; iconColor: string; bgColor: string }> = {
  success: { icon: CircleCheck, borderColor: 'border-l-[#1AC073]', iconColor: 'text-[#1AC073]', bgColor: 'bg-[#1AC073]' },
  error: { icon: AlertCircle, borderColor: 'border-l-[#DC2626]', iconColor: 'text-[#DC2626]', bgColor: 'bg-[#DC2626]' },
  warning: { icon: AlertTriangle, borderColor: 'border-l-[#FF8433]', iconColor: 'text-[#FF8433]', bgColor: 'bg-[#FF8433]' },
  info: { icon: Info, borderColor: 'border-l-[#0284C7]', iconColor: 'text-[#0284C7]', bgColor: 'bg-[#0284C7]' },
};

export default function Toast({ type = 'success', title, message, visible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 flex items-start gap-4 p-5 bg-white rounded-2xl shadow-2xl border-l-4 ${config.borderColor} border border-gray-100 sm:w-[380px] animate-slide-in-up`}>
      <div className={`w-6 h-6 shrink-0 rounded-full ${config.bgColor} flex items-center justify-center`}>
        <Icon className="text-white" size={16} />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-sm font-bold text-gray-900 mb-1">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0">
        <X size={18} />
      </button>
    </div>
  );
}
