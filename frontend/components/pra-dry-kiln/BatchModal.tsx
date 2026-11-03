'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Check, Plus } from 'lucide-react';
import {
  PraDryKilnItem,
  PraDryKilnFormData,
  PlankGrade,
  PraDryKilnStage,
} from '@/types/pra-dry-kiln';
import FormError from '@/components/FormError';
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

export default function BatchModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  nextBatchIndex,
}: BatchModalProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<PraDryKilnFormData>({
    id_plank: '',
    id_log: `L-${currentYear}-3-A-1`,
    sortimen: 'Sortimen A',
    grade: 'Grade A',
    panjang: '',
    lebar: '',
    tinggi: '',
    stage: 'finish pra-drykiln',
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        id_plank: initialData.id_plank,
        id_log: initialData.id_log,
        sortimen: initialData.sortimen,
        grade: initialData.grade,
        panjang: initialData.panjang,
        lebar: initialData.lebar,
        tinggi: initialData.tinggi,
        stage: initialData.stage,
      });
    } else {
      setFormData({
        id_plank: `P-${currentYear}-3-A-${nextBatchIndex}`,
        id_log: `L-${currentYear}-3-A-${nextBatchIndex}`,
        sortimen: 'Sortimen A',
        grade: 'Grade A',
        panjang: 240,
        lebar: 20,
        tinggi: 5,
        stage: 'finish pra-drykiln',
      });
    }
  }, [initialData, mode, isOpen, nextBatchIndex, currentYear]);

  if (!isOpen) return null;

  const updateForm = (patch: Partial<PraDryKilnFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    if (formError) setFormError(null);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="relative w-full max-w-[560px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex justify-between items-center pb-2 border-b border-stone-300/60">
          <h2 className="text-stone-800 text-xl font-bold font-sans">
            {mode === 'input' ? 'Input Hasil Pra dry Kiln' : 'Edit Hasil Pra dry Kiln'}
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
          {/* ID LOG */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">ID LOG</label>
            <input
              type="text"
              required
              maxLength={50}
              value={formData.id_log}
              onChange={(e) => updateForm({ id_log: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-stone-300 rounded font-mono text-green-700 focus:outline-none focus:border-green-700"
            />
          </div>

          {/* ID PLANK */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">ID PLANK</label>
            <input
              type="text"
              required
              maxLength={50}
              value={formData.id_plank}
              onChange={(e) => updateForm({ id_plank: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-stone-800 rounded font-mono text-green-700 font-medium focus:outline-none focus:border-green-700"
            />
          </div>

          {/* Sortimen & Grade */}
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

          {/* Ukuran (Panjang, Lebar, Tinggi) */}
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

          {/* Status / Stage */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-green-700">Status Tahapan</label>
            <div className="relative">
              <select
                value={formData.stage}
                onChange={(e) =>
                  updateForm({ stage: e.target.value as PraDryKilnStage })
                }
                className="w-full h-10 pl-3 pr-8 bg-white border border-stone-300 rounded text-green-700 font-semibold appearance-none focus:outline-none focus:border-green-700 cursor-pointer"
              >
                <option value="finish pra-drykiln">Finish (Selesai Penataan / Sticking)</option>
                <option value="pra-drykiln">In-Process (Proses Penataan Rak)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          <FormError message={formError} />

          {/* Action Button */}
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