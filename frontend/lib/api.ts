/**
 * API client frontend -> backend NestJS.
 *
 * CATATAN KONTRAK (per skema Prisma backend saat ini):
 * - Supplier memakai field camelCase: idSupplier, namaSupplier,
 *   alamatSupplier, kontakSupplier (lihat model `Supplier`).
 * - Endpoint supplier yang tersedia: GET/POST /supplier dan
 *   GET/PATCH/DELETE /supplier/:id.
 */

import { SupplierItem, SupplierFormData } from '@/types/supplier';
import { LogItem } from '@/types/log';
import { SawmillItem, PlankItem } from '@/types/sawmill';
import {
  DryKilnItem,
  HasilDryKilnItem,
  HasilDryKilnPayload,
} from '@/types/dry-kiln';
import {
  BackendCustomer,
  CustomerFormData,
  CustomerItem,
  CustomerPayload,
} from '@/types/customer';
import {
  AccountCreatePayload,
  AccountUpdatePayload,
  AccountUser,
} from '@/types/account';
import {
  SalesCreatePayload,
  SalesDecisionPayload,
  SalesDetail,
  SalesOrder,
  SalesRejectPayload,
} from '@/types/sales';
import {
  PurchaseCreatePayload,
  PurchaseDecisionPayload,
  PurchaseDetail,
  PurchaseOrder,
  PurchaseReceivePayload,
  PurchaseRejectPayload,
} from '@/types/purchase';
import {
  StockAdjustmentPayload,
  StockItem,
  StockMovement,
  StockSummary,
} from '@/types/stock';
import { ReportPeriod, ReportResponse, ReportType } from '@/types/report';
import { DashboardSummary } from '@/types/dashboard';
import {
  PraDryKilnBatch,
  PraDryKilnCreatePayload,
  PraDryKilnUpdatePayload,
} from '@/types/pra-dry-kiln';
import { clearSession, getAccessToken, getCurrentUserId } from '@/lib/session';

/**
 * Base URL backend.
 *
 * Default `/api-proxy` = same-origin lewat rewrite Next.js (lihat
 * next.config.ts), sehingga aplikasi tetap jalan di host/port apa pun
 * (Tailscale, tunnel, localhost). Bisa dioverride lewat NEXT_PUBLIC_API_URL
 * saat build bila ingin menembak backend secara langsung.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api-proxy';

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
  // Jika sedang menggunakan token demo offline (mis. mock presentation),
  // jangan paksa logout saat endpoint live menolak token tiruan tersebut.
  const token = getAccessToken();
  if (token && token.includes('mock-signature')) {
    console.warn('Endpoint backend menolak token demo offline (401), sesi UI tetap dipertahankan.');
    return;
  }

  clearSession();
  setTimeout(() => {
    if (
      typeof window !== 'undefined' &&
      !isAuthLikePath(window.location.pathname)
    ) {
      window.location.replace('/login?reason=expired');
    }
  }, 0);
}

interface RequestOptions {
  /**
   * Jangan jalankan interceptor 401 (clear session + redirect).
   * Dipakai oleh request login: 401 di sana berarti kredensial salah,
   * bukan sesi kedaluwarsa.
   */
  skipAuthRedirect?: boolean;
}

/** Ambil pesan error dari body JSON backend ({ message: string | string[] }). */
async function readBackendMessage(res: Response): Promise<string | null> {
  try {
    const data: unknown = await res.json();
    if (data && typeof data === 'object' && 'message' in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string') return message;
      if (Array.isArray(message)) return message.join(', ');
    }
  } catch {
    // Body bukan JSON (mis. error HTML dari proxy) -> pakai pesan default.
  }
  return null;
}

