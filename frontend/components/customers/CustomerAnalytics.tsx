'use client';

import React from 'react';
import {
  Award,
  DollarSign,
  Users,
  Building2,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CustomerItem, SmartAlertItem } from '@/types/customer';

interface CustomerAnalyticsProps {
  customers: CustomerItem[];
  alerts?: SmartAlertItem[];
}

export default function CustomerAnalytics({
  customers,
  alerts = [],
}: CustomerAnalyticsProps) {
  // Nilai metrik awal bersih (Zero-State)
  const mostFrequentBuyer = customers.length > 0 ? customers[0].nama : '-';
  const highestTotalRevenue = 0;
  const activeCount = customers.length;
  const longestContractCompany = customers.length > 0 ? customers[0].nama : '-';

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch font-sans">
      {/* 4 Kartu Metrik CRM */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Most Frequent Buyer */}
        <div className="p-4 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
              Most Frequent<br />Buyer
            </span>
            <div className="p-1 rounded text-amber-800 bg-amber-100/50">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="py-2">
            <span className="text-xl font-bold text-neutral-800 truncate block">
              {mostFrequentBuyer}
            </span>
          </div>
          <span className="text-xs text-green-700 font-medium">
            {customers.length > 0 ? '14 Orders / YTD' : '0 Orders / YTD'}
          </span>
        </div>

        {/* Highest Total */}
        <div className="p-4 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
              Highest Total
            </span>
            <div className="p-1 rounded text-amber-800 bg-amber-100/50">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="py-2">
            <span className="text-xl font-bold text-neutral-800">
              Rp {highestTotalRevenue.toLocaleString('id-ID')}
            </span>
          </div>
          <span className="text-xs text-neutral-500">
            {customers.length > 0 ? customers[0].nama : 'Belum ada transaksi'}
          </span>
        </div>

        {/* Active Customers */}
        <div className="p-4 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
              Active<br />Customers
            </span>
            <div className="p-1 rounded text-amber-800 bg-amber-100/50">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="py-2">
            <span className="text-xl font-bold text-neutral-800">
              {activeCount.toLocaleString('id-ID')}
            </span>
          </div>
          <span className="text-xs text-green-700 font-medium">
            +0% vs Last Month
          </span>
        </div>

        {/* Longest Contract */}
        <div className="p-4 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
              Longest Contract
            </span>
            <div className="p-1 rounded text-amber-800 bg-amber-100/50">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="py-2">
            <span className="text-xl font-bold text-neutral-800 truncate block">
              {longestContractCompany}
            </span>
          </div>
          <span className="text-xs text-neutral-500">
            {customers.length > 0 ? '1 Year remaining' : 'Belum ada kontrak'}
          </span>
        </div>
      </div>

      {/* Smart Alerts Box */}
      <div className="lg:col-span-5 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col overflow-hidden">
        <div className="p-4 bg-orange-100/30 border-b border-neutral-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-neutral-800" />
            <h3 className="text-sm font-bold text-neutral-800">Smart Alerts</h3>
          </div>
          <span className="px-2 py-0.5 bg-rose-200 text-red-800 text-[11px] font-bold rounded-full">
            {alerts.length} New
          </span>
        </div>

        <div className="p-4 flex flex-col gap-2.5 flex-1 justify-center">
          {alerts.length === 0 ? (
            <div className="py-6 flex flex-col items-center justify-center text-center gap-1.5 text-stone-400">
              <CheckCircle2 className="w-6 h-6 text-stone-300" />
              <span className="text-xs font-semibold text-stone-600">
                Semua kontrak pelanggan aman
              </span>
              <span className="text-[11px] text-stone-400">
                Tidak ada masa kontrak yang mendekati kedaluwarsa saat ini.
              </span>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 bg-lime-50/70 rounded-lg border border-neutral-200 flex items-start gap-3"
              >
                <div className="pt-0.5 text-orange-600">
                  {alert.type === 'warning' ? (
                    <Clock className="w-4 h-4 text-orange-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-neutral-500" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-neutral-800">
                    {alert.title}
                  </span>
                  <span className="text-[11px] text-neutral-600 truncate">
                    {alert.description}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}