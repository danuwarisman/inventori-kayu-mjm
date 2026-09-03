'use client';

import React, { useState } from 'react';
import {
  FileDown,
  Plus,
  Pencil,
  Eye,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';

export type UserRole = 'admin' | 'manager';

interface SawmillItem {
  id: string;
  sortimen: string;
  dimensions: string;
  volume: number;
  stage: 'Sawmill' | 'finish Sawmill';
  date: string;
  suplier: string;
  harga: number;
}

interface PlankDetail {
  id: string;
  sortimen: string;
  dimensions: string;
  volume: number;
  grade: string;
}

const mockSawmillLogs: SawmillItem[] = Array.from({ length: 6 }).map((_, idx) => ({
  id: `L-2026-3-A-${idx + 1}`,
  sortimen: 'Sortimen A',
  dimensions: '50mm x 200mm',
  volume: 12.45,
  stage: idx % 2 === 0 ? 'finish Sawmill' : 'Sawmill',
  date: '23/05/2026',
  suplier: 'PT. Suplier',
  harga: 1000000,
}));

const mockPlankResults: PlankDetail[] = [
  { id: 'P-2026-3-A-1', sortimen: 'Sortimen A', dimensions: '50mm x 200mm x 2400mm', volume: 12.45, grade: 'Grade A' },
  { id: 'P-2026-3-A-2', sortimen: 'Sortimen A', dimensions: '50mm x 200mm x 2400mm', volume: 12.45, grade: 'Grade A' },
  { id: 'P-2026-3-A-3', sortimen: 'Sortimen A', dimensions: '50mm x 200mm x 2400mm', volume: 12.45, grade: 'Grade A' },
];

export default function DataSawmillPage({ role = 'admin' }: { role?: UserRole }) {
  const [dateFilter, setDateFilter] = useState('');
  const [sortimenFilter, setSortimenFilter] = useState('All Sortimen');

  // Modal State Management
  const [modalType, setModalType] = useState<'input-log' | 'edit-log' | 'input-hasil' | 'detail-hasil' | null>(null);
  const [selectedLog, setSelectedLog] = useState<SawmillItem | null>(null);

  // Form States
  const [idLogAsal, setIdLogAsal] = useState('L-2026-3-A-1');
  const [idPlank, setIdPlank] = useState('P-2026-3-A-1');
  const [grade, setGrade] = useState('Grade A');
  const [panjang, setPanjang] = useState(100);
  const [lebar, setLebar] = useState(20);
  const [tinggi, setTinggi] = useState(5);
  const [suplier, setSuplier] = useState('PT. Suplier');

  const openDetailModal = (item: SawmillItem) => {
    setSelectedLog(item);
    setIdLogAsal(item.id);
    setModalType('detail-hasil');
  };

  const openEditModal = (item: SawmillItem) => {
    setSelectedLog(item);
    setIdLogAsal(item.id);
    setModalType('edit-log');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalType(null);
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
              onClick={() => setModalType('input-log')}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Batch</span>
            </button>
          )}
        </div>
      </section>

      {/* 2. Main Sawmill Table */}
      <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-xs flex flex-col gap-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 text-center">ID LOG</th>
                <th className="py-3 px-3 text-center">Sortimen</th>
                <th className="py-3 px-3 text-center">DIMENSIONS (T X W)</th>
                <th className="py-3 px-3 text-center">Total Volume</th>
                <th className="py-3 px-3 text-center">Stage</th>
                <th className="py-3 px-3 text-center">Date</th>

                {/* Manager-only Columns */}
                {role === 'manager' && (
                  <>
                    <th className="py-3 px-3 text-center">Suplier</th>
                    <th className="py-3 px-3 text-center">Harga</th>
                  </>
                )}

                {/* Admin & Inspection Columns */}
                <th className="py-3 px-3 text-center w-12">Detail</th>
                {role === 'admin' && <th className="py-3 px-3 text-center w-12">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {mockSawmillLogs.map((item, idx) => (
                <tr key={idx} className="text-green-700 hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3 text-center font-mono font-medium">{item.id}</td>
                  <td className="py-3 px-3 text-center font-normal">{item.sortimen}</td>
                  <td className="py-3 px-3 text-center font-medium">{item.dimensions}</td>
                  <td className="py-3 px-3 text-center font-medium">{item.volume.toFixed(3)} m³</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.stage === 'finish Sawmill'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-lime-100 text-green-800'
                      }`}
                    >
                      {item.stage}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-normal text-stone-600">{item.date}</td>

                  {role === 'manager' && (
                    <>
                      <td className="py-3 px-3 text-center font-medium text-stone-800">{item.suplier}</td>
                      <td className="py-3 px-3 text-center font-semibold text-stone-900">
                        {item.harga.toLocaleString('id-ID')}
                      </td>
                    </>
                  )}

                  {/* Detail Plank Trigger */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => openDetailModal(item)}
                      className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center"
                      title="Lihat Detail Papan"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Edit Log Trigger (Admin Only) */}
                  {role === 'admin' && (
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center"
                        title="Edit Data Sawmill"
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

        {/* Pagination Bar */}
        <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="text-green-700/80 font-medium">Showing 6 of 1024</span>
          <div className="flex items-center gap-1.5">
            <button type="button" className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50">
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
            <button type="button" className="p-1 rounded border border-green-700 text-green-700 hover:bg-green-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Modal Layer */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[620px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
            {/* Modal Title Bar */}
            <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
              <h2 className="text-stone-800 text-xl font-bold font-sans">
                {modalType === 'input-log' && 'Input Sawmill'}
                {modalType === 'edit-log' && 'Edit Sawmill'}
                {modalType === 'input-hasil' && 'Input Hasil Sawmill'}
                {modalType === 'detail-hasil' &&
                  (role === 'admin' ? 'Edit Detail Hasil Sawmill' : 'Detail Hasil Sawmill')}
              </h2>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-1 text-stone-500 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content: DETAIL HASIL SAWMILL (Tabel Sub-Komponen Plank) */}
            {modalType === 'detail-hasil' && (
              <div className="p-3.5 bg-white/80 rounded-[10px] border border-stone-400 flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-green-700">ID LOG ASAL</label>
                  <div className="w-full px-4 py-2 bg-white border border-stone-900 rounded font-mono font-medium text-green-700">
                    {idLogAsal}
                  </div>
                </div>

                <div className="overflow-x-auto border border-stone-200 rounded">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-green-700 text-green-700 font-bold uppercase">
                        <th className="py-2.5 px-2 text-center">ID PLANK</th>
                        <th className="py-2.5 px-2 text-center">Sortimen</th>
                        <th className="py-2.5 px-2 text-center">Dimensions (T x W x L)</th>
                        <th className="py-2.5 px-2 text-center">Volume</th>
                        <th className="py-2.5 px-2 text-center">Grade</th>
                        {role === 'admin' && <th className="py-2.5 px-2 text-center">Action</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {mockPlankResults.map((p, i) => (
                        <tr key={i} className="text-green-700">
                          <td className="py-2.5 px-2 text-center font-mono">{p.id}</td>
                          <td className="py-2.5 px-2 text-center">{p.sortimen}</td>
                          <td className="py-2.5 px-2 text-center whitespace-nowrap">{p.dimensions}</td>
                          <td className="py-2.5 px-2 text-center">{p.volume.toFixed(3)} m³</td>
                          <td className="py-2.5 px-2 text-center font-semibold">{p.grade}</td>
                          {role === 'admin' && (
                            <td className="py-2.5 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setIdPlank(p.id);
                                  setModalType('input-hasil');
                                }}
                                className="p-1 hover:bg-green-100 rounded text-green-700"
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

                {role === 'admin' && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalType('input-hasil')}
                      className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Plank</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Modal Content: INPUT / EDIT SAWMILL (Batang Log Mentah) */}
            {(modalType === 'input-log' || modalType === 'edit-log') && (
              <form
                onSubmit={handleSubmit}
                className="p-3.5 bg-white/80 rounded-[10px] border border-stone-400 flex flex-col gap-3 text-xs"
              >
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-green-700">ID LOG ASAL</label>
                  <select
                    value={idLogAsal}
                    onChange={(e) => setIdLogAsal(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-stone-400 rounded text-green-700 font-mono font-medium focus:outline-none focus:border-green-700"
                  >
                    <option value="L-2026-3-A-1">L-2026-3-A-1</option>
                    <option value="L-2026-3-A-2">L-2026-3-A-2</option>
                    <option value="L-2026-3-A-3">L-2026-3-A-3</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-green-700">Sortimen</label>
                  <input
                    type="text"
                    defaultValue="Sortimen A"
                    className="w-full h-9 px-3 bg-white border border-stone-400 rounded text-green-700 focus:outline-none focus:border-green-700"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-green-700">Ukuran</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[11px] text-green-700">Panjang (cm)</label>
                      <input
                        type="number"
                        value={panjang}
                        onChange={(e) => setPanjang(Number(e.target.value))}
                        className="w-full h-9 px-3 bg-white border border-stone-400 rounded text-green-700 focus:outline-none focus:border-green-700"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[11px] text-green-700">Diameter (cm)</label>
                      <input
                        type="number"
                        value={lebar}
                        onChange={(e) => setLebar(Number(e.target.value))}
                        className="w-full h-9 px-3 bg-white border border-stone-400 rounded text-green-700 focus:outline-none focus:border-green-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-green-700">Suplier</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={suplier}
                      onChange={(e) => setSuplier(e.target.value)}
                      className="flex-1 h-9 px-3 bg-white border border-stone-400 rounded text-green-700 font-semibold focus:outline-none focus:border-green-700"
                    />
                    <button
                      type="submit"
                      className="h-9 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{modalType === 'input-log' ? 'New Batch' : 'Save Batch'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Modal Content: INPUT HASIL SAWMILL (Hasil Olahan Papan Plank) */}
            {modalType === 'input-hasil' && (
              <form
                onSubmit={handleSubmit}
                className="p-3.5 bg-white/80 rounded-[10px] border border-stone-400 flex flex-col gap-3 text-xs"
              >
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-green-700">ID LOG ASAL</label>
                  <input
                    type="text"
                    disabled
                    value={idLogAsal}
                    className="w-full h-9 px-3 bg-stone-100 border border-stone-300 rounded font-mono text-green-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-green-700">ID PLANK</label>
                  <input
                    type="text"
                    required
                    value={idPlank}
                    onChange={(e) => setIdPlank(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-stone-400 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-green-700">Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-stone-400 rounded text-green-700 font-medium focus:outline-none focus:border-green-700"
                  >
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade C">Grade C</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-green-700">Ukuran Potong</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-green-700">Panjang (cm)</label>
                      <input
                        type="number"
                        value={panjang}
                        onChange={(e) => setPanjang(Number(e.target.value))}
                        className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-green-700"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-green-700">Lebar (cm)</label>
                      <input
                        type="number"
                        value={lebar}
                        onChange={(e) => setLebar(Number(e.target.value))}
                        className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-green-700"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-green-700">Tinggi (cm)</label>
                      <input
                        type="number"
                        value={tinggi}
                        onChange={(e) => setTinggi(Number(e.target.value))}
                        className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-green-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="h-9 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Plank</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}