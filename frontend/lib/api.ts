/**
 * API client frontend -> backend NestJS.
 *
 * CATATAN KONTRAK (per skema Prisma backend saat ini):
 * - Baru ada endpoint GET /supplier (bentuk respons mengikuti model `Supplier`).
 * - Field UI seperti kontak_person, harga, kota, status BELUM ada di backend,
 *   jadi mapper mengisinya dengan nilai default ('-' / 0 / 'Active').
 *   Update mapper ini begitu backend menambah field/endpoint.
 */

import { SupplierItem } from '@/types/supplier';
import { LogItem } from '@/types/log';
import { SawmillItem, PlankItem } from '@/types/sawmill';
import { DryKilnItem } from '@/types/dry-kiln';
import { clearSession } from '@/lib/session';

/** Base URL backend, di-set via NEXT_PUBLIC_API_URL (lihat .env.local). */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const DEFAULT_TIMEOUT_MS = 10_000;

/** Error dari API client, membawa status HTTP jika ada. */
export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Ambil pesan error yang siap ditampilkan ke user. */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

/**
 * Pesan standar untuk response 403 Forbidden dari backend.
 * Dipakai sebagai message ApiError sehingga otomatis tampil di
 * banner error halaman (lihat getApiErrorMessage di tiap halaman).
 */
export const FORBIDDEN_MESSAGE =
  'Akses ditolak (403): Anda tidak memiliki izin untuk operasi ini. ' +
  'Hubungi administrator jika Anda merasa ini keliru.';

/** Path yang tidak perlu diprotes saat sesi habis. */
function isAuthLikePath(path: string): boolean {
  return path === '/login' || path === '/';
}

/**
 * Interceptor response 401 Unauthorized:
 * sesi tidak valid/kedaluwarsa -> bersihkan seluruh jejak sesi & state
 * lalu paksa kembali ke halaman login. Dipanggil sekali per request gagal.
 */
