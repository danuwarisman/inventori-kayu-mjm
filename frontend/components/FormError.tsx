'use client';

import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message?: string | null;
}

/** Banner error ringkas untuk ditampilkan di dalam form/modal. */
export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="px-3 py-2 bg-red-50 border border-red-200 rounded flex items-start gap-2"
    >
      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
      <span className="text-[11px] text-red-700 font-medium">{message}</span>
    </div>
  );
}
