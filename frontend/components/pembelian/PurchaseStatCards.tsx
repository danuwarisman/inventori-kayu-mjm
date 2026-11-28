'use client';

import React from 'react';
import { ShoppingBag, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { PurchaseOrder } from '@/types/purchase';

interface PurchaseStatCardsProps {
  orders: PurchaseOrder[];
}

export default function PurchaseStatCards({ orders }: PurchaseStatCardsProps) {
  const totalOrders = orders.length;

  const totalExpense = orders.reduce((sum, order) => {
    return sum + (order.totalHarga ?? 0);
  }, 0);

  const activeCount = orders.filter(
    (o) => o.statusPembelian !== 'DIBATALKAN' && o.statusPembelian !== 'DITOLAK'
  ).length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {/* Total Transaksi */}
      <div className="p-4 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Transaksi
          </span>
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-700">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-stone-900">
            {totalOrders.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Pesanan pembelian bahan baku
          </p>
        </div>
      </div>

      {/* Total Nilai Pembelian */}
      <div className="p-4 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Nilai Pembelian
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-700 truncate" title={`Rp ${totalExpense.toLocaleString('id-ID')}`}>
            Rp {totalExpense.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Akumulasi nilai pesanan log
          </p>
        </div>
      </div>

      {/* Menunggu Verifikasi/Approval */}
      <div className="p-4 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Pesanan Aktif
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-600">
            {activeCount.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Draft & verifikasi berjalan
          </p>
        </div>
      </div>

      {/* Selesai / Disetujui */}
      <div className="p-4 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Selesai / Diterima
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-teal-700">
            {orders.filter((o) => o.statusPembelian === 'DISETUJUI' || o.statusPembelian === 'DITERIMA').length.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Pesanan disetujui / diterima
          </p>
        </div>
      </div>
    </section>
  );
}
