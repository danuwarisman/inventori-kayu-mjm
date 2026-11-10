'use client';

import React, { useState, useEffect } from 'react';
import {
  FileDown,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  Check,
  Inbox,
  Factory,
  Flame,
  PackageCheck,
} from 'lucide-react';
import { toISODate, formatDateID } from '@/lib/dates';
import useSessionUser from '@/lib/useSessionUser';
import { can } from '@/lib/permissions';
import { getApiErrorMessage, logApi, sawmillApi, supplierApi } from '@/lib/api';
import { exportToPdf } from '@/lib/export';
import { LogItem } from '@/types/log';
import FormError from '@/components/FormError';
import ErrorBanner from '@/components/ErrorBanner';
import Pagination from '@/components/Pagination';
import {
  firstError,
  maxLength,
  positiveNumber,
  required,
} from '@/lib/validation';

export { type LogItem };

const PAGE_SIZE = 10;

export default function DataLogPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);

  // State Filter & Pencarian
  const [dateFilter, setDateFilter] = useState('');
  const [sortimenFilter, setSortimenFilter] = useState('All Sortimen');
  const [page, setPage] = useState(1);
  const [pageError, setPageError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [processingLogId, setProcessingLogId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    logApi
      .list({ sortimen: sortimenFilter })
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setLogs(data);
          setPageError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setPageError(
            getApiErrorMessage(
              err,
              'Gagal memuat data log dari server. Periksa koneksi backend.'
            )
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sortimenFilter, refreshKey]);

  const handleRetryLoad = () => {
    setRefreshKey((key) => key + 1);
  };

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'input' | 'edit'>('input');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  // Daftar Supplier untuk Dropdown
  const DEFAULT_SUPPLIERS = [
    'PT Rimba Jati Makmur',
    'Perum Perhutani KPH Randublatung',
    'CV Jati Alam Lestari',
    'PT Kayu Tropis Nusantara',
    'UD Sumber Kayu Barokah',
    'CV Mitra Timber Sejahtera',
    'PT. Suplier',
  ];
  const [suppliersList, setSuppliersList] = useState<string[]>(DEFAULT_SUPPLIERS);
  const [supplierSelect, setSupplierSelect] = useState<string>(DEFAULT_SUPPLIERS[0]);
  const [customSupplier, setCustomSupplier] = useState<string>('');

  // Form State
  const [formIdLog, setFormIdLog] = useState('');
  const [formSortimen, setFormSortimen] = useState('Sortimen A');
  const [formPanjang, setFormPanjang] = useState<number | ''>('');
  const [formDiameter, setFormDiameter] = useState<number | ''>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Muat supplier riil dari database backend
  useEffect(() => {
    let cancelled = false;
    supplierApi
      .list()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          const names = data.map((s) => s.namaSupplier).filter(Boolean);
          setSuppliersList((prev) => Array.from(new Set([...names, ...prev])));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const user = useSessionUser();
  const isManager = user?.role === 'manager';
  const canCreate = can(user?.role, 'log:create');
  const canUpdate = can(user?.role, 'log:update');
  const canDelete = can(user?.role, 'log:delete');
  const canAct = canUpdate || canDelete || isManager;

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
    setSupplierSelect(suppliersList[0] || 'PT Rimba Jati Makmur');
    setCustomSupplier('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: LogItem) => {
    setModalMode('edit');
    setSelectedLogId(item.id_log);
    setFormIdLog(item.id_log);
    setFormSortimen(item.sortimen);
    setFormPanjang(item.panjang);
    setFormDiameter(item.diameter);
    const existing = suppliersList.find(
      (s) => s.toLowerCase() === (item.suplier || '').toLowerCase()
    );
    if (existing) {
      setSupplierSelect(existing);
      setCustomSupplier('');
    } else {
      setSupplierSelect('__others__');
      setCustomSupplier(item.suplier || '');
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idLog = formIdLog.trim();
    const suplier = (supplierSelect === '__others__' ? customSupplier : supplierSelect).trim();
    const validationError = firstError(
      required(idLog, 'ID Log'),
      maxLength(idLog, 'ID Log', 50),
      positiveNumber(formPanjang, 'Panjang'),
      positiveNumber(formDiameter, 'Diameter'),
      required(suplier, 'Supplier'),
      maxLength(suplier, 'Supplier', 100)
    );

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const p = Number(formPanjang);
    const d = Number(formDiameter);
    const calculatedVol = calculateVolume(p, d);

    setFormError(null);
    setPageError(null);

    if (modalMode === 'input') {
      const newLogPayload: Partial<LogItem> = {
        id_log: idLog,
        sortimen: formSortimen,
        panjang: p,
        diameter: d,
        volume: calculatedVol,
        stage: 'Log',
        tanggal_masuk: toISODate(),
        suplier,
        harga: 1000000,
      };

      try {
        const saved = await logApi.create(newLogPayload);
        setLogs((prev) => [saved, ...prev]);
        setPage(1);
      } catch (err) {
        setFormError(
          `Gagal menyimpan log ${idLog} ke server. Data tidak ditambahkan. ${getApiErrorMessage(
            err,
            'Silakan coba lagi.'
          )}`
        );
        return;
      }
    } else if (modalMode === 'edit' && selectedLogId) {
      const current = logs.find((l) => l.id_log === selectedLogId);
      const updatePayload: Partial<LogItem> = {
        id_log: idLog,
        sortimen: formSortimen,
        panjang: p,
        diameter: d,
        volume: calculatedVol,
        suplier,
      };

      if (!current?.idLog) {
        setFormError(
          'Data log ini belum tersimpan di server sehingga tidak dapat diperbarui.'
        );
        return;
      }

      try {
        const saved = await logApi.update(current.idLog, updatePayload);
        setLogs((prev) =>
          prev.map((item) =>
            item.id_log === selectedLogId ? { ...item, ...saved } : item
          )
        );
      } catch (err) {
        setFormError(
          `Gagal memperbarui log ${idLog} di server. Perubahan tidak disimpan. ${getApiErrorMessage(
            err,
            'Silakan coba lagi.'
          )}`
        );
        return;
      }
    }

    setIsModalOpen(false);
  };


  const handleSendToSawmill = async (item: LogItem) => {
    if (
      !confirm(
        `Kirim kayu log ${item.id_log} (${item.sortimen}, ${item.panjang}x${item.diameter} cm) ke proses Sawmill?`
      )
    ) {
      return;
    }

    setProcessingLogId(item.id_log);
    setPageError(null);
    setSuccessBanner(null);

    try {
      await sawmillApi.create({
        idLog: item.idLog,
        id_log_asal: item.id_log,
        sortimen: item.sortimen,
        panjang: item.panjang,
        diameter: item.diameter,
        volume_total: item.volume,
        stage: 'Sawmill',
        suplier: item.suplier,
        harga: item.harga || 0,
        tanggal: toISODate(),
        planks: [],
      });

      if (item.idLog) {
        await logApi.update(item.idLog, { statusLog: 'Sawmill' });
      }

      setLogs((prev) =>
        prev.map((l) =>
          l.id_log === item.id_log
            ? { ...l, stage: 'Sawmill', statusLog: 'Sawmill' }
            : l
        )
      );

      setSuccessBanner(
        `Kayu log ${item.id_log} berhasil dialihkan ke antrean proses Sawmill!`
      );
    } catch (err) {
      setPageError(
        `Gagal memproses log ${item.id_log} ke Sawmill: ${getApiErrorMessage(
          err,
          'Silakan periksa koneksi backend dan coba lagi.'
        )}`
      );
    } finally {
      setProcessingLogId(null);
    }
  };

  const handleDeleteLog = async (item: LogItem) => {
    if (!confirm(`Hapus log ${item.id_log}?`)) return;

    setPageError(null);
    try {
      if (item.idLog) {
        await logApi.delete(item.idLog);
      }
      setLogs((prev) => prev.filter((l) => l.id_log !== item.id_log));
    } catch (err) {
      setPageError(
        `Gagal menghapus log ${item.id_log} dari server. ${getApiErrorMessage(
          err,
          'Data tidak dihapus agar tidak berbeda dengan server.'
        )}`
      );
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSortimen =
      sortimenFilter === 'All Sortimen' || log.sortimen === sortimenFilter;
    const matchesDate = !dateFilter || log.tanggal_masuk === dateFilter;
    return matchesSortimen && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const capacityStats = [
    { title: 'Sawmill', stage: 'Sawmill' as const, icon: Factory, capacity: 15 },
    {
      title: 'Pra Dry-Kiln',
      stage: 'Pra Dry Kiln' as const,
      icon: Flame,
      capacity: 15,
    },
    {
      title: 'Dry-KILN Process',
      stage: 'Dry Kiln' as const,
      icon: Flame,
      capacity: 15,
    },
    {
      title: 'Ready To Sale',
      stage: 'Ready To Sale' as const,
      icon: PackageCheck,
      capacity: 15,
    },
  ].map((stat) => {
    const count = logs.filter((log) => log.stage === stat.stage).length;
    return {
      ...stat,
      ratio: `${count}/${stat.capacity}`,
      pct: Math.min(100, Math.round((count / stat.capacity) * 100)),
    };
  });

  const handleExportPdf = () => {
    const columns = [
      'ID Log',
      'Sortimen',
      'Panjang (cm)',
      'Diameter (cm)',
      'Volume (m³)',
      'Stage',
      'Tanggal Masuk',
    ];

    if (isManager) {
      columns.push('Supplier', 'Harga');
    }

    const rows = filteredLogs.map((item) => {
      const row = [
        item.id_log,
        item.sortimen,
        String(item.panjang),
        String(item.diameter),
        item.volume.toFixed(3),
        item.stage,
        formatDateID(item.tanggal_masuk),
      ];

      if (isManager) {
        row.push(
          item.suplier,
          `Rp ${(item.harga || 0).toLocaleString('id-ID')}`
        );
      }

      return row;
    });

    exportToPdf({
      title: 'Laporan Data Log',
      subtitle: `Tanggal: ${
        dateFilter ? formatDateID(dateFilter) : 'Semua'
      } | Sortimen: ${
        sortimenFilter === 'All Sortimen' ? 'Semua' : sortimenFilter
      }`,
      sections: [
        {
          title: 'Data Log',
          columns,
          rows,
        },
      ],
    });
  };

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
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
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
                onChange={(e) => {
                  setSortimenFilter(e.target.value);
                  setPage(1);
                }}
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
            onClick={handleExportPdf}
            className="px-4 py-2 bg-red-50 hover:bg-red-100/70 border border-stone-300 rounded text-xs font-semibold text-green-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-green-700" />
            <span>Export PDF</span>
          </button>

          {(canCreate || isManager) && (
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

      {successBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs flex justify-between items-center animate-in fade-in">
          <span className="font-medium flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-700" />
            {successBanner}
          </span>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {pageError && (
        <ErrorBanner
          title="Gagal memproses data log"
          message={pageError}
          onRetry={handleRetryLoad}
          retryLabel="Muat Ulang"
        />
      )}

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

                {/* Kolom Aksi sesuai izin role */}
                {canAct && (
                  <th className="py-3 px-3 text-center w-12">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6 + (isManager ? 2 : 0) + (canAct ? 1 : 0)}
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
                          : canCreate
                          ? 'Gunakan tombol "+ New Batch" untuk meregistrasikan kayu gelondongan pertama.'
                          : 'Belum ada data log yang dapat ditampilkan.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((item) => (
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
                      {formatDateID(item.tanggal_masuk)}
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

                    {canAct && (
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {item.stage === 'Log' ? (
                            <button
                              type="button"
                              onClick={() => handleSendToSawmill(item)}
                              disabled={processingLogId === item.id_log}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-600 hover:bg-amber-700 text-white shadow-xs inline-flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                              title="Kirim kayu log ini ke proses Sawmill"
                            >
                              <Factory className="w-3.5 h-3.5" />
                              <span>{processingLogId === item.id_log ? 'Memproses...' : 'Ke Sawmill'}</span>
                            </button>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-medium text-amber-800 bg-amber-100 rounded border border-amber-300 inline-flex items-center gap-1">
                              <Factory className="w-2.5 h-2.5 text-amber-700" />
                              Sawmill
                            </span>
                          )}

                          {(canUpdate || isManager) && (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                              title="Edit Log"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLog(item)}
                              className="p-1 text-red-600 hover:bg-red-100/70 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                              title="Hapus Log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={currentPage}
          pageSize={PAGE_SIZE}
          totalItems={filteredLogs.length}
          totalCount={logs.length}
          onPageChange={setPage}
        />
      </section>

      {/* 3. Bottom Capacity Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {capacityStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
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
                onClick={() => {
                  setFormError(null);
                  setIsModalOpen(false);
                }}
                className="p-1 text-stone-500 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              onInput={() => {
                if (formError) setFormError(null);
              }}
              className="p-4 bg-white/80 rounded-[10px] border border-stone-800/80 flex flex-col gap-3 text-xs"
            >
              {/* ID LOG */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">ID LOG</label>
                <input
                  type="text"
                  required
                  maxLength={50}
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
                      min={0.1}
                      step="any"
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
                      min={0.1}
                      step="any"
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

              {/* Suplier Dropdown & Aksi Submit */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-green-700">Suplier</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <select
                      value={supplierSelect}
                      onChange={(e) => setSupplierSelect(e.target.value)}
                      className="w-full h-10 pl-3 pr-8 bg-white border border-stone-300 rounded text-green-700 font-semibold appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
                    >
                      {suppliersList.map((sup) => (
                        <option key={sup} value={sup}>
                          {sup}
                        </option>
                      ))}
                      <option value="__others__">Others (Lainnya...)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
                  </div>

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

                {/* Input teks khusus jika memilih Others */}
                {supplierSelect === '__others__' && (
                  <div className="mt-1 animate-in fade-in duration-150">
                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="Masukkan nama supplier lainnya..."
                      value={customSupplier}
                      onChange={(e) => setCustomSupplier(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-stone-300 rounded text-green-700 font-semibold focus:outline-none focus:border-green-700"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              <FormError message={formError} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}