function handleUnauthorized(): void {
  clearSession();
  // setTimeout agar redirect tidak memotong render/promise yang sedang jalan.
  setTimeout(() => {
    if (
      typeof window !== 'undefined' &&
      !isAuthLikePath(window.location.pathname)
    ) {
      window.location.replace('/login?reason=expired');
    }
  }, 0);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      // Kirim cookie sesi (HttpOnly dari backend) ke setiap request.
      // Wajib agar auth berbasis cookie bekerja lintas origin (dev).
      credentials: 'include',
      headers: {
        // Content-Type hanya perlu saat ada body (menghindari preflight
        // OPTIONS yang tidak perlu pada request GET)
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
  } catch {
    // network error / timeout / CORS -- backend mati atau belum enable CORS
    throw new ApiError(
      `Tidak bisa menghubungi backend di ${API_BASE_URL}. Pastikan server berjalan dan CORS diizinkan.`
    );
  }

  if (!res.ok) {
    // Interceptor status khusus sebelum error dilempar ke pemanggil.
    // 401: sesi tidak valid -> bersihkan sesi + redirect ke halaman login.
    if (res.status === 401) {
      handleUnauthorized();
      throw new ApiError('Sesi Anda telah berakhir. Silakan login kembali.', 401);
    }
    // 403: login valid tapi tidak berhak. TIDAK me-redirect agar user
    // tidak kehilangan konteks halaman; message ramah tampil di banner
    // error halaman (lihat getApiErrorMessage di tiap halaman).
    if (res.status === 403) {
      throw new ApiError(FORBIDDEN_MESSAGE, 403);
    }
    throw new ApiError(
      `Backend merespons ${res.status} ${res.statusText} untuk ${path}`,
      res.status
    );
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/* ------------------------------------------------------------------ */
/* Bentuk data backend (sesuai schema.prisma)                          */
/* ------------------------------------------------------------------ */

/** Respons GET /supplier sesuai model `Supplier` di schema.prisma. */
export interface BackendSupplier {
  id: number;
  nama: string;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Mapper: backend -> types frontend                                   */
/* ------------------------------------------------------------------ */

/**
 * Petakan `BackendSupplier` ke `SupplierItem` yang dipakai UI.
 * Field tanpa padanan di backend diberi default + komentar di bawah.
 */
export function mapBackendSupplier(b: BackendSupplier): SupplierItem {
  return {
    // simpan id numerik backend untuk keperluan edit/hapus nantinya
    id_backend: b.id,
    id_supplier: `SUP-${String(b.id).padStart(3, '0')}`,
    nama_supplier: b.nama,
    // backend belum punya "contact person"; pakai email sebagai kontak terdekat
    kontak_person: b.email ?? '-',
    no_hp: b.telepon ?? '-',
    // backend belum punya field harga untuk supplier
    harga: 0,
    // backend punya `alamat` (alamat lengkap), UI menyaring per kota
    kota: b.alamat ?? '-',
    // backend belum punya status aktif/nonaktif
    status: 'Active',
  };
}

/* ------------------------------------------------------------------ */
/* Endpoints                                                           */
/* ------------------------------------------------------------------ */

export const supplierApi = {
  /** GET /supplier -> daftar supplier siap pakai di UI. */
  list: async (): Promise<SupplierItem[]> => {
    const data = await request<BackendSupplier[]>('/supplier');
    return (Array.isArray(data) ? data : []).map(mapBackendSupplier);
  },
};

/* ------------------------------------------------------------------ */
/* Log Endpoints                                                       */
/* ------------------------------------------------------------------ */

export const logApi = {
  /** GET /log -> daftar log dengan filter opsional sortimen & stage */
  list: async (filters?: { sortimen?: string; stage?: string }): Promise<LogItem[]> => {
    const params = new URLSearchParams();
    if (filters?.sortimen && filters.sortimen !== 'All Sortimen') params.set('sortimen', filters.sortimen);
    if (filters?.stage && filters.stage !== 'All Stage') params.set('stage', filters.stage);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const data = await request<LogItem[]>(`/log${qs}`);
    return Array.isArray(data) ? data : [];
  },

  /** GET /log/:id -> detail log */
  get: async (id: number): Promise<LogItem> => {
    return request<LogItem>(`/log/${id}`);
  },

  /** POST /log -> simpan log baru permanen ke PostgreSQL */
  create: async (data: Partial<LogItem>): Promise<LogItem> => {
    return request<LogItem>('/log', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** PATCH /log/:id -> perbarui data log di database */
  update: async (id: number, data: Partial<LogItem>): Promise<LogItem> => {
    return request<LogItem>(`/log/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /** DELETE /log/:id -> hapus log dari database */
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/log/${id}`, {
      method: 'DELETE',
    });
  },
};

/* ------------------------------------------------------------------ */
/* Sawmill Endpoints                                                   */
/* ------------------------------------------------------------------ */

export const sawmillApi = {
  /** GET /sawmill -> daftar proses sawmill dan papan potong */
  list: async (filters?: { sortimen?: string; stage?: string }): Promise<SawmillItem[]> => {
    const params = new URLSearchParams();
    if (filters?.sortimen && filters.sortimen !== 'All Sortimen') params.set('sortimen', filters.sortimen);
    if (filters?.stage && filters.stage !== 'All Stage') params.set('stage', filters.stage);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const data = await request<SawmillItem[]>(`/sawmill${qs}`);
    return Array.isArray(data) ? data : [];
  },

  /** GET /sawmill/planks -> daftar seluruh plank dari sawmill */
  listPlanks: async (): Promise<PlankItem[]> => {
    const data = await request<PlankItem[]>('/sawmill/planks');
    return Array.isArray(data) ? data : [];
  },

  /** GET /sawmill/:id -> detail proses sawmill */
  get: async (id: number): Promise<SawmillItem> => {
    return request<SawmillItem>(`/sawmill/${id}`);
  },

  /** POST /sawmill -> simpan batch proses sawmill baru ke database */
  create: async (data: Partial<SawmillItem>): Promise<SawmillItem> => {
    return request<SawmillItem>('/sawmill', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** PATCH /sawmill/:id -> update status proses sawmill */
  update: async (id: number, data: Partial<SawmillItem>): Promise<SawmillItem> => {
    return request<SawmillItem>(`/sawmill/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /** DELETE /sawmill/:id -> hapus proses sawmill */
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/sawmill/${id}`, {
      method: 'DELETE',
    });
  },

  /** POST /sawmill/:id/plank -> tambah hasil potong papan (plank) ke sawmill */
  addPlank: async (idSawmill: number, data: Partial<PlankItem>): Promise<PlankItem> => {
    return request<PlankItem>(`/sawmill/${idSawmill}/plank`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** PATCH /sawmill/plank/:idPlank -> perbarui dimensi/grade papan */
  updatePlank: async (idPlank: number, data: Partial<PlankItem>): Promise<PlankItem> => {
    return request<PlankItem>(`/sawmill/plank/${idPlank}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /** DELETE /sawmill/plank/:idPlank -> hapus plank */
  deletePlank: async (idPlank: number): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/sawmill/plank/${idPlank}`, {
      method: 'DELETE',
    });
  },
};

/* ------------------------------------------------------------------ */
/* Dry Kiln Endpoints                                                  */
/* ------------------------------------------------------------------ */

export const dryKilnApi = {
  /** GET /dry-kiln -> daftar item dalam pengeringan (Dry Kiln) */
  list: async (filters?: {
    sortimen?: string;
    stage?: string;
    date?: string;
  }): Promise<DryKilnItem[]> => {
    const params = new URLSearchParams();
    if (filters?.sortimen && filters.sortimen !== 'All Sortimen') params.set('sortimen', filters.sortimen);
    if (filters?.stage) params.set('stage', filters.stage);
    if (filters?.date) params.set('date', filters.date);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const data = await request<DryKilnItem[]>(`/dry-kiln${qs}`);
    return Array.isArray(data) ? data : [];
  },

  /** GET /dry-kiln/:id -> detail oven */
  get: async (id: number): Promise<DryKilnItem> => {
    return request<DryKilnItem>(`/dry-kiln/${id}`);
  },

  /** POST /dry-kiln -> masukkan kayu/plank ke proses Dry Kiln */
  create: async (data: Partial<DryKilnItem>): Promise<DryKilnItem> => {
    return request<DryKilnItem>('/dry-kiln', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** PATCH /dry-kiln/:id -> perbarui status atau hasil dry kiln */
  update: async (id: number, data: Partial<DryKilnItem>): Promise<DryKilnItem> => {
    return request<DryKilnItem>(`/dry-kiln/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /** DELETE /dry-kiln/:id -> hapus catatan dry kiln */
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/dry-kiln/${id}`, {
      method: 'DELETE',
    });
  },
};

