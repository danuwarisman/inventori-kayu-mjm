export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  role: 'Manager' | 'Admin Kantor' | 'Admin Lapangan';
}

export interface LoginHistoryItem {
  id: string;
  date: string;
  time: string;
  device: string;
  os: string;
  ipAddress: string;
  status: 'Success' | 'Failed';
}

export type ExportFormat = 'xlsx' | 'csv' | 'pdf';

export interface ManagementHistoryItem {
  id: string;
  title: string;
  performedBy: string;
  timestamp: string;
  format?: string;
}