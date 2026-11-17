'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check, Plus } from 'lucide-react';
import {
  PraDryKilnItem,
  PraDryKilnFormData,
  PlankGrade,
  PraDryKilnStage,
} from '@/types/pra-dry-kiln';
import FormError from '@/components/FormError';
import { logApi, sawmillApi } from '@/lib/api';
import { LogItem } from '@/types/log';
import { PlankItem } from '@/types/sawmill';
import {
  firstError,
  maxLength,
  positiveNumber,
  required,
} from '@/lib/validation';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PraDryKilnItem, 'volume' | 'date'>) => void;
  initialData?: PraDryKilnItem | null;
  mode: 'input' | 'edit';
  nextBatchIndex: number;
}

interface SelectOption {
  value: string;
  label: string;
  meta?: string;
  dotClass?: string;
}

interface ModalSelectProps {
  id?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  mono?: boolean;
  menuPlacement?: 'bottom' | 'top';
}

function ModalSelect({
  id,
  value,
  options,
  onChange,
  mono = false,
  menuPlacement = 'bottom',
}: ModalSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selected = options.find((opt) => opt.value === value) ?? options[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full h-10 px-3 bg-white border rounded-md flex items-center justify-between gap-2 text-left transition-all cursor-pointer ${
          open
            ? 'border-green-700 ring-2 ring-green-700/15'
            : 'border-stone-300 hover:border-green-600/70 focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15'
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          {selected?.dotClass && (
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${selected.dotClass}`}
            />
          )}
          <span
            className={`truncate ${
              mono
                ? 'font-mono font-semibold text-green-800'
                : 'font-medium text-stone-800'
            }`}
          >
            {selected?.label ?? value}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180 text-green-700' : ''
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute left-0 right-0 z-50 max-h-52 overflow-y-auto bg-white border border-stone-200 rounded-lg shadow-lg py-1 ${
            menuPlacement === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-2 flex items-center justify-between gap-2 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-green-50 text-green-800 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {opt.dotClass && (
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${opt.dotClass}`}
                      />
                    )}
                    <span className={`truncate ${mono ? 'font-mono' : ''}`}>
                      {opt.label}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    {opt.meta && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-normal">
                        {opt.meta}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-green-700 shrink-0" />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const SORTIMEN_OPTIONS: SelectOption[] = [
  { value: 'Sortimen A', label: 'Sortimen A' },
  { value: 'Sortimen B', label: 'Sortimen B' },
  { value: 'Sortimen C', label: 'Sortimen C' },
];

const GRADE_OPTIONS: SelectOption[] = [
  { value: 'Grade A', label: 'Grade A' },
  { value: 'Grade B', label: 'Grade B' },
  { value: 'Grade C', label: 'Grade C' },
];

const PRA_STAGE_OPTIONS: SelectOption[] = [
  {
    value: 'finish pra-drykiln',
    label: 'Finish (Selesai Penataan / Sticking)',
    dotClass: 'bg-emerald-600',
  },
  {
    value: 'pra-drykiln',
    label: 'In-Process (Proses Penataan Rak)',
    dotClass: 'bg-lime-500',
  },
];

export default function BatchModal(props: BatchModalProps) {
  if (!props.isOpen) return null;
  const formKey = `${props.mode}-${props.initialData?.id_plank ?? 'new'}-${props.nextBatchIndex}`;
  return <BatchModalContent key={formKey} {...props} />;
}

function BatchModalContent({
  onClose,
  onSubmit,
  initialData,
  mode,
  nextBatchIndex,
}: BatchModalProps) {
  const currentYear = new Date().getFullYear();
  const defaultLogId = `L-${currentYear}-3-A-${nextBatchIndex}`;
  const defaultPlankId = `P-${currentYear}-3-A-${nextBatchIndex}`;

  const [formData, setFormData] = useState<PraDryKilnFormData>(() =>
    initialData && mode === 'edit'
      ? {
          id_plank: initialData.id_plank,
          id_log: initialData.id_log,
          sortimen: initialData.sortimen,
          grade: initialData.grade,
          panjang: initialData.panjang,
          lebar: initialData.lebar,
          tinggi: initialData.tinggi,
          stage: initialData.stage,
        }
      : {
          id_plank: defaultPlankId,
          id_log: defaultLogId,
          sortimen: 'Sortimen A',
          grade: 'Grade A',
          panjang: 240,
          lebar: 20,
          tinggi: 5,
          stage: 'finish pra-drykiln',
        }
  );
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [planks, setPlanks] = useState<PlankItem[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([logApi.list(), sawmillApi.listPlanks()]).then(
      ([logsRes, planksRes]) => {
        if (cancelled) return;
        const fetchedLogs =
          logsRes.status === 'fulfilled' && Array.isArray(logsRes.value)
            ? logsRes.value
            : [];
        const fetchedPlanks =
          planksRes.status === 'fulfilled' && Array.isArray(planksRes.value)
            ? planksRes.value
            : [];

        setLogs(fetchedLogs);
        setPlanks(fetchedPlanks);

        if (mode === 'input') {
          if (fetchedPlanks.length > 0) {
            const firstPlank = fetchedPlanks[0];
            setFormData((prev) =>
              prev.id_log === defaultLogId && prev.id_plank === defaultPlankId
                ? {
                    ...prev,
                    id_plank: firstPlank.id_plank,
                    id_log: firstPlank.id_log || prev.id_log,
                    sortimen: firstPlank.sortimen || prev.sortimen,
                    grade: firstPlank.grade || prev.grade,
                    panjang: firstPlank.panjang || prev.panjang,
                    lebar: firstPlank.lebar || prev.lebar,
                    tinggi: firstPlank.tinggi || prev.tinggi,
                  }
                : prev
            );
          } else if (fetchedLogs.length > 0) {
            const firstLog = fetchedLogs[0];
            setFormData((prev) =>
              prev.id_log === defaultLogId
                ? {
                    ...prev,
                    id_log: firstLog.id_log,
                    sortimen: firstLog.sortimen || prev.sortimen,
                  }
                : prev
            );
          }
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [mode, defaultLogId, defaultPlankId]);

  const logIds = Array.from(
    new Set(
      [
        ...logs.map((l) => l.id_log),
        ...planks.map((p) => p.id_log),
        initialData?.id_log,
        defaultLogId,
        formData.id_log,
      ].filter((v): v is string => Boolean(v && v.trim()))
    )
  );

  const matchingPlanks = planks.filter((p) => p.id_log === formData.id_log);
  const otherPlanks = planks.filter((p) => p.id_log !== formData.id_log);
  const plankIds = Array.from(
    new Set(
      [
        ...matchingPlanks.map((p) => p.id_plank),
        ...otherPlanks.map((p) => p.id_plank),
        initialData?.id_plank,
        defaultPlankId,
        formData.id_plank,
      ].filter((v): v is string => Boolean(v && v.trim()))
    )
  );

  const logSelectOptions: SelectOption[] = logIds.map((id) => {
    const match = logs.find((l) => l.id_log === id);
    return {
      value: id,
      label: id,
      meta: match?.sortimen,
    };
  });

  const plankSelectOptions: SelectOption[] = plankIds.map((id) => {
    const match = planks.find((p) => p.id_plank === id);
    const dims =
      match?.panjang && match?.lebar && match?.tinggi
        ? ` · ${match.panjang}×${match.lebar}×${match.tinggi} cm`
        : '';
    return {
      value: id,
      label: id,
      meta: match ? `${match.grade}${dims}` : undefined,
    };
  });

  const updateForm = (patch: Partial<PraDryKilnFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    if (formError) setFormError(null);
  };

  const handleLogChange = (newLogId: string) => {
    const matchedLog = logs.find((l) => l.id_log === newLogId);
    const matchingPlank = planks.find((p) => p.id_log === newLogId);
    updateForm({
      id_log: newLogId,
      ...(matchingPlank
        ? {
            id_plank: matchingPlank.id_plank,
            sortimen:
              matchingPlank.sortimen || matchedLog?.sortimen || formData.sortimen,
            grade: matchingPlank.grade || formData.grade,
            panjang: matchingPlank.panjang || formData.panjang,
            lebar: matchingPlank.lebar || formData.lebar,
            tinggi: matchingPlank.tinggi || formData.tinggi,
          }
        : matchedLog
        ? { sortimen: matchedLog.sortimen || formData.sortimen }
        : {}),
    });
  };

  const handlePlankChange = (newPlankId: string) => {
    const matchedPlank = planks.find((p) => p.id_plank === newPlankId);
    updateForm({
      id_plank: newPlankId,
      ...(matchedPlank
        ? {
            id_log: matchedPlank.id_log || formData.id_log,
            sortimen: matchedPlank.sortimen || formData.sortimen,
            grade: matchedPlank.grade || formData.grade,
            panjang: matchedPlank.panjang || formData.panjang,
            lebar: matchedPlank.lebar || formData.lebar,
            tinggi: matchedPlank.tinggi || formData.tinggi,
          }
        : {}),
    });
  };

  const handleClose = () => {
    setFormError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = firstError(
      required(formData.id_plank, 'ID Plank'),
      maxLength(formData.id_plank, 'ID Plank', 50),
      required(formData.id_log, 'ID Log'),
      maxLength(formData.id_log, 'ID Log', 50),
      positiveNumber(formData.panjang, 'Panjang'),
      positiveNumber(formData.lebar, 'Lebar'),
      positiveNumber(formData.tinggi, 'Tinggi')
    );

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    onSubmit({
      id_plank: formData.id_plank.trim(),
      id_log: formData.id_log.trim(),
      sortimen: formData.sortimen,
      grade: formData.grade,
      panjang: Number(formData.panjang),
      lebar: Number(formData.lebar),
      tinggi: Number(formData.tinggi),
      stage: formData.stage,
    });
    onClose();
  };

  const estimatedVolume =
    ((Number(formData.panjang) || 0) *
      (Number(formData.lebar) || 0) *
      (Number(formData.tinggi) || 0)) /
    1_000_000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/45 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="relative w-full max-w-[580px] p-5 bg-orange-50 rounded-xl border border-stone-200 shadow-2xl flex flex-col gap-3.5 max-h-[92vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex justify-between items-start gap-3 pb-2.5 border-b border-stone-200/90">
          <div>
            <h2 className="text-stone-800 text-lg font-bold tracking-tight">
              {mode === 'input'
                ? 'Input Hasil Pra Dry Kiln'
                : 'Edit Hasil Pra Dry Kiln'}
            </h2>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Pilih log dan plank sumber untuk mengisi sortimen, grade, dan ukuran otomatis.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup modal"
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col gap-4 text-xs"
        >
          {/* Baris 1: ID LOG & ID PLANK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pra-id-log"
                className="text-xs font-semibold text-green-800"
              >
                ID LOG
              </label>
              <ModalSelect
                id="pra-id-log"
                value={formData.id_log}
                options={logSelectOptions}
                onChange={handleLogChange}
                mono
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pra-id-plank"
                className="text-xs font-semibold text-green-800"
              >
                ID PLANK
              </label>
              <ModalSelect
                id="pra-id-plank"
                value={formData.id_plank}
                options={plankSelectOptions}
                onChange={handlePlankChange}
                mono
              />
            </div>
          </div>

          {/* Baris 2: Sortimen & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pra-sortimen"
                className="text-xs font-semibold text-green-800"
              >
                Sortimen
              </label>
              <ModalSelect
                id="pra-sortimen"
                value={formData.sortimen}
                options={SORTIMEN_OPTIONS}
                onChange={(val) => updateForm({ sortimen: val })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pra-grade"
                className="text-xs font-semibold text-green-800"
              >
                Grade
              </label>
              <ModalSelect
                id="pra-grade"
                value={formData.grade}
                options={GRADE_OPTIONS}
                onChange={(val) => updateForm({ grade: val as PlankGrade })}
              />
            </div>
          </div>

          {/* Baris 3: Ukuran (Panjang, Lebar, Tinggi) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-green-800">
                Ukuran Papan
              </span>
              <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-mono">
                Estimasi Volume: {estimatedVolume.toFixed(4)} m³
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="pra-panjang"
                  className="text-[11px] font-medium text-stone-600"
                >
                  Panjang (cm)
                </label>
                <input
                  id="pra-panjang"
                  type="number"
                  required
                  min={0.1}
                  step="any"
                  placeholder="240"
                  value={formData.panjang}
                  onChange={(e) =>
                    updateForm({
                      panjang: e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  className="w-full h-10 px-3 bg-white border border-stone-300 hover:border-green-600/70 rounded-md font-mono text-stone-800 focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="pra-lebar"
                  className="text-[11px] font-medium text-stone-600"
                >
                  Lebar (cm)
                </label>
                <input
                  id="pra-lebar"
                  type="number"
                  required
                  min={0.1}
                  step="any"
                  placeholder="20"
                  value={formData.lebar}
                  onChange={(e) =>
                    updateForm({
                      lebar: e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  className="w-full h-10 px-3 bg-white border border-stone-300 hover:border-green-600/70 rounded-md font-mono text-stone-800 focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="pra-tinggi"
                  className="text-[11px] font-medium text-stone-600"
                >
                  Tinggi (cm)
                </label>
                <input
                  id="pra-tinggi"
                  type="number"
                  required
                  min={0.1}
                  step="any"
                  placeholder="5"
                  value={formData.tinggi}
                  onChange={(e) =>
                    updateForm({
                      tinggi: e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  className="w-full h-10 px-3 bg-white border border-stone-300 hover:border-green-600/70 rounded-md font-mono text-stone-800 focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Baris 4: Status / Stage */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="pra-stage"
              className="text-xs font-semibold text-green-800"
            >
              Status Tahapan
            </label>
            <ModalSelect
              id="pra-stage"
              value={formData.stage}
              options={PRA_STAGE_OPTIONS}
              onChange={(val) => updateForm({ stage: val as PraDryKilnStage })}
              menuPlacement="top"
            />
          </div>

          <FormError message={formError} />

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3.5 mt-0.5 border-t border-stone-200/80">
            <button
              type="button"
              onClick={handleClose}
              className="h-10 px-4 bg-white hover:bg-stone-100 text-stone-700 font-semibold border border-stone-300 rounded-md transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="h-10 px-5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-md flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              {mode === 'input' ? (
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
        </form>
      </div>
    </div>
  );
}
