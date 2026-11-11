'use client';

import React, { useCallback, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Trash2, X } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'success' | 'warning';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface ConfirmModalProps extends ConfirmOptions {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const badgeStyles =
    variant === 'danger'
      ? 'bg-rose-100 text-rose-700 border-rose-200'
      : variant === 'success'
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : 'bg-amber-100 text-amber-700 border-amber-200';

  const buttonStyles =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 text-white'
      : variant === 'success'
      ? 'bg-green-700 hover:bg-green-800 text-white'
      : 'bg-amber-600 hover:bg-amber-700 text-white';

  const Icon =
    variant === 'danger'
      ? Trash2
      : variant === 'success'
      ? CheckCircle2
      : AlertTriangle;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-stone-900/45 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="relative w-full max-w-md p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-300/60">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${badgeStyles}`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-stone-800">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-stone-500 hover:text-stone-900 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-white/90 rounded-[8px] border border-stone-300 text-xs text-stone-700 leading-relaxed">
          {message}
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 px-4 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold rounded transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-9 px-4 text-xs font-bold rounded transition-colors cursor-pointer shadow-2xs ${buttonStyles}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook pembantu untuk memunculkan modal konfirmasi secara deklaratif (`await confirm(...)`)
 * menggantikan `window.confirm(...)` bawaan browser.
 */
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setOptions(null);
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  }, []);

  const handleCancel = useCallback(() => {
    setOptions(null);
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  }, []);

  const ConfirmDialog = options ? (
    <ConfirmModal
      isOpen={true}
      title={options.title}
      message={options.message}
      confirmLabel={options.confirmLabel}
      cancelLabel={options.cancelLabel}
      variant={options.variant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, ConfirmDialog };
}