async function request<T>(
  path: string,
  init?: RequestInit,
  options?: RequestOptions
): Promise<T> {
  const token = getAccessToken();

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      // Kirim cookie (bila backend nanti memakai cookie HttpOnly) ke setiap
      // request lintas origin (dev).
      credentials: 'include',
      headers: {
        // Content-Type hanya perlu saat ada body (menghindari preflight
        // OPTIONS yang tidak perlu pada request GET)
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        // Backend memvalidasi JWT dari header Authorization (Bearer).
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    const backendMessage = await readBackendMessage(res);

    // Interceptor status khusus sebelum error dilempar ke pemanggil.
    // 401: sesi tidak valid -> bersihkan sesi + redirect ke halaman login.
    if (res.status === 401) {
      if (options?.skipAuthRedirect) {
        throw new ApiError(
          backendMessage ?? 'Username atau password salah.',
          401
        );
      }
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
      backendMessage ??
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
  idSupplier: number;
  namaSupplier: string;
  alamatSupplier: string;
  kontakSupplier: string;
}

/* ------------------------------------------------------------------ */
/* Mapper: backend -> types frontend                                   */
/* ------------------------------------------------------------------ */

/** Petakan `BackendSupplier` ke `SupplierItem` yang dipakai UI. */
export function mapBackendSupplier(b: BackendSupplier): SupplierItem {
  return {
    // id numerik backend dipakai untuk endpoint PATCH/DELETE /supplier/:id
    id_backend: b.idSupplier,
    id_supplier: `SUP-${String(b.idSupplier).padStart(3, '0')}`,
    nama_supplier: b.namaSupplier,
    alamat_supplier: b.alamatSupplier,
    kontak_supplier: b.kontakSupplier,
  };
}

/**
 * Ubah form UI ke payload DTO backend (camelCase).
 * Hanya tiga field ini yang diterima CreateSupplierDto/UpdateSupplierDto;
 * ValidationPipe memakai forbidNonWhitelisted, jadi field lain akan ditolak.
 */
function toBackendSupplierPayload(data: SupplierFormData) {
  return {
    namaSupplier: data.nama_supplier,
    alamatSupplier: data.alamat_supplier,
    kontakSupplier: data.kontak_supplier,
  };
}

/* ------------------------------------------------------------------ */
/* Auth Endpoints                                                      */
/* ------------------------------------------------------------------ */

/** User yang dikembalikan `POST /auth/login` (lihat auth.service.ts). */
export interface BackendLoginUser {
  id: number;
  username: string;
  nama: string;
  /** Nama role dari tabel `role`, sudah di-uppercase oleh backend. */
  role: string;
}

/** Respons `POST /auth/login` backend NestJS. */
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: BackendLoginUser;
}

export const authApi = {
  /**
   * POST /auth/login -> tukar username/password dengan JWT.
   * 401 di endpoint ini berarti kredensial salah (bukan sesi habis),
   * jadi interceptor redirect sengaja dilewati.
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    return request<LoginResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      },
      { skipAuthRedirect: true }
    );
  },
};

/* ------------------------------------------------------------------ */
/* Endpoints                                                           */
/* ------------------------------------------------------------------ */

export const supplierApi = {
  /** GET /supplier -> daftar supplier siap pakai di UI. */
  list: async (): Promise<SupplierItem[]> => {
    const data = await request<BackendSupplier[]>('/supplier');
    return (Array.isArray(data) ? data : []).map(mapBackendSupplier);
  },

  /** POST /supplier -> tambah supplier baru (200/201 dari backend). */
  create: async (data: SupplierFormData): Promise<SupplierItem> => {
    const created = await request<BackendSupplier>('/supplier', {
      method: 'POST',
      body: JSON.stringify(toBackendSupplierPayload(data)),
    });
    return mapBackendSupplier(created);
  },

  /** PATCH /supplier/:id -> ubah data supplier. */
  update: async (id: number, data: SupplierFormData): Promise<SupplierItem> => {
    const updated = await request<BackendSupplier>(`/supplier/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toBackendSupplierPayload(data)),
    });
    return mapBackendSupplier(updated);
  },

  /** DELETE /supplier/:id -> hapus supplier. */
  remove: async (id: number): Promise<void> => {
    await request<BackendSupplier>(`/supplier/${id}`, { method: 'DELETE' });
  },
};

/* ------------------------------------------------------------------ */
/* Helper payload                                                      */
/* ------------------------------------------------------------------ */

/**
 * Buang field `undefined`/`null` sebelum body di-JSON-stringify.
 * Backend memakai `whitelist` + `forbidNonWhitelisted`, jadi body harus
 * berisi field DTO saja dan tidak perlu membawa key kosong.
 */
function compactPayload<T extends Record<string, unknown>>(payload: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== null
    )
  ) as Partial<T>;
}

/**
 * Petakan `LogItem` (bentuk UI) ke `CreateLogDto`/`UpdateLogDto` (backend).
 *
 * Perbedaan nama field yang wajib dijembatani:
 * - `sortimen`      -> `asalSortimen`
 * - `volume`        -> `volumeLog`
 * - `tanggal_masuk` -> `tanggalMasuk`
 * - `id_log`        -> `kodeLog`
 */
function toBackendLogPayload(data: Partial<LogItem>) {
  return compactPayload({
    kodeLog: data.kodeLog ?? data.id_log,
    asalSortimen: data.sortimen,
    panjang: data.panjang,
    diameter: data.diameter,
    volumeLog: data.volumeLog ?? data.volume,
    stage: data.stage,
    suplier: data.suplier,
    harga: data.harga,
    tanggalMasuk: data.tanggal_masuk,
  });
}

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
      body: JSON.stringify(toBackendLogPayload(data)),
    });
  },

  /** PATCH /log/:id -> perbarui data log di database */
  update: async (id: number, data: Partial<LogItem>): Promise<LogItem> => {
    return request<LogItem>(`/log/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toBackendLogPayload(data)),
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

/** Respons mentah plank dari endpoint tulis backend (model Prisma). */
interface BackendPlank {
  idPlank: number;
  kodePlank?: string | null;
  gradePapan?: string | null;
  tinggi?: number | string | null;
  lebar?: number | string | null;
  panjang?: number | string | null;
  volumePlank?: number | string | null;
  stage?: string | null;
}

/**
 * Petakan plank backend -> `PlankItem` UI.
 * Endpoint `POST /sawmill/:id/plank` dan `PATCH /sawmill/plank/:id`
 * mengembalikan model Prisma mentah, bukan bentuk `PlankItem`.
 */
function mapBackendPlank(
  b: BackendPlank,
  fallback?: Partial<PlankItem>
): PlankItem {
  return {
    idPlank: b.idPlank,
    id_plank: b.kodePlank || fallback?.id_plank || `P-${b.idPlank}`,
    kodePlank: b.kodePlank ?? undefined,
    sortimen: fallback?.sortimen ?? '',
    tinggi: Number(b.tinggi ?? fallback?.tinggi ?? 0),
    lebar: Number(b.lebar ?? fallback?.lebar ?? 0),
    panjang: Number(b.panjang ?? fallback?.panjang ?? 0),
    volume: Number(b.volumePlank ?? fallback?.volume ?? 0),
    grade: (b.gradePapan ?? fallback?.grade ?? 'Grade A') as PlankItem['grade'],
    stage: b.stage ?? fallback?.stage,
  };
}

/**
 * Petakan `SawmillItem` (bentuk UI) ke `CreateSawmillDto`.
 * `id_sawmill` bukan field DTO; kode tampilan dipetakan ke `kodeSawmill`.
 */
function toBackendSawmillPayload(data: Partial<SawmillItem>) {
  return compactPayload({
    kodeSawmill: data.kodeSawmill ?? data.id_sawmill,
    idLog: data.idLog,
    id_log_asal: data.id_log_asal,
    sortimen: data.sortimen,
    panjang: data.panjang,
    diameter: data.diameter,
    volume_total: data.volume_total,
    stage: data.stage,
    suplier: data.suplier,
    harga: data.harga,
    tanggal: data.tanggal,
    // Nested plank pada CreateSawmillDto dibaca backend dengan nama UI
    // (`id_plank`, `grade`, `volume`), jadi tidak dipetakan ulang di sini.
    planks: data.planks,
  });
}

/**
 * PATCH /sawmill/:id hanya menyimpan `stage`/`statusSawmill` dan
 * `kodeSawmill`; jangan kirim field lain yang tidak dipakai service.
 */
function toBackendSawmillUpdatePayload(data: Partial<SawmillItem>) {
  return compactPayload({
    kodeSawmill: data.kodeSawmill,
    stage: data.stage,
  });
}

/**
 * Petakan `PlankItem` (bentuk UI) ke `CreatePlankDto`.
 * - `id_plank` -> `kodePlank`
 * - `grade`    -> `gradePapan`
 * - `volume`   -> `volumePlank`
 */
function toBackendPlankCreatePayload(data: Partial<PlankItem>) {
  return compactPayload({
    kodePlank: data.kodePlank ?? data.id_plank,
    gradePapan: data.grade,
    tinggi: data.tinggi,
    lebar: data.lebar,
    panjang: data.panjang,
    volumePlank: data.volume,
    stage: data.stage,
    sortimen: data.sortimen,
  });
}

/** Petakan `PlankItem` ke `UpdatePlankDto` (tanpa field di luar DTO). */
function toBackendPlankUpdatePayload(data: Partial<PlankItem>) {
  return compactPayload({
    kodePlank: data.kodePlank ?? data.id_plank,
    gradePapan: data.grade,
    tinggi: data.tinggi,
    lebar: data.lebar,
    panjang: data.panjang,
    volumePlank: data.volume,
    stage: data.stage,
  });
}

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
      body: JSON.stringify(toBackendSawmillPayload(data)),
    });
  },

  /** PATCH /sawmill/:id -> update status proses sawmill */
  update: async (id: number, data: Partial<SawmillItem>): Promise<SawmillItem> => {
    return request<SawmillItem>(`/sawmill/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toBackendSawmillUpdatePayload(data)),
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
    const created = await request<BackendPlank>(`/sawmill/${idSawmill}/plank`, {
      method: 'POST',
      body: JSON.stringify(toBackendPlankCreatePayload(data)),
    });
    return mapBackendPlank(created, data);
  },

  /** PATCH /sawmill/plank/:idPlank -> perbarui dimensi/grade papan */
  updatePlank: async (idPlank: number, data: Partial<PlankItem>): Promise<PlankItem> => {
    const updated = await request<BackendPlank>(`/sawmill/plank/${idPlank}`, {
      method: 'PATCH',
      body: JSON.stringify(toBackendPlankUpdatePayload(data)),
    });
    return mapBackendPlank(updated, data);
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

/* ------------------------------------------------------------------ */
/* Helper umum untuk endpoint baru                                     */
/* ------------------------------------------------------------------ */

/** Koersi nilai Decimal/string dari Prisma menjadi number yang aman. */
function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Bangun query string dari objek filter; nilai kosong dilewati. */
function buildQuery(
  params: Record<string, string | number | undefined | null>
): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Catatan kontrak:
 * Endpoint di bawah ini mengikuti modul backend yang **direncanakan**
 * (lihat roadmap backend B5–B16). Selama modul tersebut belum ada,
 * pemanggilan akan menghasilkan 404 dan pesan error dari `request`.
 */

/* ------------------------------------------------------------------ */
/* Customer Endpoints                                                  */
/* ------------------------------------------------------------------ */

/** Petakan `BackendCustomer` ke `CustomerItem` yang dipakai UI. */
export function mapBackendCustomer(b: BackendCustomer): CustomerItem {
  return {
    id_backend: b.idCustomer,
    id_customer: `CUS-${String(b.idCustomer).padStart(3, '0')}`,
    nama: b.namaCustomer,
    alamat: b.alamatCustomer,
    no_hp: b.kontakCustomer,
    // Model Customer backend belum menyimpan email.
    email: '',
  };
}

/**
 * Petakan `CustomerFormData` ke CreateCustomerDto/UpdateCustomerDto.
 * `email` belum ada di backend, jadi tidak ikut dikirim.
 */
function toBackendCustomerPayload(data: CustomerFormData): CustomerPayload {
  return {
    namaCustomer: data.nama,
    alamatCustomer: data.alamat,
    kontakCustomer: data.no_hp,
  };
}

export const customerApi = {
  /** GET /customers -> daftar customer. */
  list: async (): Promise<CustomerItem[]> => {
    const data = await request<BackendCustomer[]>('/customers');
    return (Array.isArray(data) ? data : []).map(mapBackendCustomer);
  },

  /** GET /customers/:id -> detail customer. */
  get: async (id: number): Promise<CustomerItem> => {
    return mapBackendCustomer(await request<BackendCustomer>(`/customers/${id}`));
  },

  /** POST /customers -> tambah customer. */
  create: async (data: CustomerFormData): Promise<CustomerItem> => {
    const created = await request<BackendCustomer>('/customers', {
      method: 'POST',
      body: JSON.stringify(toBackendCustomerPayload(data)),
    });
    return mapBackendCustomer(created);
  },

  /** PATCH /customers/:id -> ubah data customer. */
  update: async (id: number, data: CustomerFormData): Promise<CustomerItem> => {
    const updated = await request<BackendCustomer>(`/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toBackendCustomerPayload(data)),
    });
    return mapBackendCustomer(updated);
  },

  /** DELETE /customers/:id -> hapus customer (soft delete di backend). */
  remove: async (id: number): Promise<void> => {
    await request<unknown>(`/customers/${id}`, { method: 'DELETE' });
  },
};

