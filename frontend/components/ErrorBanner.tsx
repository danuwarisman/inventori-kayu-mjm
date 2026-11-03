'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/** Banner error halaman dengan aksi muat ulang opsional. */
export default function ErrorBanner({
  title = 'Terjadi kesalahan',
  message,
  onRetry,
  retryLabel = 'Coba Lagi',
}: ErrorBannerProps) {
  return (
    <section
      role="alert"
      className="p-4 bg-red-50 border border-red-200 rounded-lg flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-red-800">{title}</span>
          <span className="text-xs text-red-700">{message}</span>
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{retryLabel}</span>
        </button>
      )}
    </section>
  );
}
