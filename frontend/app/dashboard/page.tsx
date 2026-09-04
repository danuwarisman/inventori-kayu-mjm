'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  TrendingUp,
  Flame,
  ArrowRight,
  PlusCircle,
  Inbox,
  FlameKindling,
  Users,
  DollarSign,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  sortimen: string;
  grade: string;
  stage: string;
  time: string;
}

export default function OperationalDashboardPage() {
  // State data operasional awal (bersih tanpa dummy)
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [logCount, setLogCount] = useState<number>(0);
  const [plankCount, setPlankCount] = useState<number>(0);
  const [kilnCount, setKilnCount] = useState<number>(0);
  const [totalCustomers] = useState<number>(0);
  const [totalSales] = useState<number>(0);

  // Quick Entry State
  const [diameter, setDiameter] = useState<string>('');
  const [panjang, setPanjang] = useState<string>('');
  const [sortimen, setSortimen] = useState<string>('Sortimen A');
  const [suplier, setSuplier] = useState<string>('');

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diameter || !panjang) return;

    const newActivity: ActivityItem = {
      id: `L-2026-3-A-${activities.length + 1}`,
      sortimen,
      grade: 'Grade A',
      stage: 'Log Masuk',
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setActivities((prev) => [newActivity, ...prev]);
    setLogCount((prev) => prev + 1);
    setDiameter('');
    setPanjang('');
    setSuplier('');
  };

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Top Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Log Ready */}
        <div className="p-4 bg-white rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-green-700">
              Ready to Sale (LOG)
            </span>
            <Package className="w-5 h-5 text-green-700" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-stone-900 tracking-tight">
              {logCount.toLocaleString('id-ID')} pcs
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-1 font-semibold text-stone-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>0%</span>
            </div>
            <Link
              href="/master-data"
              className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-semibold transition-colors"
            >
              Detail
            </Link>
          </div>
        </div>

        {/* Card 2: Plank Ready */}
        <div className="p-4 bg-white rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-green-700">
              Ready to Sale (Plank)
            </span>
            <Package className="w-5 h-5 text-green-700" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-stone-900 tracking-tight">
              {plankCount.toLocaleString('id-ID')} pcs
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-1 font-semibold text-stone-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>0%</span>
            </div>
            <Link
              href="/stock-reports"
              className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-semibold transition-colors"
            >
              Detail
            </Link>
          </div>
        </div>

        {/* Card 3: Dry Kiln Process */}
        <div className="p-4 bg-white rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-green-700">
              Dry-Kiln Process
            </span>
            <Flame className="w-5 h-5 text-green-700" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-stone-900 tracking-tight">
              {kilnCount.toLocaleString('id-ID')} pcs
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-1 font-semibold text-stone-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>0%</span>
            </div>
            <Link
              href="/dry-kiln"
              className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-semibold transition-colors"
            >
              Detail
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Middle Grid: Recent Activity & Quick Entry */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Activity Table (Left 2 Col) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-stone-200 shadow-xs p-5 flex flex-col gap-4">
          <h2 className="text-base font-bold text-green-700">Recent Activity</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3 text-center">ID BATCH</th>
                  <th className="py-2.5 px-3 text-center">Sortimen</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Stage</th>
                  <th className="py-2.5 px-3 text-center">Time Stamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                        <Inbox className="w-8 h-8 stroke-[1.5]" />
                        <p className="text-sm font-semibold text-stone-600">
                          Belum ada aktivitas produksi
                        </p>
                        <p className="text-xs text-stone-400">
                          Gunakan panel Quick Entry di samping untuk mendaftarkan log baru.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  activities.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`text-stone-700 ${
                        idx % 2 === 1 ? 'bg-lime-600/5' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-mono font-medium text-green-800">
                        {item.id}
                      </td>
                      <td className="py-3 px-3 text-center">{item.sortimen}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 border border-green-700 text-green-800 rounded-xs text-[11px] font-semibold">
                          {item.grade}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-green-700 font-medium">
                        {item.stage}
                      </td>
                      <td className="py-3 px-3 text-center text-stone-500 font-mono">
                        {item.time}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Entry & Stock Health Panel (Right 1 Col) */}
        <div className="flex flex-col gap-4">
          {/* Quick Entry Form */}
          <div className="bg-white rounded-lg border border-stone-300 shadow-xs p-5 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-stone-900">Quick Entry</h3>

            <form onSubmit={handleQuickRegister} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-stone-700">
                  Log Diameter (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="0.0"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  className="w-full h-10 px-3 border border-stone-300 rounded text-stone-900 focus:border-green-700 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-stone-700 uppercase">
                  Panjang (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="0.0"
                  value={panjang}
                  onChange={(e) => setPanjang(e.target.value)}
                  className="w-full h-10 px-3 border border-stone-300 rounded text-stone-900 focus:border-green-700 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-stone-700">Sortimen</label>
                <select
                  value={sortimen}
                  onChange={(e) => setSortimen(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-stone-300 rounded text-stone-800 focus:border-green-700 focus:outline-none"
                >
                  <option value="Sortimen A">Sortimen A</option>
                  <option value="Sortimen B">Sortimen B</option>
                  <option value="Sortimen C">Sortimen C</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-stone-700">Suplier</label>
                <input
                  type="text"
                  placeholder="Nama PT / CV Supplier"
                  value={suplier}
                  onChange={(e) => setSuplier(e.target.value)}
                  className="w-full h-10 px-3 border border-stone-300 rounded text-stone-900 focus:border-green-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full h-10 bg-green-700 hover:bg-green-800 text-white rounded font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Register New Log</span>
              </button>
            </form>
          </div>

          {/* Stock Health */}
          <div className="bg-white rounded-lg border border-stone-300 shadow-xs p-5 flex flex-col gap-2">
            <h4 className="text-lg font-bold text-stone-900">Stock Health</h4>
            <div className="flex justify-between items-center text-xs font-semibold pt-1">
              <span className="text-stone-700">Remaining Log</span>
              <span className="text-green-700 font-bold">
                {logCount > 0 ? '100%' : '0%'}
              </span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-700 rounded-full transition-all"
                style={{ width: logCount > 0 ? '100%' : '0%' }}
              />
            </div>
            <Link
              href="/stock-reports"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:underline pt-2"
            >
              <span>See Stock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Bottom Summary Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-orange-50/80 border border-stone-300 rounded-md flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-800/10 text-amber-800 flex items-center justify-center shrink-0">
            <FlameKindling className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-stone-600 uppercase tracking-tight">
              Active Kilns
            </span>
            <div className="text-base font-bold text-stone-900">
              0 <span className="text-stone-500 font-normal text-sm">/ 15</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-orange-50/80 border border-stone-300 rounded-md flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-700/10 text-green-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-stone-600 uppercase tracking-tight">
              Total Customers
            </span>
            <span className="text-base font-bold text-stone-900">
              {totalCustomers}
            </span>
          </div>
        </div>

        <div className="p-4 bg-orange-50/80 border border-stone-300 rounded-md flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-stone-500/10 text-stone-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-stone-600 uppercase tracking-tight">
              Total Sales
            </span>
            <span className="text-base font-bold text-stone-900">
              {totalSales}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}