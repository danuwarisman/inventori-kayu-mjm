'use client';

import React, { useState, useEffect } from 'react';
import {
  FileDown,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  ChevronDown,
  Check,
  Inbox,
  Layers,
} from 'lucide-react';
import { toISODate, formatDateID } from '@/lib/dates';
import { getApiErrorMessage, sawmillApi, logApi } from '@/lib/api';
import { exportToPdf } from '@/lib/export';
import useSessionUser from '@/lib/useSessionUser';
import { can } from '@/lib/permissions';
import { PlankItem, SawmillItem } from '@/types/sawmill';
import { LogItem } from '@/types/log';
import FormError from '@/components/FormError';
import ErrorBanner from '@/components/ErrorBanner';
import Pagination from '@/components/Pagination';
import { useConfirm } from '@/components/ConfirmModal';
import {
  firstError,
  maxLength,
  positiveNumber,
  required,
} from '@/lib/validation';

export { type PlankItem, type SawmillItem };

const PAGE_SIZE = 10;

export default function DataSawmillPage() {
  const user = useSessionUser();
  const { confirm, ConfirmDialog } = useConfirm();
  const isManager = user?.role === 'manager';
  const canCreate = can(user?.role, 'sawmill:create') || isManager;
  const canUpdate = can(user?.role, 'sawmill:update') || isManager;
  const canDelete = can(user?.role, 'sawmill:delete') || isManager;
  const canCreatePlank = can(user?.role, 'plank:create') || isManager;
  const canUpdatePlank = can(user?.role, 'plank:update') || isManager;
  const canDeletePlank = can(user?.role, 'plank:delete') || isManager;
  const canManagePlanks = canCreatePlank || canUpdatePlank || canDeletePlank;

  // State data utama
  const [sawmillItems, setSawmillItems] = useState<SawmillItem[]>([]);

  // State Filter
  const [dateFilter, setDateFilter] = useState('');
  const [sortimenFilter, setSortimenFilter] = useState('All Sortimen');
  const [page, setPage] = useState(1);
  const [pageError, setPageError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    sawmillApi
      .list({ sortimen: sortimenFilter })
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setSawmillItems(data);
          setPageError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setPageError(
            getApiErrorMessage(
              err,
              'Gagal memuat data sawmill dari server. Periksa koneksi backend.'
            )
          );
        }
      });

    logApi
      .list()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setAvailableLogs(data.filter((l) => l.stage === 'Log' || l.statusLog === 'Log'));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [sortimenFilter, refreshKey]);

  const handleRetryLoad = () => {
    setRefreshKey((key) => key + 1);
  };

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
  const [formStage, setFormStage] = useState<'Sawmill' | 'finish Sawmill'>('Sawmill');
  const [availableLogs, setAvailableLogs] = useState<LogItem[]>([]);

  // Form Hasil Plank
  const [formIdPlank, setFormIdPlank] = useState('');
  const [formGrade, setFormGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [formTinggiPlank, setFormTinggiPlank] = useState<number | ''>('');
  const [formLebarPlank, setFormLebarPlank] = useState<number | ''>('');
  const [formPanjangPlank, setFormPanjangPlank] = useState<number | ''>('');
  const [formError, setFormError] = useState<string | null>(null);

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
    logApi
      .list()
      .then((data) => {
        if (Array.isArray(data)) {
          setAvailableLogs(data.filter((l) => l.stage === 'Log' || l.statusLog === 'Log'));
        }
      })
      .catch(() => {});

    setFormIdLog('');
    setFormSortimen('Sortimen A');
    setFormPanjang('');
    setFormDiameter('');
    setFormSuplier('');
    setFormStage('Sawmill');
    setSelectedSawmill(null);
    setFormError(null);
    setModalType('input-sawmill');
  };

  const handleOpenEditSawmill = (item: SawmillItem) => {
    setSelectedSawmill(item);
    setFormIdLog(item.id_log_asal);
    setFormSortimen(item.sortimen);
    setFormPanjang(item.panjang);
    setFormDiameter(item.diameter);
    setFormSuplier(item.suplier);
    setFormStage(item.stage === 'finish Sawmill' ? 'finish Sawmill' : 'Sawmill');
    setFormError(null);
    setModalType('edit-sawmill');
  };

  const handleSubmitSawmill = async (e: React.FormEvent) => {
    e.preventDefault();

    const idLog = formIdLog.trim();
    const suplier = formSuplier.trim();
    const validationError = firstError(
      required(idLog, 'ID Log Asal'),
      maxLength(idLog, 'ID Log Asal', 50),
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
    const vol = calcLogVolume(p, d);

    setFormError(null);
    setPageError(null);

    if (modalType === 'input-sawmill') {
      const chosenLog = availableLogs.find((l) => l.id_log === idLog);
      if (!chosenLog) {
        setFormError(
          'Pilih kayu log dari daftar Stok Kayu Log yang berstatus "Log".'
        );
        return;
      }

      const newItemPayload: Partial<SawmillItem> = {
        idLog: chosenLog.idLog,
        id_sawmill: `SM-${new Date().getFullYear()}-${sawmillItems.length + 1}`,
        id_log_asal: idLog,
        sortimen: formSortimen,
        panjang: p,
        diameter: d,
        volume_total: vol,
        stage: 'Sawmill',
        tanggal: toISODate(),
        suplier,
        harga: chosenLog.harga || 0,
        planks: [],
      };

      try {
        const saved = await sawmillApi.create(newItemPayload);
        setSawmillItems((prev) => [saved, ...prev]);
        setAvailableLogs((prev) => prev.filter((l) => l.id_log !== idLog));
        setPage(1);
      } catch (err) {
        setFormError(
          `Gagal menyimpan batch sawmill ${idLog} ke server. Data tidak ditambahkan. ${getApiErrorMessage(
            err,
            'Silakan coba lagi.'
          )}`
        );
        return;
      }
    } else if (modalType === 'edit-sawmill' && selectedSawmill) {
      const updatedPayload: Partial<SawmillItem> = {
        kodeSawmill: selectedSawmill.kodeSawmill ?? selectedSawmill.id_sawmill,
        stage: formStage,
      };

      if (!selectedSawmill.idSawmill) {
        setFormError(
          'Data sawmill ini belum tersimpan di server sehingga tidak dapat diperbarui.'
        );
        return;
      }

      try {
        const saved = await sawmillApi.update(
          selectedSawmill.idSawmill,
          updatedPayload
        );
        setSawmillItems((prev) =>
          prev.map((item) =>
            item.id_sawmill === selectedSawmill.id_sawmill
              ? { ...item, ...saved }
              : item
          )
        );
      } catch (err) {
        setFormError(
          `Gagal memperbarui batch sawmill ${idLog} di server. Perubahan tidak disimpan. ${getApiErrorMessage(
            err,
            'Silakan coba lagi.'
          )}`
        );
        return;
      }
    }
    setModalType(null);
  };

  const handleDeleteSawmill = async (item: SawmillItem) => {
    const ok = await confirm({
      title: 'Hapus Batch Sawmill',
      message: `Apakah Anda yakin ingin menghapus batch Sawmill ${item.id_sawmill} (Log Asal: ${item.id_log_asal})?`,
      confirmLabel: 'Ya, Hapus Batch',
      variant: 'danger',
    });
    if (!ok) return;
    setPageError(null);
    try {
      if (item.idSawmill) {
        await sawmillApi.delete(item.idSawmill);
      }
      setSawmillItems((prev) =>
        prev.filter((i) => i.id_sawmill !== item.id_sawmill)
      );
    } catch (err) {
      setPageError(
        `Gagal menghapus batch sawmill ${item.id_sawmill} dari server. ${getApiErrorMessage(
          err,
          'Data tidak dihapus agar tidak berbeda dengan server.'
        )}`
      );
    }
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
    setFormError(null);
    setModalType('input-hasil');
  };

  const handleOpenEditHasil = (plank: PlankItem, index: number) => {
    setFormIdPlank(plank.id_plank);
    setFormGrade(plank.grade);
    setFormTinggiPlank(plank.tinggi);
    setFormLebarPlank(plank.lebar);
    setFormPanjangPlank(plank.panjang);
    setSelectedPlankIndex(index);
    setFormError(null);
    setModalType('edit-hasil');
  };

  const handleDeletePlank = async (plank: PlankItem, index: number) => {
    if (!selectedSawmill) return;
    const ok = await confirm({
      title: 'Hapus Papan (Plank)',
      message: `Apakah Anda yakin ingin menghapus papan ${plank.id_plank} (${plank.grade}) dari daftar hasil Sawmill?`,
      confirmLabel: 'Ya, Hapus Papan',
      variant: 'danger',
    });
    if (!ok) return;
    setPageError(null);
    try {
      if (plank.idPlank) {
        await sawmillApi.deletePlank(plank.idPlank);
      }
      const updatedPlanks = selectedSawmill.planks.filter(
        (_, idx) => idx !== index
      );
      const updatedItem: SawmillItem = {
        ...selectedSawmill,
        stage: updatedPlanks.length > 0 ? 'finish Sawmill' : 'Sawmill',
        planks: updatedPlanks,
      };
      setSawmillItems((prev) =>
        prev.map((i) =>
          i.id_sawmill === selectedSawmill.id_sawmill ? updatedItem : i
        )
      );
      setSelectedSawmill(updatedItem);
    } catch (err) {
      setPageError(
        `Gagal menghapus plank ${plank.id_plank} dari server. ${getApiErrorMessage(
          err,
          'Data tidak dihapus agar tidak berbeda dengan server.'
        )}`
      );
    }
  };

  const handleSubmitPlank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSawmill) return;

    const idPlank = formIdPlank.trim();
    const validationError = firstError(
      required(idPlank, 'ID Plank'),
      maxLength(idPlank, 'ID Plank', 50),
      positiveNumber(formPanjangPlank, 'Panjang'),
      positiveNumber(formLebarPlank, 'Lebar'),
      positiveNumber(formTinggiPlank, 'Tinggi/Tebal')
    );

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const t = Number(formTinggiPlank);
    const w = Number(formLebarPlank);
    const l = Number(formPanjangPlank);
    const vol = calcPlankVolume(t, w, l);

    setFormError(null);
    setPageError(null);

    const plankData: PlankItem = {
      id_plank: idPlank,
      sortimen: selectedSawmill.sortimen,
      tinggi: t,
      lebar: w,
      panjang: l,
      volume: vol,
      grade: formGrade,
    };

    let savedPlank: PlankItem | null = null;
    let updatedPlanks: PlankItem[] = [];

    if (modalType === 'input-hasil') {
      if (!selectedSawmill.idSawmill) {
        setFormError(
          'Batch sawmill ini belum tersimpan di server sehingga plank tidak dapat ditambahkan.'
        );
        return;
      }

      try {
        savedPlank = await sawmillApi.addPlank(
          selectedSawmill.idSawmill,
          plankData
        );
        updatedPlanks = [...selectedSawmill.planks, savedPlank];
      } catch (err) {
        setFormError(
          `Gagal menyimpan plank ${idPlank} ke server. Data tidak ditambahkan. ${getApiErrorMessage(
            err,
            'Silakan coba lagi.'
          )}`
        );
        return;
      }
    } else if (modalType === 'edit-hasil' && selectedPlankIndex !== null) {
      const existingPlank = selectedSawmill.planks[selectedPlankIndex];

      if (!existingPlank?.idPlank) {
        setFormError(
          'Plank ini belum tersimpan di server sehingga tidak dapat diperbarui.'
        );
        return;
      }

      try {
        savedPlank = await sawmillApi.updatePlank(
          existingPlank.idPlank,
          plankData
        );
        updatedPlanks = selectedSawmill.planks.map((plank, index) =>
          index === selectedPlankIndex ? savedPlank! : plank
        );
      } catch (err) {
        setFormError(
          `Gagal memperbarui plank ${idPlank} di server. Perubahan tidak disimpan. ${getApiErrorMessage(
            err,
            'Silakan coba lagi.'
          )}`
        );
        return;
      }
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

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleExportPdf = () => {
    const columns = [
      'ID Log Asal',
      'Sortimen',
      'Panjang (mm)',
      'Diameter (mm)',
      'Volume Total (m³)',
      'Stage',
      'Tanggal',
      'Jumlah Plank',
    ];

    if (isManager) {
      columns.push('Supplier', 'Harga');
    }

    const rows = filteredItems.map((item) => {
      const row = [
        item.id_log_asal,
        item.sortimen,
        String(item.panjang),
        String(item.diameter),
        item.volume_total.toFixed(3),
        item.stage,
        formatDateID(item.tanggal),
        String(item.planks.length),
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
      title: 'Laporan Data Sawmill',
      subtitle: `Tanggal: ${
        dateFilter ? formatDateID(dateFilter) : 'Semua'
      } | Sortimen: ${
        sortimenFilter === 'All Sortimen' ? 'Semua' : sortimenFilter
      }`,
      sections: [
        {
          title: 'Data Sawmill',
          columns,
          rows,
        },
      ],
    });
  };

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

          {canCreate && (
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

      {pageError && (
        <ErrorBanner
          title="Gagal memproses data sawmill"
          message={pageError}
          onRetry={handleRetryLoad}
          retryLabel="Muat Ulang"
        />
      )}

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

                {/* Kolom Aksi Edit sesuai izin role */}
                {canUpdate && (
                  <th className="py-3 px-3 text-center w-12">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7 + (isManager ? 2 : 0) + (canUpdate ? 1 : 0)}
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
                          : canCreate
                          ? 'Gunakan tombol "+ New Batch" untuk meregistrasikan pemotongan kayu log baru.'
                          : 'Belum ada data Sawmill yang dapat ditampilkan.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
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
                      {formatDateID(item.tanggal)}
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

                    {canUpdate && (
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditSawmill(item)}
                            className="p-1 text-green-700 hover:bg-green-100/70 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Edit Status Batch Sawmill"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => handleDeleteSawmill(item)}
                              className="p-1 text-red-600 hover:bg-red-100/70 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                              title="Hapus Batch Sawmill"
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
          totalItems={filteredItems.length}
          totalCount={sawmillItems.length}
          onPageChange={setPage}
        />
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
                onClick={() => {
                  setFormError(null);
                  setModalType(null);
                }}
                className="p-1 text-stone-500 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitSawmill}
              onInput={() => {
                if (formError) setFormError(null);
              }}
              className="p-4 bg-white/80 rounded-[10px] border border-stone-800/80 flex flex-col gap-3 text-xs"
            >
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700 flex justify-between items-center">
                  <span>ID LOG ASAL</span>
                  {modalType === 'input-sawmill' && (
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-normal">
                      {availableLogs.length} Log Siap Olah
                    </span>
                  )}
                </label>
                {modalType === 'input-sawmill' ? (
                  availableLogs.length > 0 ? (
                    <div className="relative">
                      <select
                        value={formIdLog}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormIdLog(val);
                          const chosen = availableLogs.find((l) => l.id_log === val);
                          if (chosen) {
                            setFormSortimen(chosen.sortimen);
                            setFormPanjang(chosen.panjang);
                            setFormDiameter(chosen.diameter);
                            setFormSuplier(chosen.suplier);
                          }
                        }}
                        className="w-full h-10 pl-3 pr-8 bg-white border border-stone-800 rounded font-mono text-green-700 text-xs focus:outline-none focus:border-green-700 cursor-pointer"
                        required
                      >
                        <option value="">-- Pilih Log dari Stok Kayu Log --</option>
                        {availableLogs.map((l) => (
                          <option key={l.id_log} value={l.id_log}>
                            {l.id_log} - {l.sortimen} ({l.panjang}x{l.diameter} cm, Vol: {l.volume} m³) - {l.suplier}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-amber-800 text-[11px]">
                      Belum ada stok kayu log berstatus <b>&quot;Log&quot;</b> yang siap diolah. Tambahkan log terlebih dahulu melalui Master Data atau Pembelian PO.
                    </div>
                  )
                ) : (
                  <input
                    type="text"
                    disabled
                    value={formIdLog}
                    className="w-full h-10 px-3 bg-stone-100 border border-stone-300 rounded font-mono text-green-800 font-medium"
                  />
                )}
              </div>

              {modalType === 'edit-sawmill' && (
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-green-700">Stage Sawmill</label>
                  <div className="relative">
                    <select
                      value={formStage}
                      onChange={(e) =>
                        setFormStage(e.target.value as 'Sawmill' | 'finish Sawmill')
                      }
                      className="w-full h-10 pl-3 pr-8 bg-white border border-stone-800 rounded text-green-700 font-semibold appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
                    >
                      <option value="Sawmill">Sawmill</option>
                      <option value="finish Sawmill">finish Sawmill</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Sortimen</label>
                <input
                  type="text"
                  disabled
                  value={formSortimen}
                  className="w-full h-10 px-3 bg-stone-100 border border-stone-300 rounded text-green-800 font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-semibold text-green-700">Ukuran Log Asal</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">Panjang (cm)</label>
                    <input
                      type="number"
                      disabled
                      placeholder="-"
                      value={formPanjang}
                      className="w-full h-9 px-3 bg-stone-100 border border-stone-300 rounded text-green-800"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[11px] text-green-700">Diameter (cm)</label>
                    <input
                      type="number"
                      disabled
                      placeholder="-"
                      value={formDiameter}
                      className="w-full h-9 px-3 bg-stone-100 border border-stone-300 rounded text-green-800"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-green-700">Suplier</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    disabled
                    placeholder="-"
                    value={formSuplier}
                    className="flex-1 h-10 px-3 bg-stone-100 border border-stone-300 rounded text-green-800 font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={modalType === 'input-sawmill' && availableLogs.length === 0}
                    className="h-10 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
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

              <FormError message={formError} />
            </form>
          </div>
        </div>
      )}

      {/* Modal B: Rincian Papan Hasil Potong (Detail Hasil Sawmill) */}
      {modalType === 'detail-hasil' && selectedSawmill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[680px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
              <h2 className="text-stone-800 text-xl font-bold font-sans">
                {canManagePlanks ? 'Edit Detail Hasil Sawmill' : 'Detail Hasil Sawmill'}
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
                      <th className="py-2.5 px-2 text-center">Stage</th>
                      {canManagePlanks && (
                        <th className="py-2.5 px-2 text-center w-16">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedSawmill.planks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6 + (canManagePlanks ? 1 : 0)}
                          className="py-8 text-center text-stone-400"
                        >
                          <div className="flex flex-col items-center justify-center gap-1">
                            <Layers className="w-6 h-6 text-stone-300" />
                            <span>Belum ada papan olahan (plank) yang dicatat untuk log ini.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      selectedSawmill.planks.map((plank, pIdx) => {
                        const isPlankLocked =
                          Boolean(plank.stage) && plank.stage !== 'Sawmill';
                        return (
                          <tr key={plank.id_plank} className="text-green-700">
                            <td className="py-2 px-2 text-center font-mono font-medium">
                              {plank.id_plank}
                            </td>
                            <td className="py-2 px-2 text-center">{plank.sortimen}</td>
                            <td className="py-2 px-2 text-center whitespace-nowrap">
                              {plank.tinggi}cm x {plank.lebar}cm x {plank.panjang}cm
                            </td>
                            <td className="py-2 px-2 text-center font-medium">
                              {plank.volume.toFixed(3)} m³
                            </td>
                            <td className="py-2 px-2 text-center font-semibold">
                              {plank.grade}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-lime-100 text-green-800">
                                {plank.stage || 'Sawmill'}
                              </span>
                            </td>
                            {canManagePlanks && (
                              <td className="py-2 px-2 text-center">
                                <div className="inline-flex items-center gap-1">
                                  {canUpdatePlank && (
                                    <button
                                      type="button"
                                      disabled={isPlankLocked}
                                      onClick={() => handleOpenEditHasil(plank, pIdx)}
                                      className="p-1 hover:bg-green-100 rounded text-green-700 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                      title={
                                        isPlankLocked
                                          ? `Plank sudah digunakan pada proses ${plank.stage} dan tidak dapat diubah`
                                          : 'Edit Plank'
                                      }
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {canDeletePlank && (
                                    <button
                                      type="button"
                                      disabled={isPlankLocked}
                                      onClick={() => handleDeletePlank(plank, pIdx)}
                                      className="p-1 hover:bg-red-100 rounded text-red-600 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                      title={
                                        isPlankLocked
                                          ? `Plank sudah digunakan pada proses ${plank.stage} dan tidak dapat dihapus`
                                          : 'Hapus Plank'
                                      }
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {canCreatePlank && (
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
                onClick={() => {
                  setFormError(null);
                  setModalType('detail-hasil');
                }}
                className="p-1 text-stone-500 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitPlank}
              onInput={() => {
                if (formError) setFormError(null);
              }}
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
                  maxLength={50}
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
                      min={0.1}
                      step="any"
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
                      min={0.1}
                      step="any"
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
                      min={0.1}
                      step="any"
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

              <FormError message={formError} />

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

      {ConfirmDialog}
    </div>
  );
}