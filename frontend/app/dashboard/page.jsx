'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Flame,
  ArrowRight,
  PlusCircle,
  Users,
  FlameKindling,
  DollarSign,
  Package,
} from 'lucide-react';

const mockActivities = [
  { id: 'L-2026-3-A-1', sortimen: 'Sortimen A', grade: 'Grade B', stage: 'Sawmill', time: '12:00' },
  { id: 'L-2026-3-A-2', sortimen: 'Sortimen A', grade: 'Grade B', stage: 'Sawmill', time: '12:15' },
  { id: 'L-2026-3-A-3', sortimen: 'Sortimen A', grade: 'Grade B', stage: 'Sawmill', time: '12:30' },
  { id: 'L-2026-3-A-4', sortimen: 'Sortimen A', grade: 'Grade B', stage: 'Sawmill', time: '12:45' },
  { id: 'L-2026-3-A-5', sortimen: 'Sortimen A', grade: 'Grade B', stage: 'Sawmill', time: '13:00' },
  { id: 'L-2026-3-A-6', sortimen: 'Sortimen A', grade: 'Grade B', stage: 'Sawmill', time: '13:15' },
];

export default function DashboardOperationalPage() {
  const [logDiameter, setLogDiameter] = useState('');
  const [panjang, setPanjang] = useState('');
  const [sortimen, setSortimen] = useState('Sortimen A');
  const [suplier, setSuplier] = useState('PT. Suplier');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika simpan batch log kayu baru
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* 1. Top Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Log Ready */}
        <div className="p-4 bg-white rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-green-700">Ready to Sale (LOG)</span>
            <Package className="w-5 h-5 text-green-700" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-stone-900 tracking-tight">2,400 pcs</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12%</span>
            </div>
            <button className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-stone-100 rounded text-xs font-medium transition-colors">
              Detail
            </button>
          </div>
        </div>

        {/* Card 2: Plank Ready */}
        <div className="p-4 bg-white rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-green-700">Ready to Sale (Plank)</span>
            <Package className="w-5 h-5 text-green-700" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-stone-900 tracking-tight">2,400 pcs</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
              <TrendingUp className="w-3.5 h-3.5 rotate-180" />
              <span>-12%</span>
            </div>
            <button className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-stone-100 rounded text-xs font-medium transition-colors">
              Detail
            </button>
          </div>
        </div>

        {/* Card 3: Dry Kiln */}
        <div className="p-4 bg-white rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-green-700">Dry-Kiln Process</span>
            <Flame className="w-5 h-5 text-green-700" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-stone-900 tracking-tight">2,400 pcs</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12%</span>
            </div>
            <button className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-stone-100 rounded text-xs font-medium transition-colors">
              Detail
            </button>
          </div>
        </div>
      </section>

      {/* 2. Middle Grid: Recent Activity & Quick Entry */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Activity Table (Left 2 Col) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-stone-200 shadow-xs p-5 flex flex-col gap-4">
          <h2 className="text-base font-bold text-green-700 font-sans">Recent Activity</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-green-700 text-green-800 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3 text-center">ID BATCH</th>
                  <th className="py-2.5 px-3 text-center">Sortimen</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Stage</th>
                  <th className="py-2.5 px-3 text-center">Time Stamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {mockActivities.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`text-stone-700 ${idx % 2 === 1 ? 'bg-lime-600/5' : 'bg-white'}`}
                  >
                    <td className="py-3 px-3 text-center font-mono text-green-800">{row.id}</td>
                    <td className="py-3 px-3 text-center">{row.sortimen}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 border border-green-700 text-green-800 rounded-xs text-[11px]">
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-green-700">{row.stage}</td>
                    <td className="py-3 px-3 text-center text-stone-500">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Entry & Stock Health Panel (Right 1 Col) */}
        <div className="flex flex-col gap-4">
          {/* Quick Entry Form */}
          <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 flex flex-col gap-4">
            <h3 className="text-base font-bold text-stone-900">Quick Entry</h3>

            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-stone-700">Log Diameter (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={logDiameter}
                  onChange={(e) => setLogDiameter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:border-green-700 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-stone-700 uppercase">Panjang</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={panjang}
                  onChange={(e) => setPanjang(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:border-green-700 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-stone-700">Sortimen</label>
                <select
                  value={sortimen}
                  onChange={(e) => setSortimen(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded bg-white focus:border-green-700 focus:outline-none text-stone-800"
                >
                  <option value="Sortimen A">Sortimen A</option>
                  <option value="Sortimen B">Sortimen B</option>
                  <option value="Sortimen C">Sortimen C</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-stone-700">Suplier</label>
                <select
                  value={suplier}
                  onChange={(e) => setSuplier(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded bg-white focus:border-green-700 focus:outline-none text-stone-800"
                >
                  <option value="PT. Suplier">PT. Suplier</option>
                  <option value="CV. Rimba Mandiri">CV. Rimba Mandiri</option>
                  <option value="UD. Jati Unggul">UD. Jati Unggul</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 text-white rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Register New Log</span>
              </button>
            </form>
          </div>

          {/* Stock Health */}
          <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 flex flex-col gap-2.5">
            <h4 className="text-sm font-bold text-stone-900">Stock Health</h4>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-stone-700">Remaining Log</span>
              <span className="text-green-700 text-sm font-bold">78%</span>
            </div>
            <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-700 rounded-full" style={{ width: '78%' }} />
            </div>
            <a
              href="/stock-reports"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:underline pt-1"
            >
              <span>See Stock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 3. Bottom Summary Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-orange-50/80 border border-stone-300 rounded-md flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-700/10 text-amber-800 flex items-center justify-center shrink-0">
            <FlameKindling className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-stone-600 uppercase tracking-tight">
              Active Kilns
            </span>
            <div className="text-base font-bold text-stone-900">
              12 <span className="text-stone-500 font-normal text-sm">/ 15</span>
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
            <span className="text-base font-bold text-stone-900">142</span>
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
            <span className="text-base font-bold text-stone-900">2,840</span>
          </div>
        </div>
      </section>
    </div>
  );
}