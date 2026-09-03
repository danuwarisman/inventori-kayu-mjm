'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  TrendingUp,
  Clock,
  AlertCircle,
  Building2,
  DollarSign,
  Users,
  Award,
  Bell,
} from 'lucide-react';

export type UserRole = 'admin' | 'manager';

interface CustomerItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

const mockCustomers: CustomerItem[] = [
  {
    id: 'C-2026-3-A-1',
    name: 'PT. Abadi Jaya',
    address: 'Ruko Adi Sumarmo Galeria Kav. Blok E-5, Jln. Waduk Cengklik, Ngesrep, Ngemplak, Boyolali 57375',
    phone: '0857-0000-1234',
    email: 'abadi@gmail.com',
  },
  {
    id: 'C-2026-3-A-2',
    name: 'PT. Metindo Nusantara',
    address: 'Kawasan Industri Candi Blok C-12, Ngaliyan, Semarang 50181',
    phone: '0812-3456-7890',
    email: 'procurement@metindo.co.id',
  },
  {
    id: 'C-2026-3-A-3',
    name: 'CV. Rimba Sentosa',
    address: 'Jalan Raya Solo-Yogyakarta Km 18, Klaten 57421',
    phone: '0878-1122-3344',
    email: 'rimbasentosa@gmail.com',
  },
  {
    id: 'C-2026-3-A-4',
    name: 'Zenith Timber Ltd',
    address: 'Jalan Gatot Subroto No. 45, Kebon Jeruk, Jakarta Barat 11530',
    phone: '0811-9876-5432',
    email: 'contact@zenithtimber.com',
  },
  {
    id: 'C-2026-3-A-5',
    name: 'UD. Jati Mulyo',
    address: 'Sentra Ukir Mulyoharjo RT 03/RW 04, Jepara 59431',
    phone: '0821-5544-3322',
    email: 'jatimulyo.jepara@yahoo.com',
  },
  {
    id: 'C-2026-3-A-6',
    name: 'PT. Karya Kayu Lestari',
    address: 'Jalan Magelang Km 7.5, Mlati, Sleman, D.I. Yogyakarta 55285',
    phone: '0852-6677-8899',
    email: 'info@karyakayu.com',
  },
  {
    id: 'C-2026-3-A-7',
    name: 'CV. Mahoni Permai',
    address: 'Jalan Industri No. 88, Kaligawe, Semarang Timur 50164',
    phone: '0813-8899-0011',
    email: 'sales@mahonipermai.co.id',
  },
];

