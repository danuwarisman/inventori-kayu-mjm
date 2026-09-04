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
  Inbox,
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
  // Metrik keuangan awal (bersih)
  const [totalRevenue] = useState<number>(0);
  const [netProfit] = useState<number>(0);
  const [totalExpenses] = useState<number>(0);

  // Data transaksi dan alert awal (kosong)
  const [transactions] = useState<TransactionItem[]>([]);
  const [stockAlerts] = useState<StockAlertItem[]>([]);
  const [pendingInvoices] = useState<number>(0);
  const [accountsReceivable] = useState<number>(0);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
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
            <span className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded text-[11px] font-medium">
              0% vs last month
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
            <span className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded text-[11px] font-medium">
              0% vs last month
            </span>
            <Link
              href="/sales"
              className="text-green-800 font-semibold hover:underline"
            >
              Detail
            </Link>
          </div>
          <div className="w-1 h-full left-0 top-0 absolute bg-neutral-600" />
        </div>

        {/* Total Expenses */}
        <div className="p-6 bg-white rounded-lg shadow-xs border border-stone-300 relative flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              TOTAL EXPENSES
            </span>
            <div className="p-1.5 bg-rose-100 rounded-sm text-red-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold text-stone-900">
              Rp {totalExpenses.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-100">
            <span className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded text-[11px] font-medium">
              0% vs last month
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
            <h3 className="text-xl font-semibold text-stone-900">Cashflow Trend</h3>
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

          {/* Chart Placeholder Structure from Figma */}
          <div className="h-64 relative border-l border-b border-stone-300 flex flex-col justify-end p-2">
            <div className="absolute left-2 top-2 text-[10px] text-stone-400">
              Rp 6M
            </div>
            <div className="absolute left-2 top-20 text-[10px] text-stone-400">
              Rp 4M
            </div>
            <div className="absolute left-2 top-40 text-[10px] text-stone-400">
              Rp 2M
            </div>
            <div className="absolute left-2 bottom-2 text-[10px] text-stone-400">
              Rp 0
            </div>

            {/* Zero State Notice */}
            <div className="flex-1 flex items-center justify-center text-xs text-stone-400">
              Belum ada data transaksi pendapatan dan pengeluaran pada tahun berjalan.
            </div>

            {/* Month Axis Labels */}
            <div className="grid grid-cols-12 text-center text-[10px] text-stone-500 pt-2 border-t border-stone-200">
              {months.map((m) => (
                <span key={m}>{m}</span>
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
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5 text-stone-400">
                        <Inbox className="w-7 h-7 stroke-[1.5]" />
                        <span className="text-xs font-semibold text-stone-600">
                          Belum ada transaksi tercatat
                        </span>
                        <span className="text-[11px] text-stone-400">
                          Transaksi pembelian dan penjualan akan otomatis muncul di sini.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
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
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-sm text-[11px] font-medium">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alerts (Col 4) */}
        <div className="lg:col-span-4 p-6 bg-white rounded-2xl shadow-xs border border-stone-300 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-stone-900">Stock Alerts</h3>

          <div className="flex flex-col gap-3">
            {stockAlerts.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center gap-2 text-stone-400 text-center">
                <AlertTriangle className="w-7 h-7 text-stone-300" />
                <span className="text-xs font-semibold text-stone-600">
                  Semua stok dalam batas aman
                </span>
                <span className="text-[11px] text-stone-400">
                  Tidak ada kayu gelondongan atau papan yang berada di bawah kuota minimum.
                </span>
              </div>
            ) : (
              stockAlerts.map((alert, i) => (
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
                    className="px-3 py-1 rounded border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors"
                  >
                    Reorder
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}