import { ComponentType, ReactNode } from 'react';

// --- Shared / Generic UI Types ---

/**
 * Props for the dynamic Header component
 */
export interface Breadcrumb {
  label: string;
  href?: string;
  active?: boolean;
}

export interface HeaderProps {
  title: string;
  breadcrumbs: Breadcrumb[];
}

/**
 * Props for floating-label input fields
 */
export interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'select' | 'date';
  value?: string;
  options?: string[]; // Specifically for custom select dropdowns
}

/**
 * Props for the custom toggle switches used in Configuration pages
 */
export interface ToggleSwitchProps {
  label: string;
  description: string;
  defaultChecked: boolean;
  onChange?: (checked: boolean) => void;
}


/**
 * Props for the top-level metric cards (Total User, System Alert, etc.)
 * Used in Screenshot (531)
 */
export interface MetricCardProps {
  icon: ComponentType<{ size?: number | string; className?: string }>;
  title: string;
  value: string | number;
  colorClass: string;
  subValue?: string;
}

/**
 * Props for the infrastructure health rows
 * Used in Screenshot (531)
 */
export interface StatusRowProps {
  icon: ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  status: string;
  badgeColor: string;
  subText: string;
}

// --- Domain Specific Types ---

/**
 * Represents a User in the System (Screenshot 515, 516)
 */
export type UserRole = 
  | 'IT Administration' 
  | 'Officer in Charge (OIC)' 
  | 'Doctor' 
  | 'Nurse' 
  | 'Lab Technician' 
  | 'Pharmacist' 
  | 'CHEW';

export interface User {
  staffId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  facility: string;
  dateCreated: string;
  status: 'Active' | 'Inactive';
}

/**
 * Represents a Health Facility (Screenshot 527, 529)
 */
export interface Facility {
  code: string;
  name: string;
  type: string;
  state: string;
  lga: string;
  address: string;
  level: string;
  status: 'Active' | 'Inactive';
  dateCreated: string;
  contact: {
    phone: string;
    email: string;
    adminName: string;
    adminEmail: string;
  };
  stats?: {
    totalPatients: number;
    staffMembers: number;
  };
}

/**
 * System Audit Logs (Screenshot 526)
 */
export interface AuditLog {
  user: string;
  action: string;
  module: 'Authentication' | 'Security' | 'User Management' | 'System';
  timestamp: string;
  ipAddress: string;
  status: 'Success' | 'warning' | 'Info' | 'Critical';
}