/* ------------------------------------------------------------------ */
/* Account Endpoints                                                   */
/* ------------------------------------------------------------------ */

export const accountApi = {
  /** GET /accounts -> daftar user + role (manager-only). */
  list: async (): Promise<AccountUser[]> => {
    const data = await request<AccountUser[]>('/accounts');
    return Array.isArray(data) ? data : [];
  },

  /** GET /accounts/:id -> detail user. */
  get: async (id: number): Promise<AccountUser> => {
    return request<AccountUser>(`/accounts/${id}`);
  },

  /** POST /accounts -> buat user baru. */
  create: async (data: AccountCreatePayload): Promise<AccountUser> => {
    return request<AccountUser>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** PATCH /accounts/:id -> ubah user/password/role. */
  update: async (
    id: number,
    data: AccountUpdatePayload
  ): Promise<AccountUser> => {
    return request<AccountUser>(`/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /** DELETE /accounts/:id -> nonaktifkan/hapus user. */
  remove: async (id: number): Promise<void> => {
    await request<unknown>(`/accounts/${id}`, { method: 'DELETE' });
  },
};

/* ------------------------------------------------------------------ */
/* Sales Endpoints                                                     */
/* ------------------------------------------------------------------ */

function normalizeSalesDetail(detail: SalesDetail): SalesDetail {
  return {
    ...detail,
    kuantitasTerjual: toNumber(detail.kuantitasTerjual),
    hargaSatuan: toNumber(detail.hargaSatuan),
  };
}

/** Normalisasi Decimal + hitung total harga bila backend tidak mengirim. */
function normalizeSalesOrder(order: SalesOrder): SalesOrder {
  const detailPenjualan = (order.detailPenjualan ?? []).map(
    normalizeSalesDetail
  );
  const totalHarga = detailPenjualan.reduce(
    (sum, item) => sum + item.kuantitasTerjual * item.hargaSatuan,
    0
  );

  return {
    ...order,
    detailPenjualan,
    totalHarga: order.totalHarga ?? totalHarga,
  };
}

export const salesApi = {
  /** GET /sales -> daftar transaksi penjualan + detail/approval. */
  list: async (filters?: {
    status?: string;
    verification?: string;
    idCustomer?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<SalesOrder[]> => {
    const qs = buildQuery({
      status: filters?.status,
      verification: filters?.verification,
      idCustomer: filters?.idCustomer,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
    });
    const data = await request<SalesOrder[]>(`/sales${qs}`);
    return (Array.isArray(data) ? data : []).map(normalizeSalesOrder);
  },

  /** GET /sales/:id -> detail transaksi. */
  get: async (id: number): Promise<SalesOrder> => {
    return normalizeSalesOrder(await request<SalesOrder>(`/sales/${id}`));
  },

  /** POST /sales -> buat draft penjualan (status MENUNGGU). */
  create: async (data: SalesCreatePayload): Promise<SalesOrder> => {
    return normalizeSalesOrder(
      await request<SalesOrder>('/sales', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    );
  },

  /** PATCH /sales/:id -> ubah draft yang belum diverifikasi. */
  update: async (
    id: number,
    data: Partial<SalesCreatePayload>
  ): Promise<SalesOrder> => {
    return normalizeSalesOrder(
      await request<SalesOrder>(`/sales/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    );
  },

  /** DELETE /sales/:id -> batalkan/hapus draft. */
  remove: async (id: number): Promise<void> => {
    await request<unknown>(`/sales/${id}`, { method: 'DELETE' });
  },

  /** POST /sales/:id/verify -> verifikasi oleh Admin Kantor. */
  verify: async (
    id: number,
    data?: SalesDecisionPayload
  ): Promise<SalesOrder> => {
    return normalizeSalesOrder(
      await request<SalesOrder>(`/sales/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify(data ?? {}),
      })
    );
  },

  /** POST /sales/:id/approve -> approval akhir oleh Manager. */
  approve: async (
    id: number,
    data?: SalesDecisionPayload
  ): Promise<SalesOrder> => {
    return normalizeSalesOrder(
      await request<SalesOrder>(`/sales/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify(data ?? {}),
      })
    );
  },

  /** POST /sales/:id/reject -> tolak penjualan (alasan wajib). */
  reject: async (id: number, data: SalesRejectPayload): Promise<SalesOrder> => {
    return normalizeSalesOrder(
      await request<SalesOrder>(`/sales/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    );
  },
};

/* ------------------------------------------------------------------ */
/* Purchase Endpoints                                                  */
/* ------------------------------------------------------------------ */

function normalizePurchaseDetail(detail: PurchaseDetail): PurchaseDetail {
  return {
    ...detail,
    panjang: toNumber(detail.panjang),
    diameter: toNumber(detail.diameter),
    jumlahDipesan: toNumber(detail.jumlahDipesan),
    hargaPerLog: toNumber(detail.hargaPerLog),
  };
}

function normalizePurchaseOrder(order: PurchaseOrder): PurchaseOrder {
  const detailPembelian = (order.detailPembelian ?? []).map(
    normalizePurchaseDetail
  );
  const totalHarga = detailPembelian.reduce(
    (sum, item) => sum + item.jumlahDipesan * item.hargaPerLog,
    0
  );

  return {
    ...order,
    detailPembelian,
    totalHarga: order.totalHarga ?? totalHarga,
  };
}

export const purchaseApi = {
  /** GET /pembelian -> daftar transaksi pembelian. */
  list: async (filters?: {
    status?: string;
    verification?: string;
    idSupplier?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PurchaseOrder[]> => {
    const qs = buildQuery({
      status: filters?.status,
      verification: filters?.verification,
      idSupplier: filters?.idSupplier,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
    });
    const data = await request<PurchaseOrder[]>(`/pembelian${qs}`);
    return (Array.isArray(data) ? data : []).map(normalizePurchaseOrder);
  },

  /** GET /pembelian/:id -> detail pembelian. */
  get: async (id: number): Promise<PurchaseOrder> => {
    return normalizePurchaseOrder(
      await request<PurchaseOrder>(`/pembelian/${id}`)
    );
  },

  /** POST /pembelian -> buat draft pembelian. */
  create: async (data: PurchaseCreatePayload): Promise<PurchaseOrder> => {
    const userId = data.idUser ?? getCurrentUserId() ?? 1;
    const payload = {
      idSupplier: Number(data.idSupplier),
      idUser: Number(userId),
      tanggalBeli: data.tanggalBeli,
      detailPembelian: (data.detailPembelian ?? []).map((d) => ({
        asalSortimen: d.asalSortimen,
        panjang: Number(d.panjang),
        diameter: Number(d.diameter),
        dimensiLog: d.dimensiLog || `${d.panjang} x ${d.diameter}`,
        jumlahDipesan: Number(d.jumlahDipesan),
        hargaPerLog: Number(d.hargaPerLog),
      })),
    };
    return normalizePurchaseOrder(
      await request<PurchaseOrder>('/pembelian', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
  },

  /** PATCH /pembelian/:id -> ubah draft pembelian. */
  update: async (
    id: number,
    data: Partial<PurchaseCreatePayload>
  ): Promise<PurchaseOrder> => {
    const payload: Record<string, unknown> = {};
    if (data.idSupplier !== undefined) payload.idSupplier = Number(data.idSupplier);
    if (data.tanggalBeli !== undefined) payload.tanggalBeli = data.tanggalBeli;
    return normalizePurchaseOrder(
      await request<PurchaseOrder>(`/pembelian/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
    );
  },

  /** DELETE /pembelian/:id -> batalkan/hapus draft. */
  remove: async (id: number): Promise<void> => {
    await request<unknown>(`/pembelian/${id}`, { method: 'DELETE' });
  },

  /** POST /pembelian/:id/approval -> approval oleh Manager (status: DISETUJUI -> langsung menjadi Stok Log). */
  approve: async (
    id: number,
    data?: PurchaseDecisionPayload
  ): Promise<PurchaseOrder> => {
    return normalizePurchaseOrder(
      await request<PurchaseOrder>(`/pembelian/${id}/approval`, {
        method: 'POST',
        body: JSON.stringify({
          status: 'DISETUJUI',
          ...(data?.catatan ? { keteranganCatatan: data.catatan } : {}),
        }),
      })
    );
  },

  /** POST /pembelian/:id/approval -> tolak pembelian oleh Manager (status: DITOLAK). */
  reject: async (
    id: number,
    data: PurchaseRejectPayload
  ): Promise<PurchaseOrder> => {
    return normalizePurchaseOrder(
      await request<PurchaseOrder>(`/pembelian/${id}/approval`, {
        method: 'POST',
        body: JSON.stringify({
          status: 'DITOLAK',
          keteranganCatatan: data.catatan,
        }),
      })
    );
  },

  /** Verifikasi kompatibilitas (diarahkan ke approval) */
  verify: async (
    id: number,
    data?: PurchaseDecisionPayload
  ): Promise<PurchaseOrder> => {
    return purchaseApi.approve(id, data);
  },

  /** Terima kompatibilitas (mengembalikan detail terkini) */
  receive: async (
    id: number,
    _data?: PurchaseReceivePayload
  ): Promise<PurchaseOrder> => {
    return purchaseApi.detail(id);
  },
};

/* ------------------------------------------------------------------ */
/* Stock Endpoints                                                     */
/* ------------------------------------------------------------------ */

function normalizeStockItem(item: StockItem): StockItem {
  return {
    ...item,
    panjang: toNumber(item.panjang),
    lebar: toNumber(item.lebar),
    tinggi: toNumber(item.tinggi),
    volume: toNumber(item.volume),
  };
}

function normalizeStockSummary(summary: StockSummary): StockSummary {
  return {
    totalPlank: toNumber(summary.totalPlank),
    totalVolume: toNumber(summary.totalVolume),
    totalReadyToSale: toNumber(summary.totalReadyToSale),
    totalInDryKiln: toNumber(summary.totalInDryKiln),
    byStage: (summary.byStage ?? []).map((group) => ({
      ...group,
      totalPlank: toNumber(group.totalPlank),
      totalVolume: toNumber(group.totalVolume),
    })),
    byGrade: (summary.byGrade ?? []).map((group) => ({
      ...group,
      totalPlank: toNumber(group.totalPlank),
      totalVolume: toNumber(group.totalVolume),
    })),
  };
}

export const stockApi = {
  /** GET /stock -> daftar stok papan. */
  list: async (filters?: {
    stage?: string;
    grade?: string;
    sortimen?: string;
  }): Promise<StockItem[]> => {
    const qs = buildQuery({
      stage: filters?.stage,
      grade: filters?.grade,
      sortimen: filters?.sortimen,
    });
    const data = await request<StockItem[]>(`/stock${qs}`);
    return (Array.isArray(data) ? data : []).map(normalizeStockItem);
  },

  /** GET /stock/summary -> agregasi stok per stage/grade. */
  summary: async (): Promise<StockSummary> => {
    return normalizeStockSummary(
      await request<StockSummary>('/stock/summary')
    );
  },

  /** GET /stock/movements -> riwayat pergerakan stok. */
  movements: async (filters?: {
    idPlank?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<StockMovement[]> => {
    const qs = buildQuery({
      idPlank: filters?.idPlank,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
    });
    const data = await request<StockMovement[]>(`/stock/movements${qs}`);
    return Array.isArray(data) ? data : [];
  },

  /** POST /stock/adjustments -> penyesuaian stok manual. */
  adjust: async (data: StockAdjustmentPayload): Promise<StockItem> => {
    return normalizeStockItem(
      await request<StockItem>('/stock/adjustments', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    );
  },
};

/* ------------------------------------------------------------------ */
/* Pra Dry Kiln Endpoints                                              */
/* ------------------------------------------------------------------ */

function normalizePraDryKilnBatch(batch: PraDryKilnBatch): PraDryKilnBatch {
  return {
    ...batch,
    planks: (batch.planks ?? []).map((plank) => ({
      ...plank,
      volumePlank: toNumber(plank.volumePlank),
    })),
  };
}

export const praDryKilnApi = {
  /** GET /pra-dry-kiln -> daftar palet/stacking. */
  list: async (filters?: { status?: string }): Promise<PraDryKilnBatch[]> => {
    const qs = buildQuery({ status: filters?.status });
    const data = await request<PraDryKilnBatch[]>(`/pra-dry-kiln${qs}`);
    return (Array.isArray(data) ? data : []).map(normalizePraDryKilnBatch);
  },

  /** GET /pra-dry-kiln/:id -> detail palet. */
  get: async (id: number): Promise<PraDryKilnBatch> => {
    return normalizePraDryKilnBatch(
      await request<PraDryKilnBatch>(`/pra-dry-kiln/${id}`)
    );
  },

  /** POST /pra-dry-kiln -> buat palet dan lampirkan plank. */
  create: async (
    data: PraDryKilnCreatePayload
  ): Promise<PraDryKilnBatch> => {
    return normalizePraDryKilnBatch(
      await request<PraDryKilnBatch>('/pra-dry-kiln', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    );
  },

  /** PATCH /pra-dry-kiln/:id -> ubah tanggal/status palet. */
  update: async (
    id: number,
    data: PraDryKilnUpdatePayload
  ): Promise<PraDryKilnBatch> => {
    return normalizePraDryKilnBatch(
      await request<PraDryKilnBatch>(`/pra-dry-kiln/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    );
  },

  /** DELETE /pra-dry-kiln/:id -> hapus palet. */
  remove: async (id: number): Promise<void> => {
    await request<unknown>(`/pra-dry-kiln/${id}`, { method: 'DELETE' });
  },

  /** POST /pra-dry-kiln/:id/planks -> tambah plank ke palet. */
  addPlank: async (
    idPalet: number,
    idPlank: number
  ): Promise<PraDryKilnBatch> => {
    return normalizePraDryKilnBatch(
      await request<PraDryKilnBatch>(`/pra-dry-kiln/${idPalet}/planks`, {
        method: 'POST',
        body: JSON.stringify({ idPlank }),
      })
    );
  },

  /** DELETE /pra-dry-kiln/:id/planks/:idPlank -> keluarkan plank. */
  removePlank: async (idPalet: number, idPlank: number): Promise<void> => {
    await request<unknown>(`/pra-dry-kiln/${idPalet}/planks/${idPlank}`, {
      method: 'DELETE',
    });
  },
};

/* ------------------------------------------------------------------ */
/* Hasil Dry Kiln Endpoints                                            */
/* ------------------------------------------------------------------ */

function normalizeHasilDryKiln(item: HasilDryKilnItem): HasilDryKilnItem {
  return {
    ...item,
    volumeAkhir: toNumber(item.volumeAkhir),
    kadarAirAkhir: toNumber(item.kadarAirAkhir),
  };
}

export const hasilDryKilnApi = {
  /** GET /dry-kiln/:idOven/hasil -> daftar hasil oven. */
  list: async (idOven: number): Promise<HasilDryKilnItem[]> => {
    const data = await request<HasilDryKilnItem[]>(
      `/dry-kiln/${idOven}/hasil`
    );
    return (Array.isArray(data) ? data : []).map(normalizeHasilDryKiln);
  },

  /** POST /dry-kiln/:idOven/hasil -> catat hasil oven. */
  create: async (
    idOven: number,
    data: HasilDryKilnPayload
  ): Promise<HasilDryKilnItem> => {
    return normalizeHasilDryKiln(
      await request<HasilDryKilnItem>(`/dry-kiln/${idOven}/hasil`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    );
  },

  /** PATCH /dry-kiln/:idOven/hasil/:idHasil -> ubah hasil oven. */
  update: async (
    idOven: number,
    idHasil: number,
    data: Partial<HasilDryKilnPayload>
  ): Promise<HasilDryKilnItem> => {
    return normalizeHasilDryKiln(
      await request<HasilDryKilnItem>(
        `/dry-kiln/${idOven}/hasil/${idHasil}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      )
    );
  },

  /** DELETE /dry-kiln/:idOven/hasil/:idHasil -> hapus hasil oven. */
  remove: async (idOven: number, idHasil: number): Promise<void> => {
    await request<unknown>(`/dry-kiln/${idOven}/hasil/${idHasil}`, {
      method: 'DELETE',
    });
  },
};

/* ------------------------------------------------------------------ */
/* Dashboard Endpoint                                                  */
/* ------------------------------------------------------------------ */

const EMPTY_DASHBOARD: DashboardSummary = {
  production: {
    totalLog: 0,
    totalSawmill: 0,
    totalPlank: 0,
    totalDryKiln: 0,
    totalReadyToSale: 0,
  },
  finance: {
    totalRevenue: 0,
    netProfit: 0,
    totalExpenses: 0,
    totalTransactions: 0,
    pendingInvoices: 0,
    accountsReceivable: 0,
  },
  activities: [],
  stockAlerts: [],
  generatedAt: '',
};

function normalizeDashboard(
  data: Partial<DashboardSummary> | null | undefined
): DashboardSummary {
  return {
    production: {
      ...EMPTY_DASHBOARD.production,
      ...(data?.production ?? {}),
    },
    finance: {
      ...EMPTY_DASHBOARD.finance,
      ...(data?.finance ?? {}),
    },
    activities: Array.isArray(data?.activities) ? data.activities : [],
    stockAlerts: Array.isArray(data?.stockAlerts) ? data.stockAlerts : [],
    generatedAt: data?.generatedAt ?? new Date().toISOString(),
  };
}

export const dashboardApi = {
  /** GET /dashboard -> ringkasan sesuai role pemanggil. */
  get: async (): Promise<DashboardSummary> => {
    return normalizeDashboard(
      await request<Partial<DashboardSummary>>('/dashboard')
    );
  },
};

/* ------------------------------------------------------------------ */
/* Report Endpoints                                                    */
/* ------------------------------------------------------------------ */

export const reportApi = {
  /** GET /report/:type -> data laporan siap dirender/diexport. */
  get: async (
    type: ReportType,
    period?: ReportPeriod
  ): Promise<ReportResponse> => {
    const qs = buildQuery({
      startDate: period?.startDate,
      endDate: period?.endDate,
    });
    const data = await request<ReportResponse>(`/report/${type}${qs}`);
    return {
      ...data,
      columns: Array.isArray(data.columns) ? data.columns : [],
      rows: Array.isArray(data.rows) ? data.rows : [],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Health Endpoint                                                     */
/* ------------------------------------------------------------------ */

export type HealthStatus = 'ok' | 'degraded' | 'error';

export interface HealthResponse {
  status: HealthStatus;
  database?: 'up' | 'down' | 'unknown';
  timestamp?: string;
}

export const healthApi = {
  /**
   * GET /health -> status backend + database.
   * `skipAuthRedirect` agar health check tidak memicu logout saat sesi kosong.
   */
  check: async (): Promise<HealthResponse> => {
    return request<HealthResponse>('/health', undefined, {
      skipAuthRedirect: true,
    });
  },
};

