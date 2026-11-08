'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  Clock,
  FileText,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface TransactionItem {
  id: string;
  date: string;
  category: string;
  amount: number;
  status: string;
}

interface StockAlertItem {
  name: string;
  status: string;
  remaining: number;
}

export default function ManagerDashboardPage() {
  // Metrik keuangan aktif
  const [totalRevenue] = useState<number>(349250000);
  const [netProfit] = useState<number>(112750000);
  const [totalExpenses] = useState<number>(236500000);

  // Data transaksi dan alert aktif
  const [transactions] = useState<TransactionItem[]>([
    {
      id: 'TRX-2026-001',
      date: '2026-11-07',
      category: 'Penjualan Kayu Jati Log A',
      amount: 45000000,
      status: 'Completed',
    },
    {
      id: 'TRX-2026-002',
      date: '2026-11-06',
      category: 'Pengadaan Log Randublatung',
      amount: 28500000,
      status: 'Completed',
    },
    {
      id: 'TRX-2026-003',
      date: '2026-11-06',
      category: 'Penjualan Papan Olahan KD',
      amount: 62000000,
      status: 'Completed',
    },
    {
      id: 'TRX-2026-004',
      date: '2026-11-05',
      category: 'Operasional Dry-Kiln 2 & 3',
      amount: 14200000,
      status: 'Pending',
    },
    {
      id: 'TRX-2026-005',
      date: '2026-11-04',
      category: 'Penjualan Sortimen B Furniture',
      amount: 38000000,
      status: 'Completed',
    },
  ]);

  const [stockAlerts] = useState<StockAlertItem[]>([
    {
      name: 'Kayu Log Jati Sortimen A (D > 40cm)',
      status: 'Stok Menipis',
      remaining: 12,
    },
    {
      name: 'Papan Olahan Kamper KD Grade A',
      status: 'Segera Habis',
      remaining: 6,
    },
    {
      name: 'Stok Log Sortimen C (Diameter < 20cm)',
      status: 'Perlu Restock',
      remaining: 8,
    },
  ]);

  const [pendingInvoices] = useState<number>(3);
  const [accountsReceivable] = useState<number>(45000000);

  const monthlyCashflow = [
    { m: 'Jan', inc: 45, exp: 30 },
    { m: 'Feb', inc: 55, exp: 35 },
    { m: 'Mar', inc: 50, exp: 32 },
    { m: 'Apr', inc: 65, exp: 40 },
    { m: 'May', inc: 72, exp: 45 },
    { m: 'Jun', inc: 80, exp: 50 },
    { m: 'Jul', inc: 70, exp: 48 },
    { m: 'Aug', inc: 85, exp: 55 },
    { m: 'Sep', inc: 90, exp: 60 },
    { m: 'Oct', inc: 88, exp: 58 },
    { m: 'Nov', inc: 95, exp: 62 },
    { m: 'Dec', inc: 75, exp: 48 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Financial Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="p-6 bg-white rounded-lg shadow-xs border border-stone-300 relative flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              TOTAL REVENUE
            </span>
            <div className="p-1.5 bg-green-100 rounded-sm text-green-900">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold text-stone-900">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-100">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-semibold">
              +14.2% vs last month
            </span>
            <Link
              href="/sales"
              className="text-green-800 font-semibold hover:underline"
            >
              Detail
            </Link>
          </div>
          <div className="w-1 h-full left-0 top-0 absolute bg-green-900" />
        </div>

        {/* Net Profit */}
        <div className="p-6 bg-white rounded-lg shadow-xs border border-stone-300 relative flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              NET PROFIT
            </span>
            <div className="p-1.5 bg-violet-100 rounded-sm text-neutral-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold text-stone-900">
              Rp {netProfit.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-100">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-semibold">
              +8.6% vs last month
            </span>
            <Link
              href="/sales"
              className="text-green-800 font-semibold hover:underline"
            >
              Detail
            </Link>
          </div>
          <div className="w-1 h-full left-0 top-0 absolute bg-neutral-700" />
        </div>

        {/* Total Expenses */}
        <div className="p-6 bg-white rounded-lg shadow-xs border border-stone-300 relative flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              TOTAL EXPENSES
            </span>
            <div className="p-1.5 bg-red-100 rounded-sm text-red-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold text-stone-900">
              Rp {totalExpenses.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-100">
            <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[11px] font-medium">
              -2.1% vs last month
            </span>
            <Link
              href="/sales"
              className="text-green-800 font-semibold hover:underline"
            >
              Detail
            </Link>
          </div>
          <div className="w-1 h-full left-0 top-0 absolute bg-red-700" />
        </div>
      </section>

      {/* 2. Middle Row: Cashflow Trend & Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Cashflow Trend Chart Box (Col 2) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-lg shadow-xs border border-stone-300 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <h3 className="text-xl font-semibold text-stone-900">Cashflow Trend (2026)</h3>
            <div className="flex items-center gap-4 text-xs font-medium text-stone-700">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-green-900 rounded-full" />
                <span>Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-700 rounded-full" />
                <span>Expenses</span>
              </div>
            </div>
          </div>

          {/* Chart Display Structure */}
          <div className="h-64 relative border-l border-b border-stone-300 flex flex-col justify-end p-2">
            <div className="absolute left-2 top-2 text-[10px] text-stone-400">
              Rp 100M
            </div>
            <div className="absolute left-2 top-20 text-[10px] text-stone-400">
              Rp 60M
            </div>
            <div className="absolute left-2 top-38 text-[10px] text-stone-400">
              Rp 30M
            </div>
            <div className="absolute left-2 bottom-2 text-[10px] text-stone-400">
              Rp 0
            </div>

            {/* Monthly Comparison Bars */}
            <div className="flex-1 flex items-end justify-between pl-12 pr-2 pb-1 gap-2">
              {monthlyCashflow.map((item) => (
                <div key={item.m} className="flex flex-col items-center gap-1 flex-1 h-full justify-end group">
                  <div className="flex items-end gap-1 h-44 w-full justify-center">
                    <div
                      style={{ height: `${item.inc}%` }}
                      className="w-3 sm:w-4 bg-green-900 rounded-t-xs hover:bg-green-700 transition-all cursor-pointer relative"
                      title={`Income ${item.m}: Rp ${(item.inc * 1.2).toFixed(1)}M`}
                    />
                    <div
                      style={{ height: `${item.exp}%` }}
                      className="w-3 sm:w-4 bg-red-700 rounded-t-xs hover:bg-red-600 transition-all cursor-pointer relative"
                      title={`Expenses ${item.m}: Rp ${(item.exp * 1.2).toFixed(1)}M`}
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 font-medium group-hover:text-green-800">
                    {item.m}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Finance Summaries (Col 1) */}
        <div className="flex flex-col gap-4">
          {/* Quick Action Card */}
          <div className="p-6 bg-neutral-700 text-white rounded-lg shadow-xs flex flex-col gap-3">
            <h4 className="text-lg font-semibold">Quick Actions</h4>
            <p className="text-xs text-green-200">Ready for the month-end review?</p>
            <button
              type="button"
              className="mt-1 w-full py-2.5 px-4 bg-green-200 hover:bg-green-300 text-green-950 text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Generate Financial Report</span>
            </button>
          </div>

          {/* Pending Invoices */}
          <div className="p-4 bg-white rounded-lg shadow-xs border border-stone-300 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-neutral-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-600 block">
                  Pending Invoices
                </span>
                <span className="text-lg font-bold text-stone-900">
                  {pendingInvoices}{' '}
                  <span className="text-xs text-neutral-500 font-normal">
                    awaiting payment
                  </span>
                </span>
              </div>
            </div>
            <Link
              href="/sales"
              className="text-xs font-semibold text-green-900 hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Accounts Receivable */}
          <div className="p-4 bg-white rounded-lg shadow-xs border border-stone-300 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-neutral-700 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-600 block">
                  Accounts Receivable
                </span>
                <span className="text-lg font-bold text-stone-900">
                  Rp {accountsReceivable.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <Link
              href="/sales"
              className="text-xs font-semibold text-green-900 hover:underline"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Bottom Grid: Recent Transactions & Stock Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Transactions Table (Col 8) */}
        <div className="lg:col-span-8 p-6 bg-white rounded-2xl shadow-xs border border-stone-300 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-stone-900">Recent Transactions</h3>
            <Link
              href="/sales"
              className="text-xs font-bold text-green-800 flex items-center gap-1 hover:underline"
            >
              <span>Semua Transaksi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-300 text-neutral-500 font-mono uppercase tracking-wider">
                  <th className="py-2.5 px-2 text-center">Date</th>
                  <th className="py-2.5 px-2 text-center">Transaction ID</th>
                  <th className="py-2.5 px-2 text-center">Category</th>
                  <th className="py-2.5 px-2 text-center">Amount</th>
                  <th className="py-2.5 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="text-stone-800 hover:bg-stone-50">
                    <td className="py-3 px-2 text-center text-stone-600 font-mono">
                      {tx.date}
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-medium">
                      {tx.id}
                    </td>
                    <td className="py-3 px-2 text-center">{tx.category}</td>
                    <td className="py-3 px-2 text-center font-semibold">
                      Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-sm text-[11px] font-medium ${
                        tx.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alerts (Col 4) */}
        <div className="lg:col-span-4 p-6 bg-white rounded-2xl shadow-xs border border-stone-300 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-stone-900">Stock Alerts</h3>

          <div className="flex flex-col gap-3">
            {stockAlerts.map((alert, i) => (
              <div
                key={i}
                className="pb-3 border-b border-stone-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-50 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      {alert.name}
                    </span>
                    <span className="text-[11px] text-orange-600 font-semibold block">
                      {alert.status}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {alert.remaining} units remaining
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 rounded border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Reorder
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
