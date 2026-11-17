'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Check, Plus } from 'lucide-react';
import {
  DryKilnItem,
  DryKilnFormData,
  PlankGrade,
  DryKilnStage,
} from '@/types/dry-kiln';
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

interface DryKilnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<DryKilnItem, 'volume' | 'date'>) => void;
  initialData?: DryKilnItem | null;
  mode: 'input' | 'edit';
  nextBatchIndex: number;
}

export default function DryKilnModal(props: DryKilnModalProps) {
  if (!props.isOpen) return null;
  const formKey = `${props.mode}-${props.initialData?.id_plank ?? 'new'}-${props.nextBatchIndex}`;
  return <DryKilnModalContent key={formKey} {...props} />;
}

function DryKilnModalContent({
  onClose,
  onSubmit,
  initialData,
  mode,
  nextBatchIndex,
}: DryKilnModalProps) {
  const currentYear = new Date().getFullYear();
  const defaultLogId = `L-${currentYear}-3-A-${nextBatchIndex}`;
  const defaultPlankId = `P-${currentYear}-3-A-${nextBatchIndex}`;

  const [formData, setFormData] = useState<DryKilnFormData>(() =>
    initialData && mode === 'edit'
      ? {
          id_log: initialData.id_log,
          id_plank: initialData.id_plank,
          sortimen: initialData.sortimen,
          grade: initialData.grade,
          panjang: initialData.panjang,
          lebar: initialData.lebar,
          tinggi: initialData.tinggi,
          stage: initialData.stage,
        }
      : {
          id_log: defaultLogId,
          id_plank: defaultPlankId,
          sortimen: 'Sortimen A',
          grade: 'Grade A',
          panjang: 240,
          lebar: 20,
          tinggi: 5,
          stage: 'in-drykiln',
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

  const logOptions = Array.from(
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
  const plankOptions = Array.from(
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

  const logLabel = (id: string) => {
    const match = logs.find((l) => l.id_log === id);
    return match ? `${id} (${match.sortimen})` : id;
  };

  const plankLabel = (id: string) => {
    const match = planks.find((p) => p.id_plank === id);
    if (!match) return id;
    const dims =
      match.panjang && match.lebar && match.tinggi
        ? ` · ${match.panjang}×${match.lebar}×${match.tinggi} cm`
        : '';
    return `${id} (${match.grade}${dims})`;
  };

  const updateForm = (patch: Partial<DryKilnFormData>) => {
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
      required(formData.id_log, 'ID Log'),
      maxLength(formData.id_log, 'ID Log', 50),
      required(formData.id_plank, 'ID Plank'),
      maxLength(formData.id_plank, 'ID Plank', 50),
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
      id_log: formData.id_log.trim(),
      id_plank: formData.id_plank.trim(),
      sortimen: formData.sortimen,
      grade: formData.grade,
      panjang: Number(formData.panjang),
      lebar: Number(formData.lebar),
      tinggi: Number(formData.tinggi),
      stage: formData.stage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
          <h2 className="text-stone-800 text-xl font-bold font-sans">
            {mode === 'input' ? 'Input Hasil Dry Kiln' : 'Edit Hasil Dry Kiln'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-stone-500 hover:text-stone-900 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white/80 rounded-[10px] border border-stone-800 flex flex-col gap-3 text-xs"
        >
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">ID LOG</label>
            <div className="relative">
              <select
                required
                value={formData.id_log}
                onChange={(e) => handleLogChange(e.target.value)}
                className="w-full h-10 pl-3 pr-8 bg-white border border-stone-300 rounded font-mono text-green-700 appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
              >
                {logOptions.map((id) => (
                  <option key={id} value={id}>
                    {logLabel(id)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">ID PLANK</label>
            <div className="relative">
              <select
                required
                value={formData.id_plank}
                onChange={(e) => handlePlankChange(e.target.value)}
                className="w-full h-10 pl-3 pr-8 bg-white border border-stone-800 rounded font-mono text-green-700 font-medium appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
              >
                {plankOptions.map((id) => (
                  <option key={id} value={id}>
                    {plankLabel(id)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-green-700">Sortimen</label>
              <div className="relative">
                <select
                  value={formData.sortimen}
                  onChange={(e) => updateForm({ sortimen: e.target.value })}
                  className="w-full h-10 pl-3 pr-8 bg-white border border-stone-300 rounded text-green-700 appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
                >
                  <option value="Sortimen A">Sortimen A</option>
                  <option value="Sortimen B">Sortimen B</option>
                  <option value="Sortimen C">Sortimen C</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-green-700">Grade</label>
              <div className="relative">
                <select
                  value={formData.grade}
                  onChange={(e) =>
                    updateForm({ grade: e.target.value as PlankGrade })
                  }
                  className="w-full h-10 pl-3 pr-8 bg-white border border-stone-800 rounded text-green-700 font-medium appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
                >
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                  <option value="Grade C">Grade C</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-semibold text-green-700">Ukuran</span>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-0.5">
                <label className="text-[11px] text-green-700">Panjang (cm)</label>
                <input
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
                  className="w-full h-9 px-2.5 bg-white border border-stone-800 rounded text-green-700 focus:outline-none focus:border-green-700"
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-[11px] text-green-700">Lebar (cm)</label>
                <input
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
                  className="w-full h-9 px-2.5 bg-white border border-stone-800 rounded text-green-700 focus:outline-none focus:border-green-700"
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-[11px] text-green-700">Tinggi (cm)</label>
                <input
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
                  className="w-full h-9 px-2.5 bg-white border border-stone-800 rounded text-green-700 focus:outline-none focus:border-green-700"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Status Tahapan</label>
            <div className="relative">
              <select
                value={formData.stage}
                onChange={(e) =>
                  updateForm({ stage: e.target.value as DryKilnStage })
                }
                className="w-full h-10 pl-3 pr-8 bg-white border border-stone-300 rounded text-green-700 font-semibold appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
              >
                <option value="in-drykiln">In-Drykiln (Sedang Proses Oven)</option>
                <option value="finish drykiln">Finish Drykiln (Selesai Pengeringan)</option>
                <option value="pra-drykiln">Pra-Drykiln (Persiapan Oven)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          <FormError message={formError} />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="h-10 px-5 bg-green-700 hover:bg-green-800 text-white font-bold rounded flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
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