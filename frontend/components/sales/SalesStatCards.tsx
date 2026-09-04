'use client';

import React from 'react';
import { SalesItem } from '@/types/sales';

interface SalesStatCardsProps {
  items: SalesItem[];
}

export default function SalesStatCards({ items }: SalesStatCardsProps) {
  const totalTransactions = items.length;
  const approvedCount = items.filter((i) => i.status === 'Approved').length;
  const pendingCount = items.filter((i) => i.status === 'Pending').length;
  const rejectedCount = items.filter((i) => i.status === 'Rejected').length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
      {/* Total Transactions */}
      <div className="p-4 bg-white rounded-md border border-stone-200 shadow-2xs flex flex-col justify-between">
        <span className="text-sm font-semibold text-green-700">
          Total Transactions
        </span>
        <div className="my-2">
          <span className="text-4xl font-bold text-green-700 tracking-tight">
            {totalTransactions}
          </span>
        </div>
        <span className="text-xs text-green-700/80 font-medium">This Month</span>
      </div>

      {/* Approved */}
      <div className="p-4 bg-white rounded-md border border-stone-200 shadow-2xs flex flex-col justify-between">
        <span className="text-sm font-semibold text-green-700">Approved</span>
        <div className="my-2">
          <span className="text-4xl font-bold text-green-700 tracking-tight">
            {approvedCount}
          </span>
        </div>
        <span className="text-xs text-stone-400">Transaksi Selesai</span>
      </div>

      {/* Pending */}
      <div className="p-4 bg-white rounded-md border border-stone-200 shadow-2xs flex flex-col justify-between">
        <span className="text-sm font-semibold text-green-700">Pending</span>
        <div className="my-2">
          <span className="text-4xl font-bold text-amber-600 tracking-tight">
            {pendingCount}
          </span>
        </div>
        <span className="text-xs text-stone-400">Menunggu Verifikasi</span>
      </div>

      {/* Rejected */}
      <div className="p-4 bg-white rounded-md border border-stone-200 shadow-2xs flex flex-col justify-between">
        <span className="text-sm font-semibold text-green-700">Rejected</span>
        <div className="my-2">
          <span className="text-4xl font-bold text-red-800 tracking-tight">
            {rejectedCount}
          </span>
        </div>
        <span className="text-xs text-stone-400">Ditolak / Batal</span>
      </div>
    </section>
  );
}