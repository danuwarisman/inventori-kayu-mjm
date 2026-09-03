'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = 'YAKIN MERUBAH DATA?',
  description = 'Perubahan data ini akan memperbarui status dan kalkulasi pada sistem inventori.',
  confirmLabel = 'Ya, Simpan Perubahan',
  cancelLabel = 'Batal',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  // Tutup dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Box Utama Modal (Sesuai Token Figma: w-[600px] & bg-orange-50) */}
      <div className="relative w-full max-w-[560px] p-6 bg-orange-50 rounded-[12px] border border-stone-300 shadow-2xl flex flex-col items-center gap-4 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Tombol Close Pojok Kanan */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ikon Peringatan */}
        <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-800 flex items-center justify-center mt-2">
          <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
        </div>

        {/* Judul & Subteks */}
        <div className="flex flex-col items-center text-center gap-1.5 px-4">
          <h2 className="text-stone-800 text-2xl font-bold font-sans tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-stone-600 text-xs font-normal max-w-md leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Button Container (Area border hitam di Figma) */}
        <div className="w-full mt-2 p-1.5 rounded-[10px] border border-stone-800/80 bg-white/60 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold font-sans rounded-md border border-stone-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 bg-green-800 hover:bg-green-900 text-white text-xs font-bold font-sans rounded-md transition-all shadow-xs cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}