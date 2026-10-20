/**
 * Helper tanggal konsisten untuk seluruh frontend.
 *
 * Konvensi: data tanggal SELALU disimpan dalam format ISO "yyyy-mm-dd",
 * sehingga perbandingan dengan value `<input type="date">` (filter) langsung
 * cocok tanpa parsing. Format tampilan (id-ID) hanya dilakukan saat render.
 */

/** Tanggal hari ini dalam format ISO "yyyy-mm-dd" (zona waktu lokal). */
export function toISODate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format tanggal ISO "yyyy-mm-dd" menjadi tampilan "dd/mm/yyyy" (id-ID). */
export function formatDateID(isoDate: string): string {
  if (!isoDate) return '';
  // Ambil bagian tanggal saja, abaikan komponen waktu bila ada.
  const [y, m, d] = isoDate.slice(0, 10).split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}
