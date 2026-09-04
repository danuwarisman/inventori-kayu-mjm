'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  KeyRound,
  Bell,
  PackageCheck,
  ShieldCheck,
  History,
  Database,
  FileSpreadsheet,
  Download,
  LogOut,
  X,
  Check,
  Eye,
  EyeOff,
  Laptop,
  Smartphone,
  ChevronRight,
  RefreshCw,
  FileText,
} from 'lucide-react';
import {
  UserProfile,
  LoginHistoryItem,
  ExportFormat,
  ManagementHistoryItem,
} from '@/types/settings';

export default function SettingsPage() {
  const router = useRouter();

  // State Profil Pengguna
  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'Danu Warisman',
    email: 'admin@margijatimakmur.com',
    phone: '+62 812 3456 7890',
    role: 'Manager',
  });

  // State Notifikasi (Toggle Switch)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);

  // Modal Controllers
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoginHistoryOpen, setIsLoginHistoryOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStep, setExportStep] = useState<'select' | 'progress' | 'success'>('select');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('xlsx');
  const [isBackupSuccessOpen, setIsBackupSuccessOpen] = useState(false);

  // Form States (Edit Profile)
  const [editFullName, setEditFullName] = useState(profile.fullName);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);

  // Form States (Change Password)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Data Riwayat Login & Manajemen (Zero State siap data dinamis)
  const [loginHistory] = useState<LoginHistoryItem[]>([
    {
      id: 'LH-01',
      date: '20 Jun 2026',
      time: '08:30 WIB',
      device: 'Chrome - Windows',
      os: 'Windows 11',
      ipAddress: '192.168.1.10',
      status: 'Success',
    },
    {
      id: 'LH-02',
      date: '19 Jun 2026',
      time: '13:15 WIB',
      device: 'Android App',
      os: 'Android 13',
      ipAddress: '192.168.1.25',
      status: 'Success',
    },
  ]);

  const [managementHistory] = useState<ManagementHistoryItem[]>([
    {
      id: 'MH-01',
      title: 'System Backup Completed',
      performedBy: 'Performed by Administrator',
      timestamp: '20 Jun 2026, 10:30 AM',
    },
    {
      id: 'MH-02',
      title: 'Database Export (XLSX)',
      performedBy: 'Automatic Monthly Report',
      timestamp: '01 Jun 2026, 00:00 AM',
    },
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      fullName: editFullName,
      email: editEmail,
      phone: editPhone,
    }));
    setIsEditProfileOpen(false);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError('Password baru minimal 8 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok.');
      return;
    }
    setPasswordError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangePasswordOpen(false);
  };

  const handleStartExport = () => {
    setExportStep('progress');
    setTimeout(() => {
      setExportStep('success');
    }, 1500);
  };

  const handleTriggerBackup = () => {
    setIsBackupSuccessOpen(true);
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1440px] mx-auto font-sans">
      {/* Grid Menu Utama Berbasis Kartu */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Card 1: Account Settings */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-4 pb-5 border-b border-stone-100">
              <div className="p-3 bg-stone-100 rounded-xl text-green-800">
                <User className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-green-900">Account Settings</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage your account information and security settings.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditFullName(profile.fullName);
                  setEditEmail(profile.email);
                  setEditPhone(profile.phone);
                  setIsEditProfileOpen(true);
                }}
                className="w-full p-3 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-100 rounded-lg text-green-800">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-green-700 block">
                      Edit Profile
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Update your name, email, and contact info.
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-green-700 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setPasswordError('');
                  setIsChangePasswordOpen(true);
                }}
                className="w-full p-3 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-100 rounded-lg text-green-800">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-green-700 block">
                      Change Password
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Update your password to keep your account secure.
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-green-700 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Notification Settings */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-4 pb-5 border-b border-stone-100">
              <div className="p-3 bg-stone-100 rounded-xl text-green-800">
                <Bell className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-green-900">Notification Settings</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage how and when you receive notifications.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <div className="p-3 rounded-lg border border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-100 rounded-lg text-green-800">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-green-700 block">
                      Email Notifications
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Receive email updates and system alerts.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    emailNotifications ? 'bg-green-700' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      emailNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-lg border border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-100 rounded-lg text-green-800">
                    <PackageCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-green-700 block">
                      Stock Alert
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Get notified when stock is low or out of stock.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStockAlerts(!stockAlerts)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    stockAlerts ? 'bg-green-700' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      stockAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Login History */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-4 pb-5 border-b border-stone-100">
              <div className="p-3 bg-stone-100 rounded-xl text-green-800">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-green-900">Security</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage security settings, audits, and access.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsLoginHistoryOpen(true)}
                className="w-full p-3 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-100 rounded-lg text-green-800">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-green-700 block">
                      Login History
                    </span>
                    <span className="text-[11px] text-stone-400">
                      View recent account login activity.
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-green-700 transition-colors" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/70 text-red-600 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section Data Management (Backup, Export, History) */}
      <section className="flex flex-col gap-5 pt-2">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Data Management</h2>
          <p className="text-xs text-stone-500">
            Securely manage your wood inventory records and system archives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Backup Data Card */}
          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between gap-4">
            <div>
              <div className="flex justify-between items-start">
                <div className="p-3 bg-stone-100 rounded-xl text-green-900">
                  <Database className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Recommended Weekly
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mt-4">Backup Data</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Create a full snapshot of your current inventory database and operational logs.
              </p>
            </div>
            <button
              type="button"
              onClick={handleTriggerBackup}
              className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Initiate Backup</span>
            </button>
          </div>

          {/* Export Database Card */}
          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between gap-4">
            <div>
              <div className="p-3 bg-stone-100 rounded-xl text-green-900 w-fit">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mt-4">Export Database</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Download your system data in Excel, CSV, or PDF format for reporting and audits.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setExportStep('select');
                setIsExportModalOpen(true);
              }}
              className="w-full py-2.5 px-4 bg-white border border-stone-800 hover:bg-stone-50 text-stone-900 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Configure Export</span>
            </button>
          </div>
        </div>

        {/* Management History Log Table */}
        <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">Management History</h3>
              <p className="text-xs text-stone-400">Tracking recent administrative actions</p>
            </div>
            <span className="text-xs font-semibold text-green-700">View All Logs</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {managementHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-stone-50/70 rounded-lg border border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white border border-stone-200 rounded text-green-800">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block">{item.title}</span>
                    <span className="text-stone-400 text-[11px]">{item.performedBy}</span>
                  </div>
                </div>
                <span className="font-mono text-stone-500 text-[11px]">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal 1: Edit Profile */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-stone-900">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full h-10 px-3 border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full h-10 px-3 border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full h-10 px-3 border border-stone-300 rounded font-mono text-stone-900 focus:outline-none focus:border-green-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Role</label>
                <input
                  type="text"
                  disabled
                  value={profile.role}
                  className="w-full h-10 px-3 bg-stone-100 border border-stone-300 rounded font-semibold text-stone-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded cursor-pointer shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Change Password */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-stone-900">Change Password</h3>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="p-5 flex flex-col gap-3.5 text-xs">
              {passwordError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                  {passwordError}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Current Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 border border-stone-300 rounded font-mono text-stone-900 focus:outline-none focus:border-green-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">New Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 border border-stone-300 rounded font-mono text-stone-900 focus:outline-none focus:border-green-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Confirm New Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 border border-stone-300 rounded font-mono text-stone-900 focus:outline-none focus:border-green-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded text-[11px] text-stone-500 leading-relaxed">
                Password minimal 8 karakter dan disarankan mengandung kombinasi huruf, angka, serta simbol.
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded cursor-pointer shadow-2xs"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Login History */}
      {isLoginHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-stone-900">Login History</h3>
                <p className="text-xs text-stone-400">Review your recent account login activity.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginHistoryOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-x-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Device</th>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {loginHistory.map((item) => (
                    <tr key={item.id} className="text-stone-800">
                      <td className="py-3 px-3">
                        <span className="font-semibold block">{item.date}</span>
                        <span className="text-stone-400 text-[11px]">{item.time}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {item.device.includes('Android') ? (
                            <Smartphone className="w-4 h-4 text-stone-400" />
                          ) : (
                            <Laptop className="w-4 h-4 text-stone-400" />
                          )}
                          <div>
                            <span className="font-medium block">{item.device}</span>
                            <span className="text-stone-400 text-[11px]">{item.os}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-stone-600">{item.ipAddress}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-[11px] font-bold">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsLoginHistoryOpen(false)}
                className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Export Database Multi-step */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden flex flex-col p-5">
            {exportStep === 'select' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                  <h3 className="text-base font-bold text-stone-900">Export Database</h3>
                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <span className="text-xs font-semibold text-stone-700">Choose export format:</span>

                <div className="flex flex-col gap-2.5">
                  <label
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedFormat === 'xlsx'
                        ? 'border-green-700 bg-green-50/50'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="exportFormat"
                        checked={selectedFormat === 'xlsx'}
                        onChange={() => setSelectedFormat('xlsx')}
                        className="accent-green-700"
                      />
                      <span className="text-xs font-semibold text-stone-900">Excel (.xlsx)</span>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedFormat === 'csv'
                        ? 'border-green-700 bg-green-50/50'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="exportFormat"
                        checked={selectedFormat === 'csv'}
                        onChange={() => setSelectedFormat('csv')}
                        className="accent-green-700"
                      />
                      <span className="text-xs font-semibold text-stone-900">CSV (.csv)</span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedFormat === 'pdf'
                        ? 'border-green-700 bg-green-50/50'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="exportFormat"
                        checked={selectedFormat === 'pdf'}
                        onChange={() => setSelectedFormat('pdf')}
                        className="accent-green-700"
                      />
                      <span className="text-xs font-semibold text-stone-900">PDF (.pdf)</span>
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleStartExport}
                    className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded text-xs cursor-pointer shadow-2xs"
                  >
                    Export
                  </button>
                </div>
              </div>
            )}

            {exportStep === 'progress' && (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Exporting Database...</h4>
                  <p className="text-xs text-stone-400 mt-1">Please wait while we prepare your file.</p>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-green-700 h-full w-3/4 animate-pulse rounded-full" />
                </div>
              </div>
            )}

            {exportStep === 'success' && (
              <div className="py-4 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-stone-900">Export Completed Successfully!</h4>
                <p className="text-xs text-stone-500">
                  Your system data has been exported to {selectedFormat.toUpperCase()} format.
                </p>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="mt-2 w-full py-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded text-xs cursor-pointer shadow-2xs"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 5: Backup Success Popup */}
      {isBackupSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden flex flex-col p-6 text-center gap-3">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
              <Database className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-stone-900">Backup Created Successfully!</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Your system data has been backed up securely to the system archive and local storage.
            </p>
            <button
              type="button"
              onClick={() => setIsBackupSuccessOpen(false)}
              className="mt-2 w-full py-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded text-xs cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}