export default function CustomerPage({ role = 'admin' }: { role?: UserRole }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState<'input' | 'edit' | null>(null);

  // Form States
  const [formCustomer, setFormCustomer] = useState<CustomerItem>({
    id: '',
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  const handleOpenCreate = () => {
    setFormCustomer({
      id: `C-2026-3-A-${mockCustomers.length + 1}`,
      name: '',
      address: '',
      phone: '',
      email: '',
    });
    setModalMode('input');
  };

  const handleOpenEdit = (customer: CustomerItem) => {
    setFormCustomer(customer);
    setModalMode('edit');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalMode(null);
  };

  const filteredCustomers = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Top Section: CRM Metric Cards & Smart Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Metric Cards Grid (Col 7) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Most Frequent Buyer */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                Most Frequent Buyer
              </span>
              <Award className="w-5 h-5 text-amber-800" />
            </div>
            <div className="my-2">
              <span className="text-xl font-bold text-neutral-800 truncate block">
                PT. Abadi jaya
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-green-700">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>14 Orders / YTD</span>
            </div>
          </div>

          {/* Card 2: Highest Total */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                Highest Total
              </span>
              <DollarSign className="w-5 h-5 text-amber-800" />
            </div>
            <div className="my-2">
              <span className="text-xl font-bold text-neutral-800 block">$1.2M</span>
            </div>
            <span className="text-xs font-medium text-neutral-600 truncate">PT. Metindo Nusantara</span>
          </div>

          {/* Card 3: Active Customers */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                Active Customers
              </span>
              <Users className="w-5 h-5 text-amber-800" />
            </div>
            <div className="my-2">
              <span className="text-xl font-bold text-neutral-800 block">1,284</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-green-700">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+5% vs Last Month</span>
            </div>
          </div>

          {/* Card 4: Longest Contract */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                Longest Contract
              </span>
              <Building2 className="w-5 h-5 text-amber-800" />
            </div>
            <div className="my-2">
              <span className="text-xl font-bold text-neutral-800 truncate block">
                PT. Abadi jaya
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-700">
              <Clock className="w-3.5 h-3.5" />
              <span>1 Year 2 month remaining</span>
            </div>
          </div>
        </div>

        {/* Smart Alerts Card (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3.5 px-4 bg-amber-50/60 border-b border-neutral-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-neutral-800" />
              <h3 className="text-sm font-bold text-neutral-800 font-sans">Smart Alerts</h3>
            </div>
            <span className="px-2 py-0.5 bg-rose-100 text-red-800 text-[11px] font-bold rounded-full">
              3 New
            </span>
          </div>

          <div className="p-3.5 flex flex-col gap-2.5 flex-1 justify-center">
            {/* Alert 1 */}
            <div className="p-2.5 bg-lime-50/70 border border-neutral-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-neutral-800">Contract Expiring</span>
                <span className="text-xs text-neutral-600 truncate">Zenith Timber (14 days remaining)</span>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="p-2.5 bg-lime-50/70 border border-neutral-200 rounded-lg flex items-start gap-3">
              <Clock className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-neutral-800">Inactive Customer</span>
                <span className="text-xs text-neutral-600 truncate">Last Buying 90 days ago</span>
              </div>
            </div>

            {/* Alert 3 */}
            <div className="p-2.5 bg-lime-50/70 border border-neutral-200 rounded-lg flex items-start gap-3">
              <Users className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-neutral-800">New Customer</span>
                <span className="text-xs text-neutral-600 truncate">Added 3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filter & Search Controls */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
          <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
            Search Customer
          </span>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, ID, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-green-700"
            />
          </div>
        </div>

        {role === 'admin' && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Customer</span>
          </button>
        )}
      </section>

      {/* 3. Customer Data Directory Table */}
      <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-xs flex flex-col gap-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 text-center">ID CUSTOMER</th>
                <th className="py-3 px-3 text-center">Nama</th>
                <th className="py-3 px-3 text-center min-w-[280px]">Alamat</th>
                <th className="py-3 px-3 text-center">No HP</th>
                <th className="py-3 px-3 text-center">Email</th>
                {role === 'admin' && <th className="py-3 px-3 text-center w-12">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.map((customer, idx) => (
                <tr key={idx} className="text-green-700 hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3 text-center font-mono font-medium">{customer.id}</td>
                  <td className="py-3 px-3 text-center font-semibold text-stone-900">{customer.name}</td>
                  <td className="py-3 px-3 text-center font-normal text-stone-600 max-w-sm leading-relaxed">
                    {customer.address}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-stone-800">{customer.phone}</td>
                  <td className="py-3 px-3 text-center font-normal">{customer.email}</td>

                  {role === 'admin' && (
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(customer)}
                        className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center"
                        title="Edit Customer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="text-green-700/80 font-medium">
            Showing {filteredCustomers.length} of 1024
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button type="button" className="w-7 h-7 rounded text-green-700 font-extrabold bg-green-100/80">
              1
            </button>
            <button type="button" className="w-7 h-7 rounded text-green-700/60 font-semibold hover:bg-stone-100">
              2
            </button>
            <button type="button" className="w-7 h-7 rounded text-green-700/50 font-semibold hover:bg-stone-100">
              3
            </button>
            <button type="button" className="w-7 h-7 rounded text-green-700/40 font-semibold hover:bg-stone-100">
              4
            </button>
            <button type="button" className="w-7 h-7 rounded text-green-700/40 font-semibold hover:bg-stone-100">
              5
            </button>
            <button
              type="button"
              className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Customer Modal (Input & Edit) */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
              <h2 className="text-stone-800 text-xl font-bold font-sans">
                {modalMode === 'input' ? 'Input Customer' : 'Edit Customer'}
              </h2>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1 text-stone-500 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="p-4 bg-white/80 rounded-[10px] border border-stone-800/80 flex flex-col gap-3 text-xs"
            >
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Id Customer</label>
                <input
                  type="text"
                  required
                  value={formCustomer.id}
                  onChange={(e) => setFormCustomer({ ...formCustomer, id: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Nama</label>
                <input
                  type="text"
                  required
                  placeholder="Nama perusahaan atau perorangan"
                  value={formCustomer.name}
                  onChange={(e) => setFormCustomer({ ...formCustomer, name: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Alamat</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Alamat lengkap operasional/pengiriman"
                  value={formCustomer.address}
                  onChange={(e) => setFormCustomer({ ...formCustomer, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">No HP</label>
                <input
                  type="text"
                  required
                  placeholder="08xx-xxxx-xxxx"
                  value={formCustomer.phone}
                  onChange={(e) => setFormCustomer({ ...formCustomer, phone: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-stone-300 rounded font-mono text-stone-900 focus:outline-none focus:border-green-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@perusahaan.com"
                  value={formCustomer.email}
                  onChange={(e) => setFormCustomer({ ...formCustomer, email: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-green-700"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="h-9 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{modalMode === 'input' ? 'Save Customer' : 'Update Customer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}