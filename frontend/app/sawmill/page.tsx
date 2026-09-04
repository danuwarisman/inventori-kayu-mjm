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
  Inbox,
  Layers,
} from 'lucide-react';

export type AppRole = 'admin' | 'manager' | 'admin_kantor' | 'admin_lapangan';

export interface PlankItem {
  id_plank: string;
  sortimen: string;
  tinggi: number;  // Tebal (mm / cm)
  lebar: number;   // Lebar (mm / cm)
  panjang: number; // Panjang (mm / cm)
  volume: number;  // m3
  grade: 'Grade A' | 'Grade B' | 'Grade C';
}

export interface SawmillItem {
  id_sawmill: string;
  id_log_asal: string;
  sortimen: string;
  panjang: number;
  diameter: number;
  volume_total: number;
  stage: 'Sawmill' | 'finish Sawmill';
  tanggal: string;
  suplier: string;
  harga?: number;
  planks: PlankItem[];
}

interface DataSawmillPageProps {
  role?: AppRole;
}

export default function DataSawmillPage({ role = 'admin' }: DataSawmillPageProps) {
  // State data utama (bersih dari data dummy)
  const [sawmillItems, setSawmillItems] = useState<SawmillItem[]>([]);

  // State Filter
  const [dateFilter, setDateFilter] = useState('');
  const [sortimenFilter, setSortimenFilter] = useState('All Sortimen');

  // State Modal Form & Sub-modal
  const [modalType, setModalType] = useState<
    'input-sawmill' | 'edit-sawmill' | 'detail-hasil' | 'input-hasil' | 'edit-hasil' | null
  >(null);
  const [selectedSawmill, setSelectedSawmill] = useState<SawmillItem | null>(null);
  const [selectedPlankIndex, setSelectedPlankIndex] = useState<number | null>(null);

  // Form Batch Sawmill (Log Asal)
  const [formIdLog, setFormIdLog] = useState('');
  const [formSortimen, setFormSortimen] = useState('Sortimen A');
  const [formPanjang, setFormPanjang] = useState<number | ''>('');
  const [formDiameter, setFormDiameter] = useState<number | ''>('');
  const [formSuplier, setFormSuplier] = useState('PT. Suplier');

  // Form Hasil Plank
  const [formIdPlank, setFormIdPlank] = useState('');
  const [formGrade, setFormGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [formTinggiPlank, setFormTinggiPlank] = useState<number | ''>('');
  const [formLebarPlank, setFormLebarPlank] = useState<number | ''>('');
  const [formPanjangPlank, setFormPanjangPlank] = useState<number | ''>('');

  const isManager = role === 'manager';

  // Kalkulasi Volume Log: V = (pi/4) * (d^2) * L (m3)
  const calcLogVolume = (pCm: number, dCm: number): number => {
    if (!pCm || !dCm) return 0;
    const rM = dCm / 200;
    const lM = pCm / 100;
    return Number((Math.PI * Math.pow(rM, 2) * lM).toFixed(3));
  };

  // Kalkulasi Volume Plank: V = T(cm) * W(cm) * L(cm) / 1.000.000 (m3)
  const calcPlankVolume = (tCm: number, wCm: number, lCm: number): number => {
    if (!tCm || !wCm || !lCm) return 0;
    return Number(((tCm * wCm * lCm) / 1000000).toFixed(3));
  };

  // 1. Handler Buka Modal Sawmill
  const handleOpenInputSawmill = () => {
    setFormIdLog(`L-${new Date().getFullYear()}-${sawmillItems.length + 1}`);
    setFormSortimen('Sortimen A');
    setFormPanjang('');
    setFormDiameter('');
    setFormSuplier('PT. Suplier');
    setSelectedSawmill(null);
    setModalType('input-sawmill');
  };

  const handleOpenEditSawmill = (item: SawmillItem) => {
    setSelectedSawmill(item);
    setFormIdLog(item.id_log_asal);
    setFormSortimen(item.sortimen);
    setFormPanjang(item.panjang);
    setFormDiameter(item.diameter);
    setFormSuplier(item.suplier);
    setModalType('edit-sawmill');
  };

  const handleSubmitSawmill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIdLog || !formPanjang || !formDiameter) return;

    const p = Number(formPanjang);
    const d = Number(formDiameter);
    const vol = calcLogVolume(p, d);

    if (modalType === 'input-sawmill') {
      const newItem: SawmillItem = {
        id_sawmill: `SM-${new Date().getFullYear()}-${sawmillItems.length + 1}`,
        id_log_asal: formIdLog,
        sortimen: formSortimen,
        panjang: p,
        diameter: d,
        volume_total: vol,
        stage: 'Sawmill',
        tanggal: new Date().toLocaleDateString('id-ID'),
        suplier: formSuplier,
        harga: 1000000,
        planks: [],
      };
      setSawmillItems((prev) => [newItem, ...prev]);
    } else if (modalType === 'edit-sawmill' && selectedSawmill) {
      setSawmillItems((prev) =>
        prev.map((item) =>
          item.id_sawmill === selectedSawmill.id_sawmill
            ? {
                ...item,
                id_log_asal: formIdLog,
                sortimen: formSortimen,
                panjang: p,
                diameter: d,
                volume_total: vol,
                suplier: formSuplier,
              }
            : item
        )
      );
    }
    setModalType(null);
  };

  // 2. Handler Buka Modal Detail Hasil (Daftar Papan)
  const handleOpenDetail = (item: SawmillItem) => {
    setSelectedSawmill(item);
    setModalType('detail-hasil');
  };

  // 3. Handler Form Input/Edit Hasil Plank
  const handleOpenInputHasil = () => {
    if (!selectedSawmill) return;
    setFormIdPlank(`P-${new Date().getFullYear()}-${selectedSawmill.planks.length + 1}`);
    setFormGrade('Grade A');
    setFormTinggiPlank(5);
    setFormLebarPlank(20);
    setFormPanjangPlank(100);
    setSelectedPlankIndex(null);
    setModalType('input-hasil');
  };

  const handleOpenEditHasil = (plank: PlankItem, index: number) => {
    setFormIdPlank(plank.id_plank);
    setFormGrade(plank.grade);
    setFormTinggiPlank(plank.tinggi);
    setFormLebarPlank(plank.lebar);
    setFormPanjangPlank(plank.panjang);
    setSelectedPlankIndex(index);
    setModalType('edit-hasil');
  };

  const handleSubmitPlank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSawmill || !formIdPlank || !formTinggiPlank || !formLebarPlank || !formPanjangPlank) return;

    const t = Number(formTinggiPlank);
    const w = Number(formLebarPlank);
    const l = Number(formPanjangPlank);
    const vol = calcPlankVolume(t, w, l);

    const plankData: PlankItem = {
      id_plank: formIdPlank,
      sortimen: selectedSawmill.sortimen,
      tinggi: t,
      lebar: w,
      panjang: l,
      volume: vol,
      grade: formGrade,
    };

    let updatedPlanks: PlankItem[] = [];
    if (modalType === 'input-hasil') {
      updatedPlanks = [...selectedSawmill.planks, plankData];
    } else if (modalType === 'edit-hasil' && selectedPlankIndex !== null) {
      updatedPlanks = selectedSawmill.planks.map((p, idx) =>
        idx === selectedPlankIndex ? plankData : p
      );
    }

    const updatedItem: SawmillItem = {
      ...selectedSawmill,
      stage: updatedPlanks.length > 0 ? 'finish Sawmill' : 'Sawmill',
      planks: updatedPlanks,
    };

    setSawmillItems((prev) =>
      prev.map((item) =>
        item.id_sawmill === selectedSawmill.id_sawmill ? updatedItem : item
      )
    );
    setSelectedSawmill(updatedItem);
    setModalType('detail-hasil');
  };

  const filteredItems = sawmillItems.filter((item) => {
    const matchesSortimen =
      sortimenFilter === 'All Sortimen' || item.sortimen === sortimenFilter;
    const matchesDate = !dateFilter || item.tanggal === dateFilter;
    return matchesSortimen && matchesDate;
  });

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Filter Bar & Aksi */}
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
              onClick={handleOpenInputSawmill}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Batch</span>
            </button>
          )}
        </div>
      </section>

      {/* 2. Main Sawmill Table */}
      <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-2xs flex flex-col gap-3">
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

                {/* Kolom Khusus Manager */}
                {isManager && (
                  <>
                    <th className="py-3 px-3 text-center">Suplier</th>
                    <th className="py-3 px-3 text-center">Harga</th>
                  </>
                )}

                {/* Kolom Rincian Potongan */}
                <th className="py-3 px-3 text-center w-12">Detail</th>

                {/* Kolom Aksi Edit Khusus Admin */}
                {!isManager && (
                  <th className="py-3 px-3 text-center w-12">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={isManager ? 9 : 8}
                    className="py-14 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                      <Inbox className="w-8 h-8 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-stone-600">
                        Belum ada antrean pemotongan Sawmill
                      </p>
                      <p className="text-xs text-stone-400">
                        {isManager
                          ? 'Belum ada data pemrosesan gergaji yang dicatat oleh staf lapangan.'
                          : 'Gunakan tombol "+ New Batch" untuk meregistrasikan pemotongan kayu log baru.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id_sawmill}
                    className="text-green-700 hover:bg-stone-50 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-mono font-medium">
                      {item.id_log_asal}
                    </td>
                    <td className="py-3 px-3 text-center font-normal">
                      {item.sortimen}
                    </td>
                    <td className="py-3 px-3 text-center font-medium">
                      {item.diameter}mm x {item.panjang}mm
                    </td>
                    <td className="py-3 px-3 text-center font-medium">
                      {item.volume_total.toFixed(3)} m³
                    </td>
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
                    <td className="py-3 px-3 text-center font-normal text-stone-600">
                      {item.tanggal}
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

                    {/* Tombol Lihat Detail Papan Olahan */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(item)}
                        className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center cursor-pointer relative"
                        title="Lihat Rincian Papan Hasil Sawmill"
                      >
                        <Eye className="w-4 h-4" />
                        {item.planks.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-700 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                            {item.planks.length}
                          </span>
                        )}
                      </button>
                    </td>

                    {!isManager && (
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEditSawmill(item)}
                          className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                          title="Edit Log Asal"
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
            Showing {filteredItems.length} of {sawmillItems.length}
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

      {/* 3. Modal Layer */}

      {/* Modal A: Input & Edit Log Sawmill Asal */}
      {(modalType === 'input-sawmill' || modalType === 'edit-sawmill') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
              <h2 className="text-stone-800 text-xl font-bold font-sans">
                {modalType === 'input-sawmill' ? 'Input Sawmill' : 'Edit Sawmill'}
              </h2>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-1 text-stone-500 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitSawmill}
              className="p-4 bg-white/80 rounded-[10px] border border-stone-800/80 flex flex-col gap-3 text-xs"
            >
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">ID LOG ASAL</label>
                <input
                  type="text"
                  required
                  placeholder="L-2026-X-X-X"
                  value={formIdLog}
                  onChange={(e) => setFormIdLog(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
                />
              </div>

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

              <div className="flex flex-col gap-1">
                <span className="font-semibold text-green-700">Ukuran</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">Panjang (cm)</label>
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
                      className="w-full h-9 px-3 bg-white border border-stone-800 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">Diameter (cm)</label>
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
                      className="w-full h-9 px-3 bg-white border border-stone-800 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Suplier</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    placeholder="PT. Suplier"
                    value={formSuplier}
                    onChange={(e) => setFormSuplier(e.target.value)}
                    className="flex-1 h-10 px-3 bg-white border border-stone-800 rounded text-green-700 font-semibold focus:outline-none focus:border-green-700"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-2xs"
                  >
                    {modalType === 'input-sawmill' ? (
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

      {/* Modal B: Rincian Papan Hasil Potong (Detail Hasil Sawmill) */}
      {modalType === 'detail-hasil' && selectedSawmill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[640px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
              <h2 className="text-stone-800 text-xl font-bold font-sans">
                {isManager ? 'Detail Hasil Sawmill' : 'Edit Detail Hasil Sawmill'}
              </h2>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-1 text-stone-500 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white/80 rounded-[10px] border border-stone-800/80 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">ID LOG ASAL</label>
                <div className="w-full h-10 px-4 flex items-center bg-white border border-stone-900 rounded font-mono font-medium text-green-700">
                  {selectedSawmill.id_log_asal}
                </div>
              </div>

              {/* Sub-Table Plank */}
              <div className="overflow-x-auto border border-stone-200 rounded">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-2 text-center">ID PLANK</th>
                      <th className="py-2.5 px-2 text-center">Sortimen</th>
                      <th className="py-2.5 px-2 text-center">
                        DIMENSIONS (T X W X L)
                      </th>
                      <th className="py-2.5 px-2 text-center">Total Volume</th>
                      <th className="py-2.5 px-2 text-center">Grade</th>
                      {!isManager && (
                        <th className="py-2.5 px-2 text-center w-12">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedSawmill.planks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={isManager ? 5 : 6}
                          className="py-8 text-center text-stone-400"
                        >
                          <div className="flex flex-col items-center justify-center gap-1">
                            <Layers className="w-6 h-6 text-stone-300" />
                            <span>Belum ada papan olahan (plank) yang dicatat untuk log ini.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      selectedSawmill.planks.map((plank, pIdx) => (
                        <tr key={plank.id_plank} className="text-green-700">
                          <td className="py-2 px-2 text-center font-mono font-medium">
                            {plank.id_plank}
                          </td>
                          <td className="py-2 px-2 text-center">{plank.sortimen}</td>
                          <td className="py-2 px-2 text-center whitespace-nowrap">
                            {plank.tinggi}mm x {plank.lebar}mm x {plank.panjang}mm
                          </td>
                          <td className="py-2 px-2 text-center font-medium">
                            {plank.volume.toFixed(3)} m³
                          </td>
                          <td className="py-2 px-2 text-center font-semibold">
                            {plank.grade}
                          </td>
                          {!isManager && (
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleOpenEditHasil(plank, pIdx)}
                                className="p-1 hover:bg-green-100 rounded text-green-700 cursor-pointer"
                                title="Edit Plank"
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

              {!isManager && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleOpenInputHasil}
                    className="h-9 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Plank</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal C: Input & Edit Hasil Potong Papan (Plank) */}
      {(modalType === 'input-hasil' || modalType === 'edit-hasil') && selectedSawmill && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-2xl flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
              <h2 className="text-stone-800 text-xl font-bold font-sans">
                {modalType === 'input-hasil' ? 'Input Hasil Sawmill' : 'Edit Hasil Sawmill'}
              </h2>
              <button
                type="button"
                onClick={() => setModalType('detail-hasil')}
                className="p-1 text-stone-500 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitPlank}
              className="p-4 bg-white/80 rounded-[10px] border border-stone-800/80 flex flex-col gap-3 text-xs"
            >
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">ID LOG ASAL</label>
                <input
                  type="text"
                  disabled
                  value={selectedSawmill.id_log_asal}
                  className="w-full h-10 px-3 bg-stone-100 border border-stone-300 rounded font-mono text-green-800 font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">ID PLANK</label>
                <input
                  type="text"
                  required
                  placeholder="P-2026-X-X-X"
                  value={formIdPlank}
                  onChange={(e) => setFormIdPlank(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Grade</label>
                <div className="relative">
                  <select
                    value={formGrade}
                    onChange={(e) =>
                      setFormGrade(e.target.value as 'Grade A' | 'Grade B' | 'Grade C')
                    }
                    className="w-full h-10 pl-3 pr-8 bg-white border border-stone-300 rounded text-green-700 font-medium appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
                  >
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade C">Grade C</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-semibold text-green-700">Ukuran Potong</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-green-700">Panjang (cm)</label>
                    <input
                      type="number"
                      required
                      placeholder="100"
                      value={formPanjangPlank}
                      onChange={(e) =>
                        setFormPanjangPlank(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      className="w-full h-9 px-2 bg-white border border-stone-300 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-green-700">Lebar (cm)</label>
                    <input
                      type="number"
                      required
                      placeholder="20"
                      value={formLebarPlank}
                      onChange={(e) =>
                        setFormLebarPlank(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      className="w-full h-9 px-2 bg-white border border-stone-300 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-green-700">Tinggi/Tebal (cm)</label>
                    <input
                      type="number"
                      required
                      placeholder="5"
                      value={formTinggiPlank}
                      onChange={(e) =>
                        setFormTinggiPlank(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      className="w-full h-9 px-2 bg-white border border-stone-300 rounded text-green-700 focus:outline-none focus:border-green-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="h-9 px-5 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}