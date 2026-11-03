/**
 * Helper validasi form yang dipakai lintas halaman/modal.
 *
 * Semua fungsi mengembalikan pesan error (string) atau null bila valid,
 * sehingga bisa digabung dengan `firstError(...)` untuk menampilkan satu
 * pesan yang paling relevan.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s().-]{7,19}$/;

/** Ambil pesan error pertama yang tidak kosong. */
export function firstError(
  ...messages: Array<string | null | undefined>
): string | null {
  return messages.find((message): message is string => Boolean(message)) ?? null;
}

/** Field wajib diisi (string kosong/spasi dianggap kosong). */
export function required(
  value: string | number | null | undefined,
  label: string
): string | null {
  if (value === null || value === undefined) return `${label} wajib diisi.`;
  if (typeof value === 'string' && value.trim() === '') {
    return `${label} wajib diisi.`;
  }
  return null;
}

/** Batas panjang karakter setelah trim. */
export function maxLength(
  value: string,
  label: string,
  max: number
): string | null {
  return value.trim().length > max
    ? `${label} maksimal ${max} karakter.`
    : null;
}

/** Angka harus terisi dan lebih besar dari 0. */
export function positiveNumber(
  value: string | number | null | undefined,
  label: string
): string | null {
  if (value === '' || value === null || value === undefined) {
    return `${label} wajib diisi.`;
  }

  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number)) return `${label} harus berupa angka.`;
  if (number <= 0) return `${label} harus lebih dari 0.`;
  return null;
}

/** Angka bulat positif (mis. kuantitas pcs). */
export function positiveInteger(
  value: string | number | null | undefined,
  label: string
): string | null {
  const numberError = positiveNumber(value, label);
  if (numberError) return numberError;

  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(number)) {
    return `${label} harus berupa bilangan bulat.`;
  }
  return null;
}

/** Email wajib dan formatnya valid. */
export function email(value: string, label = 'Email'): string | null {
  const requiredError = required(value, label);
  if (requiredError) return requiredError;
  if (!EMAIL_PATTERN.test(value.trim())) {
    return `${label} tidak valid. Contoh: nama@domain.com.`;
  }
  return null;
}

/** Nomor telepon wajib dan hanya berisi karakter yang wajar. */
export function phone(value: string, label = 'Nomor telepon'): string | null {
  const requiredError = required(value, label);
  if (requiredError) return requiredError;
  if (!PHONE_PATTERN.test(value.trim())) {
    return `${label} tidak valid. Gunakan angka, spasi, +, -, atau tanda kurung (8–20 karakter).`;
  }
  return null;
}
