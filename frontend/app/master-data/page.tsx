'use client';

import React, { useState } from 'react';
import {
  FileDown,
  Plus,
  Pencil,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Inbox,
  Factory,
  Flame,
  PackageCheck,
} from 'lucide-react';

export type AppRole = 'admin' | 'manager' | 'admin_kantor' | 'admin_lapangan';

export interface LogItem {
  id_log: string;
  sortimen: string;
  panjang: number;
  diameter: number;
  volume: number;
  stage: 'Log' | 'Sawmill' | 'Pra Dry Kiln' | 'Dry Kiln' | 'Ready To Sale';
  tanggal_masuk: string;
  suplier: string;
  harga?: number;
}

interface DataLogPageProps {
  role?: AppRole;
}

export default function DataLogPage({ role = 'admin' }: DataLogPageProps) {
  // State data utama (bersih dari data dummy)
  const [logs, setLogs] = useState<LogItem[]>([]);

  // State Filter & Pencarian
  const [dateFilter, setDateFilter] = useState('');
  const [sortimenFilter, setSortimenFilter] = useState('All Sortimen');

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'input' | 'edit'>('input');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  // Form State
  const [formIdLog, setFormIdLog] = useState('');
  const [formSortimen, setFormSortimen] = useState('Sortimen A');
  const [formPanjang, setFormPanjang] = useState<number | ''>('');
  const [formDiameter, setFormDiameter] = useState<number | ''>('');
  const [formSuplier, setFormSuplier] = useState('PT. Suplier');

  const isManager = role === 'manager';

  // Hitung volume otomatis: V = (pi/4) * (d^2) * L atau rumus kubikasi standar
  const calculateVolume = (panjangCm: number, diameterCm: number): number => {
    if (!panjangCm || !diameterCm) return 0;
    const rM = diameterCm / 200;
    const lM = panjangCm / 100;
    return Number((Math.PI * Math.pow(rM, 2) * lM).toFixed(3));
  };

  const handleOpenInput = () => {
    setModalMode('input');
    setSelectedLogId(null);
    setFormIdLog(`L-${new Date().getFullYear()}-${logs.length + 1}`);
    setFormSortimen('Sortimen A');
    setFormPanjang('');
    setFormDiameter('');
    setFormSuplier('PT. Suplier');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: LogItem) => {
    setModalMode('edit');
    setSelectedLogId(item.id_log);
    setFormIdLog(item.id_log);
    setFormSortimen(item.sortimen);
    setFormPanjang(item.panjang);
    setFormDiameter(item.diameter);
    setFormSuplier(item.suplier);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIdLog || !formPanjang || !formDiameter) return;

    const p = Number(formPanjang);
    const d = Number(formDiameter);
    const calculatedVol = calculateVolume(p, d);

    if (modalMode === 'input') {
      const newLog: LogItem = {
        id_log: formIdLog,
        sortimen: formSortimen,
        panjang: p,
        diameter: d,
        volume: calculatedVol,
        stage: 'Log',
        tanggal_masuk: new Date().toLocaleDateString('id-ID'),
        suplier: formSuplier,
        harga: 1000000,
      };
      setLogs((prev) => [newLog, ...prev]);
    } else if (modalMode === 'edit' && selectedLogId) {
      setLogs((prev) =>
        prev.map((item) =>
          item.id_log === selectedLogId
            ? {
                ...item,
                id_log: formIdLog,
                sortimen: formSortimen,
                panjang: p,
                diameter: d,
                volume: calculatedVol,
                suplier: formSuplier,
              }
            : item
        )
      );
    }

    setIsModalOpen(false);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSortimen =
      sortimenFilter === 'All Sortimen' || log.sortimen === sortimenFilter;
    const matchesDate = !dateFilter || log.tanggal_masuk === dateFilter;
    return matchesSortimen && matchesDate;
  });

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Filter Header Bar */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Filter by Date:
            </span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Log Sortimen
            </span>
            <div className="relative">
              <select
                value={sortimenFilter}
                onChange={(e) => setSortimenFilter(e.target.value)}
                className="appearance-none pr-8 pl-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700 cursor-pointer"
              >
                <option value="All Sortimen">All Sortimen</option>
                <option value="Sortimen A">Sortimen A</option>
                <option value="Sortimen B">Sortimen B</option>
                <option value="Sortimen C">Sortimen C</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="px-4 py-2 bg-red-50 hover:bg-red-100/70 border border-stone-300 rounded text-xs font-semibold text-green-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-green-700" />
            <span>Export PDF</span>
          </button>

          {!isManager && (
            <button
              type="button"
              onClick={handleOpenInput}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Batch</span>
            </button>
          )}
        </div>
      </section>

      {/* 2. Main Data Table */}
      <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-2xs flex flex-col gap-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 text-center">ID LOG</th>
                <th className="py-3 px-3 text-center">Sortimen</th>
                <th className="py-3 px-3 text-center">DIMENSIONS (P X D)</th>
                <th className="py-3 px-3 text-center">Total Volume</th>
                <th className="py-3 px-3 text-center">Stage</th>
                <th className="py-3 px-3 text-center">Date</th>

                {/* Kolom Khusus Manager (Harga & Suplier) */}
                {isManager && (
                  <>
                    <th className="py-3 px-3 text-center">Suplier</th>
                    <th className="py-3 px-3 text-center">Harga</th>
                  </>
                )}

                {/* Kolom Aksi Khusus Admin */}
                {!isManager && (
                  <th className="py-3 px-3 text-center w-12">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={isManager ? 8 : 7}
                    className="py-14 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                      <Inbox className="w-8 h-8 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-stone-600">
                        Belum ada data kayu log
                      </p>
                      <p className="text-xs text-stone-400">
                        {isManager
                          ? 'Belum ada data stok kayu log yang dimasukkan oleh staf lapangan.'
                          : 'Gunakan tombol "+ New Batch" untuk meregistrasikan kayu gelondongan pertama.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item) => (
                  <tr
                    key={item.id_log}
                    className="text-green-700 hover:bg-stone-50 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-mono font-medium">
                      {item.id_log}
                    </td>
                    <td className="py-3 px-3 text-center font-normal">
                      {item.sortimen}
                    </td>
                    <td className="py-3 px-3 text-center font-medium">
                      {item.panjang}cm x {item.diameter}cm
                    </td>
                    <td className="py-3 px-3 text-center font-medium">
                      {item.volume.toFixed(3)} m³
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-lime-100 text-green-800">
                        {item.stage}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-normal text-stone-600">
                      {item.tanggal_masuk}
                    </td>

                    {isManager && (
                      <>
                        <td className="py-3 px-3 text-center font-medium text-stone-800">
                          {item.suplier}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-stone-900">
                          Rp {(item.harga || 0).toLocaleString('id-ID')}
                        </td>
                      </>
                    )}

                    {!isManager && (
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                          title="Edit Log"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="text-green-700/80 font-medium">
            Showing {filteredLogs.length} of {logs.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded text-green-700 font-extrabold bg-green-100/80"
            >
              1
            </button>
            <button
              type="button"
              className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Bottom Capacity Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { title: 'Sawmill', icon: Factory, ratio: '0/15', pct: 0 },
          { title: 'Pra Dry-Kiln', icon: Flame, ratio: '0/15', pct: 0 },
          { title: 'Dry-KLIN Process', icon: Flame, ratio: '0/15', pct: 0 },
          { title: 'Ready To Sale', icon: PackageCheck, ratio: '0/15', pct: 0 },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-3 bg-white rounded border border-stone-200 shadow-2xs flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-green-700">
                  {stat.title}
                </span>
                <Icon className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-green-700">
                <span>{stat.ratio}</span>
                <span>{stat.pct}%</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full border border-green-700 overflow-hidden">
                <div
                  className="h-full bg-green-700 rounded-full transition-all"
                  style={{ width: `${stat.pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. Modal: Input Log & Edit Log */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
              <h2 className="text-stone-800 text-xl font-bold font-sans">
                {modalMode === 'input' ? 'Input Log' : 'Edit Log'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="p-4 bg-white/80 rounded-[10px] border border-stone-800/80 flex flex-col gap-3 text-xs"
            >
              {/* ID LOG */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">ID LOG</label>
                <input
                  type="text"
                  required
                  placeholder="L-2026-X-X-X"
                  value={formIdLog}
                  onChange={(e) => setFormIdLog(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
                />
              </div>

              {/* Sortimen */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Sortimen</label>
                <div className="relative">
                  <select
                    value={formSortimen}
                    onChange={(e) => setFormSortimen(e.target.value)}
                    className="w-full h-10 pl-3 pr-8 bg-white border border-stone-300 rounded text-green-700 font-medium appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
                  >
                    <option value="Sortimen A">Sortimen A</option>
                    <option value="Sortimen B">Sortimen B</option>
                    <option value="Sortimen C">Sortimen C</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Ukuran (Panjang & Diameter) */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-green-700">Ukuran</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">
                      Panjang (cm)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="100"
                      value={formPanjang}
                      onChange={(e) =>
                        setFormPanjang(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">
                      Diameter (cm)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="20"
                      value={formDiameter}
                      onChange={(e) =>
                        setFormDiameter(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                </div>
              </div>

              {/* Suplier & Aksi Submit */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Suplier</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    placeholder="PT. Suplier"
                    value={formSuplier}
                    onChange={(e) => setFormSuplier(e.target.value)}
                    className="flex-1 h-10 px-3 bg-white border border-stone-300 rounded text-green-700 font-semibold focus:outline-none focus:border-green-700"
                  />

                  <button
                    type="submit"
                    className="h-10 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-2xs"
                  >
                    {modalMode === 'input' ? (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Batch</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Batch</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}