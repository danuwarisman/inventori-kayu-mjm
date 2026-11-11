'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  Clock,
  FileText,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { purchaseApi, salesApi, logApi, sawmillApi } from '@/lib/api';
import { PurchaseOrder } from '@/types/purchase';
import { SalesItem } from '@/types/sales';
import { LogItem } from '@/types/log';
import { PlankItem } from '@/types/sawmill';
import { INITIAL_SALES } from '@/app/sales/page';
import { exportToPdf } from '@/lib/export';
import { formatDateID } from '@/lib/dates';

const SALES_STORAGE_KEY = 'mjm_sales_records_v1';

interface TransactionItem {
  id: string;
  date: string;
  category: string;
  type: 'PEMBELIAN' | 'PENJUALAN';
  amount: number;
  status: 'Completed' | 'Pending' | 'Rejected';
}

interface StockAlertItem {
  name: string;
  status: string;
  remaining: number;
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function ManagerDashboardPage() {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [sales, setSales] = useState<SalesItem[]>(INITIAL_SALES);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [planks, setPlanks] = useState<PlankItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);

    // Muat data penjualan lokal bila ada
    let localSales: SalesItem[] = INITIAL_SALES;
    try {
      const saved = window.localStorage.getItem(SALES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SalesItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          localSales = parsed;
        }
      }
    } catch {
      // Abaikan bila localStorage tidak tersedia
    }

    const [poRes, salesRes, logRes, plankRes] = await Promise.allSettled([
      purchaseApi.list(),
      salesApi.list(),
      logApi.list(),
      sawmillApi.listPlanks(),
    ]);

    if (poRes.status === 'fulfilled' && Array.isArray(poRes.value)) {
      setPurchases(poRes.value);
    }

    if (
      salesRes.status === 'fulfilled' &&
      Array.isArray(salesRes.value) &&
      salesRes.value.length > 0
    ) {
      const mappedSales: SalesItem[] = salesRes.value.map((s) => {
        const qty = (s.detailPenjualan ?? []).reduce(
          (sum, d) => sum + (d.kuantitasTerjual || 0),
          0
        );
        const total = s.totalHarga || 0;
        const unitPrice = qty > 0 ? Math.round(total / qty) : total;
        const status: SalesItem['status'] =
          s.statusPenjualan === 'DISETUJUI' || s.statusPenjualan === 'SELESAI'
            ? 'Approved'
            : s.statusPenjualan === 'DITOLAK' || s.statusPenjualan === 'DIBATALKAN'
            ? 'Rejected'
            : 'Pending';

        return {
          id_transaksi: `TR-${String(s.idPenjualan).padStart(4, '0')}`,
          tanggal: s.tanggalJual
            ? new Date(s.tanggalJual).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          nama_customer: s.customer?.namaCustomer || 'Customer',
          kuantitas: qty,
          harga_satuan: unitPrice,
          total_harga: total,
          status,
        };
      });
      setSales(mappedSales);
    } else {
      setSales(localSales);
    }

    if (logRes.status === 'fulfilled' && Array.isArray(logRes.value)) {
      setLogs(logRes.value);
    }

    if (plankRes.status === 'fulfilled' && Array.isArray(plankRes.value)) {
      setPlanks(plankRes.value);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // 1. Agregasi Finansial Riil dari Penjualan & Pembelian (PO Disetujui)
  const {
    totalRevenue,
    totalExpenses,
    netProfit,
    pendingInvoices,
    accountsReceivable,
    approvedPurchasesCount,
    approvedSalesCount,
  } = useMemo(() => {
    const approvedSales = sales.filter((s) => s.status === 'Approved');
    const pendingSales = sales.filter((s) => s.status === 'Pending');

    const approvedPurchases = purchases.filter(
      (p) =>
        p.statusPembelian === 'DISETUJUI' ||
        p.statusPembelian === 'DITERIMA' ||
        p.statusVerifikasi === 'DISETUJUI'
    );
    const pendingPurchases = purchases.filter(
      (p) =>
        p.statusPembelian === 'MENUNGGU' || p.statusVerifikasi === 'PENDING'
    );

    const rev = approvedSales.reduce((sum, s) => sum + (s.total_harga || 0), 0);
    const exp = approvedPurchases.reduce(
      (sum, p) => sum + (p.totalHarga || 0),
      0
    );
    const receivable = pendingSales.reduce(
      (sum, s) => sum + (s.total_harga || 0),
      0
    );

    return {
      totalRevenue: rev,
      totalExpenses: exp,
      netProfit: rev - exp,
      pendingInvoices: pendingSales.length + pendingPurchases.length,
      accountsReceivable: receivable,
      approvedPurchasesCount: approvedPurchases.length,
      approvedSalesCount: approvedSales.length,
    };
  }, [purchases, sales]);

  // 2. Gabungan Transaksi Terbaru (Pembelian PO + Penjualan)
  const transactions = useMemo<TransactionItem[]>(() => {
    const poItems: TransactionItem[] = purchases.map((p) => {
      const isApproved =
        p.statusPembelian === 'DISETUJUI' ||
        p.statusPembelian === 'DITERIMA' ||
        p.statusVerifikasi === 'DISETUJUI';
      const isRejected =
        p.statusPembelian === 'DITOLAK' ||
        p.statusPembelian === 'DIBATALKAN' ||
        p.statusVerifikasi === 'DITOLAK';

      return {
        id: `PO-${String(p.idPembelian).padStart(4, '0')}`,
        date: p.tanggalBeli
          ? new Date(p.tanggalBeli).toISOString().split('T')[0]
          : '-',
        category: `Pembelian Log - ${p.supplier?.namaSupplier || 'Supplier'}`,
        type: 'PEMBELIAN',
        amount: p.totalHarga || 0,
        status: isApproved ? 'Completed' : isRejected ? 'Rejected' : 'Pending',
      };
    });

    const salesItems: TransactionItem[] = sales.map((s) => ({
      id: s.id_transaksi,
      date: s.tanggal,
      category: `Penjualan Kayu - ${s.nama_customer}`,
      type: 'PENJUALAN',
      amount: s.total_harga || 0,
      status:
        s.status === 'Approved'
          ? 'Completed'
          : s.status === 'Rejected'
          ? 'Rejected'
          : 'Pending',
    }));

    return [...poItems, ...salesItems]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8);
  }, [purchases, sales]);

  // 3. Peringatan Stok Riil dari Inventori Log & Plank
  const stockAlerts = useMemo<StockAlertItem[]>(() => {
    const activeLogs = logs.filter(
      (l) => l.stage === 'Log' || l.statusLog === 'Log'
    );
    const sortimenGroups = ['Sortimen A', 'Sortimen B', 'Sortimen C'].map(
      (sortimen) => {
        const count = activeLogs.filter((l) => l.sortimen === sortimen).length;
        return {
          name: `Kayu Log Jati ${sortimen}`,
          remaining: count,
          status:
            count === 0
              ? 'Stok Habis'
              : count <= 5
              ? 'Segera Habis'
              : count <= 12
              ? 'Stok Menipis'
              : 'Stok Aman',
        };
      }
    );

    const readyPlanks = planks.filter(
      (p) =>
        p.stage === 'Finish Inventory' ||
        p.stage === 'Dry Kiln' ||
        p.stage === 'Sawmill'
    );
    const gradeAPlanks = readyPlanks.filter((p) => p.grade === 'Grade A').length;

    const combined: StockAlertItem[] = [
      ...sortimenGroups,
      {
        name: 'Papan Olahan Jati Grade A',
        remaining: gradeAPlanks,
        status:
          gradeAPlanks <= 5
            ? 'Perlu Produksi'
            : gradeAPlanks <= 15
            ? 'Stok Menipis'
            : 'Stok Tersedia',
      },
    ];

    return combined.sort((a, b) => a.remaining - b.remaining).slice(0, 4);
  }, [logs, planks]);

  // 4. Cashflow Bulanan Riil (dengan baseline visual proporsional)
  const monthlyCashflow = useMemo(() => {
    const incomeByMonth = new Array<number>(12).fill(0);
    const expenseByMonth = new Array<number>(12).fill(0);

    sales
      .filter((s) => s.status === 'Approved')
      .forEach((s) => {
        const d = new Date(s.tanggal);
        if (!Number.isNaN(d.getTime())) {
          incomeByMonth[d.getMonth()] += s.total_harga || 0;
        }
      });

    purchases
      .filter(
        (p) =>
          p.statusPembelian === 'DISETUJUI' ||
          p.statusPembelian === 'DITERIMA' ||
          p.statusVerifikasi === 'DISETUJUI'
      )
      .forEach((p) => {
        const d = new Date(p.tanggalBeli);
        if (!Number.isNaN(d.getTime())) {
          expenseByMonth[d.getMonth()] += p.totalHarga || 0;
        }
      });

    const maxVal = Math.max(100_000_000, ...incomeByMonth, ...expenseByMonth);

    return MONTH_LABELS.map((m, idx) => {
      const rawInc = incomeByMonth[idx];
      const rawExp = expenseByMonth[idx];
      return {
        m,
        rawInc,
        rawExp,
        incPct: rawInc > 0 ? Math.max(8, Math.round((rawInc / maxVal) * 100)) : 4,
        expPct: rawExp > 0 ? Math.max(8, Math.round((rawExp / maxVal) * 100)) : 4,
      };
    });
  }, [purchases, sales]);

  const handleExportFinancialReport = () => {
    exportToPdf({
      title: 'Laporan Ringkasan Finansial & Transaksi PT Margi Jati Makmur',
      subtitle: `Dicetak pada: ${formatDateID(new Date().toISOString().split('T')[0])} | Total Pendapatan: Rp ${totalRevenue.toLocaleString('id-ID')} | Total Pengeluaran PO: Rp ${totalExpenses.toLocaleString('id-ID')} | Laba Bersih: Rp ${netProfit.toLocaleString('id-ID')}`,
      sections: [
        {
          title: 'Ringkasan Eksekutif Keuangan',
          columns: ['Indikator Keuangan', 'Jumlah Transaksi', 'Total Nilai (Rp)'],
          rows: [
            [
              'Total Pendapatan Penjualan (Approved)',
              `${approvedSalesCount} Transaksi`,
              `Rp ${totalRevenue.toLocaleString('id-ID')}`,
            ],
            [
              'Total Pengeluaran Pembelian Log (PO Disetujui)',
              `${approvedPurchasesCount} PO`,
              `Rp ${totalExpenses.toLocaleString('id-ID')}`,
            ],
            [
              'Laba / Selisih Kas Bersih (Net Profit)',
              '-',
              `Rp ${netProfit.toLocaleString('id-ID')}`,
            ],
            [
              'Piutang / Menunggu Approval (Accounts Receivable)',
              `${pendingInvoices} Antrean`,
              `Rp ${accountsReceivable.toLocaleString('id-ID')}`,
            ],
          ],
        },
        {
          title: 'Daftar Transaksi Pembelian & Penjualan Terbaru',
          columns: ['Tanggal', 'No. Transaksi', 'Jenis', 'Keterangan', 'Nilai (Rp)', 'Status'],
          rows: transactions.map((tx) => [
            formatDateID(tx.date),
            tx.id,
            tx.type,
            tx.category,
            `Rp ${tx.amount.toLocaleString('id-ID')}`,
            tx.status,
          ]),
        },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Financial Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="p-6 bg-white rounded-lg shadow-xs border border-stone-300 relative flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              TOTAL REVENUE (PENJUALAN APPROVED)
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
              {approvedSalesCount} Transaksi Disetujui
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
              NET PROFIT (SELISIH PENDAPATAN - PO)
            </span>
            <div className="p-1.5 bg-violet-100 rounded-sm text-neutral-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span
              className={`text-2xl font-bold ${
                netProfit >= 0 ? 'text-stone-900' : 'text-rose-700'
              }`}
            >
              {netProfit < 0 ? '- ' : ''}Rp{' '}
              {Math.abs(netProfit).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-100">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                netProfit >= 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {netProfit >= 0 ? 'Surplus Operasional' : 'Defisit Pengadaan'}
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
              TOTAL EXPENSES (PO PEMBELIAN ACC)
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
            <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[11px] font-semibold">
              {approvedPurchasesCount} PO Disetujui Manager
            </span>
            <Link
              href="/pembelian"
              className="text-green-800 font-semibold hover:underline"
            >
              Detail PO
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
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-stone-900">
                Cashflow Trend ({new Date().getFullYear()})
              </h3>
              <button
                type="button"
                onClick={loadDashboardData}
                disabled={isLoading}
                className="p-1 text-stone-500 hover:text-green-800 rounded cursor-pointer"
                title="Muat ulang metrik dari database"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
                />
              </button>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-stone-700">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-green-900 rounded-full" />
                <span>Income (Sales)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-700 rounded-full" />
                <span>Expenses (PO)</span>
              </div>
            </div>
          </div>

          {/* Chart Display Structure */}
          <div className="h-64 relative border-l border-b border-stone-300 flex flex-col justify-end p-2">
            <div className="absolute left-2 top-2 text-[10px] text-stone-400">
              Max
            </div>
            <div className="absolute left-2 top-20 text-[10px] text-stone-400">
              60%
            </div>
            <div className="absolute left-2 top-38 text-[10px] text-stone-400">
              30%
            </div>
            <div className="absolute left-2 bottom-2 text-[10px] text-stone-400">
              Rp 0
            </div>

            {/* Monthly Comparison Bars */}
            <div className="flex-1 flex items-end justify-between pl-12 pr-2 pb-1 gap-2">
              {monthlyCashflow.map((item) => (
                <div
                  key={item.m}
                  className="flex flex-col items-center gap-1 flex-1 h-full justify-end group"
                >
                  <div className="flex items-end gap-1 h-44 w-full justify-center">
                    <div
                      style={{ height: `${item.incPct}%` }}
                      className="w-3 sm:w-4 bg-green-900 rounded-t-xs hover:bg-green-700 transition-all cursor-pointer relative"
                      title={`Income ${item.m}: Rp ${item.rawInc.toLocaleString('id-ID')}`}
                    />
                    <div
                      style={{ height: `${item.expPct}%` }}
                      className="w-3 sm:w-4 bg-red-700 rounded-t-xs hover:bg-red-600 transition-all cursor-pointer relative"
                      title={`Expenses ${item.m}: Rp ${item.rawExp.toLocaleString('id-ID')}`}
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
            <p className="text-xs text-green-200">
              Cetak laporan rekapitulasi keuangan riil (PO &amp; Penjualan)
            </p>
            <button
              type="button"
              onClick={handleExportFinancialReport}
              className="mt-1 w-full py-2.5 px-4 bg-green-200 hover:bg-green-300 text-green-950 text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Generate Financial Report</span>
            </button>
          </div>

          {/* Pending Approvals / Invoices */}
          <div className="p-4 bg-white rounded-lg shadow-xs border border-stone-300 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-neutral-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-600 block">
                  Pending Approvals (PO &amp; Sales)
                </span>
                <span className="text-lg font-bold text-stone-900">
                  {pendingInvoices}{' '}
                  <span className="text-xs text-neutral-500 font-normal">
                    menunggu persetujuan
                  </span>
                </span>
              </div>
            </div>
            <Link
              href="/pembelian"
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
                  Pending Sales Value
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
            <h3 className="text-xl font-bold text-stone-900">
              Recent Transactions (PO &amp; Sales)
            </h3>
            <div className="flex items-center gap-3">
              <Link
                href="/pembelian"
                className="text-xs font-bold text-green-800 flex items-center gap-1 hover:underline"
              >
                <span>Pembelian PO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/sales"
                className="text-xs font-bold text-green-800 flex items-center gap-1 hover:underline"
              >
                <span>Penjualan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
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
                    <td colSpan={5} className="py-8 text-center text-stone-400">
                      Belum ada riwayat transaksi Pembelian maupun Penjualan.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr
                      key={`${tx.type}-${tx.id}`}
                      className="text-stone-800 hover:bg-stone-50"
                    >
                      <td className="py-3 px-2 text-center text-stone-600 font-mono">
                        {formatDateID(tx.date)}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-medium">
                        {tx.id}
                      </td>
                      <td className="py-3 px-2 text-center">{tx.category}</td>
                      <td
                        className={`py-3 px-2 text-center font-semibold ${
                          tx.type === 'PEMBELIAN'
                            ? 'text-rose-700'
                            : 'text-emerald-800'
                        }`}
                      >
                        {tx.type === 'PEMBELIAN' ? '- ' : '+ '}Rp{' '}
                        {tx.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-sm text-[11px] font-medium ${
                            tx.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : tx.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
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
          <h3 className="text-xl font-bold text-stone-900">Stock Alerts (Riil)</h3>

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
                      {alert.remaining} unit tersedia di gudang
                    </span>
                  </div>
                </div>
                <Link
                  href="/pembelian"
                  className="px-3 py-1 rounded border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Reorder
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
