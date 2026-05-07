import React from "react";
import { ArrowRight, Baby, Syringe } from "lucide-react";

interface ListContainerProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onViewAll?: () => void;
}

export function ListContainer({
  title,
  icon,
  children,
  onViewAll,
}: ListContainerProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="text-gray-700">{icon}</div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-medium text-[#0a6c38] hover:underline"
        >
          View all <ArrowRight size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

const Badge = ({
  text,
  variant,
}: {
  text: string;
  variant: "green" | "red" | "blue" | "gray";
}) => {
  const styles = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[variant]}`}
    >
      {text}
    </span>
  );
};

export function MaternalAlertRow({ name, description, status, variant }: any) {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
      <div>
        <p className="font-medium text-gray-900 text-sm mb-1">{name}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <Badge text={status} variant={variant} />
    </div>
  );
}

export function ImmunizationRow({ name, description, dateStatus }: any) {
  const isToday = dateStatus.toLowerCase() === "today";
  return (
    <div className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
      <div>
        <p className="font-medium text-gray-900 text-sm mb-1">{name}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <Badge text={dateStatus} variant={isToday ? "blue" : "gray"} />
    </div>
  );
}
