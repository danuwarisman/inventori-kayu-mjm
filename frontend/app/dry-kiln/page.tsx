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
  Flame,
} from 'lucide-react';

export type UserRole = 'admin' | 'manager';

interface DryKilnItem {
  idLog: string;
  idPlank: string;
  sortimen: string;
  dimensions: string;
  volume: number;
  stage: 'pra-drykiln' | 'in-drykiln' | 'finish dry-kiln';
  date: string;
  grade: string;
}

const mockDryKilnData: DryKilnItem[] = Array.from({ length: 5 }).map((_, idx) => ({
  idLog: `L-2026-3-A-${idx + 1}`,
  idPlank: `P-2026-3-A-${idx + 1}`,
  sortimen: 'Sortimen A',
  dimensions: '50mm x 200mm x 2400mm',
  volume: 12.45,
  stage: idx === 0 ? 'in-drykiln' : 'pra-drykiln',
  date: '23/05/2026',
  grade: 'Grade A',
}));

export default function DryKilnPage({ role = 'admin' }: { role?: UserRole }) {
  const [dateFilter, setDateFilter] = useState('');
  const [sortimenFilter, setSortimenFilter] = useState('All Sortimen');

  // Modal State
  const [modalMode, setModalMode] = useState<'input' | 'edit' | null>(null);
  const [selectedPlank, setSelectedPlank] = useState<DryKilnItem | null>(null);

  // Form Fields
  const [idPlank, setIdPlank] = useState('P-2026-3-A-1');
  const [grade, setGrade] = useState('Grade A');
  const [panjang, setPanjang] = useState<number | ''>(240);
  const [lebar, setLebar] = useState<number | ''>(20);
  const [tinggi, setTinggi] = useState<number | ''>(5);
  const [status, setStatus] = useState('Finish');

  const handleOpenCreate = () => {
    setModalMode('input');
    setIdPlank('P-2026-3-A-1');
    setGrade('Grade A');
    setPanjang(240);
    setLebar(20);
    setTinggi(5);
    setStatus('Finish');
  };

  const handleOpenEdit = (item: DryKilnItem) => {
    setModalMode('edit');
    setSelectedPlank(item);
    setIdPlank(item.idPlank);
    setGrade(item.grade);
    setPanjang(240);
    setLebar(20);
    setTinggi(5);
    setStatus('Finish');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalMode(null);
  };

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Filter Bar & Actions */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Filter by Date:
            </span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-green-700"
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
                className="appearance-none pr-8 pl-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-green-700 cursor-pointer"
              >
                <option value="All Sortimen">All Sortimen</option>
                <option value="Sortimen A">Sortimen A</option>
                <option value="Sortimen B">Sortimen B</option>
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

          {role === 'admin' && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Batch</span>
            </button>
          )}
        </div>
      </section>

      {/* 2. Main Dry-Kiln Table */}
      <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-xs flex flex-col gap-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 text-center">ID LOG</th>
                <th className="py-3 px-3 text-center">ID PLANK</th>
                <th className="py-3 px-3 text-center">Sortimen</th>
                <th className="py-3 px-3 text-center">DIMENSIONS (T X W X L)</th>
                <th className="py-3 px-3 text-center">Total Volume</th>
                <th className="py-3 px-3 text-center">Stage</th>
                <th className="py-3 px-3 text-center">Date</th>
                {role === 'admin' && <th className="py-3 px-3 text-center w-12">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {mockDryKilnData.map((item, idx) => (
                <tr
                  key={idx}
                  className="text-green-700 hover:bg-stone-50/80 transition-colors"
                >
                  <td className="py-3 px-3 text-center font-mono font-medium">{item.idLog}</td>
                  <td className="py-3 px-3 text-center font-mono font-normal text-stone-600">{item.idPlank}</td>
                  <td className="py-3 px-3 text-center font-normal">{item.sortimen}</td>
                  <td className="py-3 px-3 text-center font-medium whitespace-nowrap">{item.dimensions}</td>
                  <td className="py-3 px-3 text-center font-medium">{item.volume.toFixed(3)} m³</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.stage === 'in-drykiln'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-lime-100 text-green-800'
                      }`}
                    >
                      {item.stage}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-normal text-stone-600">{item.date}</td>

                  {role === 'admin' && (
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center"
                        title="Edit Data Dry Kiln"
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

        {/* Pagination Controls */}
        <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="text-green-700/80 font-medium">Showing 5 of 1024</span>
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

      {/* 3. Modal Form (Input & Edit Hasil Dry Kiln) */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
              <h2 className="text-stone-800 text-xl font-bold font-sans">
                {modalMode === 'input' ? 'Input Hasil Dry Kiln' : 'Edit Hasil Dry Kiln'}
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
              className="p-3.5 bg-white/80 rounded-[10px] border border-stone-800/80 flex flex-col gap-3 text-xs"
            >
              {/* ID Plank */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">ID PLANK</label>
                {modalMode === 'input' ? (
                  <div className="relative">
                    <select
                      value={idPlank}
                      onChange={(e) => setIdPlank(e.target.value)}
                      className="w-full h-9 px-3 appearance-none bg-white border border-stone-300 rounded font-mono text-green-700 focus:outline-none focus:border-green-700 cursor-pointer"
                    >
                      <option value="P-2026-3-A-1">P-2026-3-A-1</option>
                      <option value="P-2026-3-A-2">P-2026-3-A-2</option>
                      <option value="P-2026-3-A-3">P-2026-3-A-3</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={idPlank}
                    onChange={(e) => setIdPlank(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
                  />
                )}
              </div>

              {/* Grade */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Grade</label>
                <div className="relative">
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full h-9 px-3 appearance-none bg-white border border-stone-800 rounded text-green-700 font-medium focus:outline-none focus:border-green-700 cursor-pointer"
                  >
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade C">Grade C</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Ukuran (Panjang, Lebar, Tinggi) */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-green-700">Ukuran</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">Panjang (cm)</label>
                    <input
                      type="number"
                      required
                      placeholder="240"
                      value={panjang}
                      onChange={(e) => setPanjang(Number(e.target.value))}
                      className="w-full h-9 px-3 bg-white border border-stone-800 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">Lebar (cm)</label>
                    <input
                      type="number"
                      required
                      placeholder="20"
                      value={lebar}
                      onChange={(e) => setLebar(Number(e.target.value))}
                      className="w-full h-9 px-3 bg-white border border-stone-800 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">Tinggi (cm)</label>
                    <input
                      type="number"
                      required
                      placeholder="5"
                      value={tinggi}
                      onChange={(e) => setTinggi(Number(e.target.value))}
                      className="w-full h-9 px-3 bg-white border border-stone-800 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Submit */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Status</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-9 px-3 appearance-none bg-white border border-stone-300 rounded font-semibold text-green-700 focus:outline-none focus:border-green-700 cursor-pointer"
                    >
                      <option value="Finish">Finish</option>
                      <option value="In Kiln">In Kiln</option>
                      <option value="Cooling">Cooling</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>

                  <button
                    type="submit"
                    className="h-9 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-xs"
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