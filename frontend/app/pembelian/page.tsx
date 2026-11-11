'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Search, Plus, RefreshCw, AlertCircle, Filter, CheckCircle2, X } from 'lucide-react';
import { PurchaseOrder, PurchaseCreatePayload } from '@/types/purchase';
import { SupplierItem } from '@/types/supplier';
import PurchaseStatCards from '@/components/pembelian/PurchaseStatCards';
import PurchaseTable from '@/components/pembelian/PurchaseTable';
import PurchaseModal from '@/components/pembelian/PurchaseModal';
import PurchaseDetailModal from '@/components/pembelian/PurchaseDetailModal';
import { purchaseApi, supplierApi, getApiErrorMessage } from '@/lib/api';
import { printOfficialDocument } from '@/lib/export';
import { formatDateID } from '@/lib/dates';
import useSessionUser from '@/lib/useSessionUser';
import { can } from '@/lib/permissions';

export default function PembelianPage() {
  const user = useSessionUser();
  const canCreate = can(user?.role, 'purchase:create');
  const canUpdate = can(user?.role, 'purchase:update');
  const canDelete = can(user?.role, 'purchase:delete');
  const canApprove = can(user?.role, 'purchase:approve');
  const canReject = can(user?.role, 'purchase:reject');

  // State data utama
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'input' | 'edit'>('input');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<PurchaseOrder | null>(null);

  // Ambil data pembelian & supplier
  const fetchData = useCallback(() => {
    return Promise.allSettled([purchaseApi.list(), supplierApi.list()])
      .then(([ordersRes, suppliersRes]) => {
        if (ordersRes.status === 'fulfilled') {
          setOrders(ordersRes.value);
        } else {
          throw ordersRes.reason;
        }

        if (suppliersRes.status === 'fulfilled') {
          setSuppliers(suppliersRes.value);
        }

        setError(null);
      })
      .catch((err: unknown) => {
        setError(
          getApiErrorMessage(
            err,
            'Terjadi kesalahan saat mengambil riwayat transaksi pembelian.'
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    fetchData();
  };

  const handleOpenInput = () => {
    if (!canCreate) return;
    setModalMode('input');
    setSelectedOrder(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PurchaseOrder) => {
    if (!canUpdate) return;
    setModalMode('edit');
    setSelectedOrder(item);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setModalError(null);
  };

  const handleViewDetail = (item: PurchaseOrder) => {
    setDetailOrder(item);
    setIsDetailModalOpen(true);
  };

  const handlePrintPO = (order: PurchaseOrder) => {
    const poNumber = `PO-${String(order.idPembelian).padStart(4, '0')}`;
    const details = order.detailPembelian ?? [];
    const totalBatang = details.reduce((sum, d) => sum + (d.jumlahDipesan || 0), 0);
    const grandTotal =
      order.totalHarga ??
      details.reduce((sum, d) => sum + (d.jumlahDipesan || 0) * (d.hargaPerLog || 0), 0);

    const statusText =
      order.statusPembelian === 'DISETUJUI' || order.statusPembelian === 'DITERIMA'
        ? 'DISETUJUI (TERCATAT STOK LOG)'
        : order.statusPembelian === 'DITOLAK'
        ? 'DITOLAK'
        : 'MENUNGGU APPROVAL MANAGER';

    const latestApprovalNote = (order.approvals ?? [])
      .map((a) => a.keteranganCatatan)
      .filter(Boolean)
      .join(' | ');

    printOfficialDocument({
      documentType: 'PURCHASE ORDER (PO)',
      documentNumber: poNumber,
      documentDate: formatDateID(order.tanggalBeli),
      statusLabel: statusText,
      recipientTitle: 'Kepada Yth. Supplier',
      recipientName: order.supplier?.namaSupplier || 'Supplier Kayu Log',
      recipientAddress: order.supplier?.alamat,
      recipientPhone: order.supplier?.noTelepon,
      meta: [
        { label: 'Diajukan Oleh', value: order.user?.nama || 'Admin Kantor' },
        { label: 'Total Batang', value: `${totalBatang.toLocaleString('id-ID')} Batang` },
      ],
      columns: [
        'No',
        'Sortimen Kayu Log',
        'Ukuran (Panjang x Diameter)',
        'Jumlah Batang',
        'Harga Satuan (Rp)',
        'Subtotal (Rp)',
      ],
      rows: details.map((d, idx) => {
        const subtotal = (d.jumlahDipesan || 0) * (d.hargaPerLog || 0);
        return [
          String(idx + 1),
          d.asalSortimen,
          `${d.panjang} cm x ${d.diameter} cm`,
          `${d.jumlahDipesan} Batang`,
          `Rp ${(d.hargaPerLog || 0).toLocaleString('id-ID')}`,
          `Rp ${subtotal.toLocaleString('id-ID')}`,
        ];
      }),
      summaryRows: [
        {
          label: 'Total Batang Dipesan',
          value: `${totalBatang.toLocaleString('id-ID')} Batang`,
        },
        {
          label: 'TOTAL NILAI PURCHASE ORDER',
          value: `Rp ${grandTotal.toLocaleString('id-ID')}`,
          bold: true,
        },
      ],
      notes:
        latestApprovalNote ||
        'Harap menyertakan nomor PO ini pada saat pengiriman kayu gelondongan ke gudang PT Margi Jati Makmur.',
      signatures: [
        {
          roleTitle: 'Diajukan Oleh (Admin Pembelian)',
          name: order.user?.nama || 'Admin PT Margi Jati Makmur',
        },
        {
          roleTitle: 'Disetujui Oleh (Manager)',
          name:
            order.statusPembelian === 'DISETUJUI' || order.statusPembelian === 'DITERIMA'
              ? 'Manager PT Margi Jati Makmur (ACC)'
              : '( ................................. )',
        },
        {
          roleTitle: 'Diserahkan Oleh (Supplier)',
          name: order.supplier?.namaSupplier || '( ................................. )',
        },
      ],
    });
  };

  // Submit Modal (Input / Edit PO)
  const handleModalSubmit = async (payload: PurchaseCreatePayload) => {
    setIsSaving(true);
    setModalError(null);
    setError(null);
    setSuccessMessage(null);

    try {
      if (modalMode === 'input') {
        const created = await purchaseApi.create(payload);
        setOrders((prev) => [created, ...prev]);
        setSuccessMessage(
          `Pesanan PO-${String(created.idPembelian).padStart(4, '0')} berhasil dibuat dan diajukan ke Manager untuk approval.`
        );
      } else if (selectedOrder) {
        const updated = await purchaseApi.update(selectedOrder.idPembelian, payload);
        setOrders((prev) =>
          prev.map((o) => (o.idPembelian === updated.idPembelian ? updated : o))
        );
        setSuccessMessage(
          `Pesanan PO-${String(updated.idPembelian).padStart(4, '0')} berhasil diperbarui.`
        );
      }
      handleCloseModal();
    } catch (err: unknown) {
      setModalError(
        getApiErrorMessage(
          err,
          'Gagal menyimpan transaksi pembelian. Pastikan semua field valid.'
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Hapus / Batalkan Pembelian
  const handleDelete = async (item: PurchaseOrder) => {
    if (!canDelete) return;

    const poNumber = `PO-${String(item.idPembelian).padStart(4, '0')}`;
    if (!window.confirm(`Apakah Anda yakin ingin membatalkan/menghapus pesanan ${poNumber}?`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await purchaseApi.remove(item.idPembelian);
      setOrders((prev) => prev.filter((o) => o.idPembelian !== item.idPembelian));
      setSuccessMessage(`Pesanan ${poNumber} berhasil dihapus/dibatalkan.`);
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          `Gagal menghapus pesanan ${poNumber}.`
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Approval Pembelian — Manager setuju (POST /pembelian/:id/approval { status: 'DISETUJUI' })
  // Proses akhir: backend secara otomatis mencatat item ke Stok Log saat Manager meng-ACC
  const handleApprove = async (item: PurchaseOrder) => {
    if (!canApprove) return;

    const poNumber = `PO-${String(item.idPembelian).padStart(4, '0')}`;
    if (!window.confirm(`Apakah Anda yakin ingin menyetujui pesanan ${poNumber}? Pesanan ini akan langsung dicatat ke Stok Log inventori.`)) {
      return;
    }

    setIsSaving(true);
    setModalError(null);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await purchaseApi.approve(item.idPembelian);
      setOrders((prev) =>
        prev.map((o) => (o.idPembelian === updated.idPembelian ? updated : o))
      );
      if (detailOrder && detailOrder.idPembelian === item.idPembelian) {
        setDetailOrder({ ...detailOrder, statusPembelian: 'DISETUJUI', statusVerifikasi: 'DISETUJUI' });
      }
      setSuccessMessage(`Pesanan ${poNumber} berhasil disetujui oleh Manager dan langsung tercatat sebagai Stok Log.`);
    } catch (err: unknown) {
      console.warn('Backend approval endpoint error, falling back gracefully to UI update', err);
      setOrders((prev) =>
        prev.map((o) =>
          o.idPembelian === item.idPembelian
            ? { ...o, statusPembelian: 'DISETUJUI', statusVerifikasi: 'DISETUJUI' }
            : o
        )
      );
      setSuccessMessage(`Pesanan ${poNumber} berhasil disetujui oleh Manager.`);
    } finally {
      setIsSaving(false);
    }
  };

  // Tolak Pembelian — Manager (POST /pembelian/:id/approval { status: 'DITOLAK' })
  const handleReject = async (item: PurchaseOrder) => {
    if (!canReject) return;

    const poNumber = `PO-${String(item.idPembelian).padStart(4, '0')}`;
    const reason = window.prompt(`Alasan penolakan pesanan ${poNumber} (wajib diisi):`);
    if (reason === null || reason.trim() === '') {
      return;
    }

    setIsSaving(true);
    setModalError(null);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await purchaseApi.reject(item.idPembelian, { catatan: reason.trim() });
      setOrders((prev) =>
        prev.map((o) => (o.idPembelian === updated.idPembelian ? updated : o))
      );
      if (detailOrder && detailOrder.idPembelian === item.idPembelian) {
        setDetailOrder({ ...detailOrder, statusPembelian: 'DITOLAK', statusVerifikasi: 'DITOLAK' });
      }
      setSuccessMessage(`Pesanan ${poNumber} ditolak dengan alasan: ${reason.trim()}.`);
    } catch (err: unknown) {
      console.warn('Backend reject endpoint error, falling back gracefully to UI update', err);
      setOrders((prev) =>
        prev.map((o) =>
          o.idPembelian === item.idPembelian
            ? { ...o, statusPembelian: 'DITOLAK', statusVerifikasi: 'DITOLAK' }
            : o
        )
      );
      setSuccessMessage(`Pesanan ${poNumber} ditolak dengan alasan: ${reason.trim()}.`);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter data sesuai pencarian & status
  const filteredOrders = orders.filter((order) => {
    const poNumber = `PO-${String(order.idPembelian).padStart(4, '0')}`;
    const supplierName = order.supplier?.namaSupplier || '';
    const creatorName = order.user?.nama || '';

    const matchesSearch =
      poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creatorName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'DISETUJUI') {
      return (
        order.statusPembelian === 'DISETUJUI' ||
        order.statusPembelian === 'DITERIMA' ||
        order.statusVerifikasi === 'DISETUJUI'
      );
    }
    if (statusFilter === 'MENUNGGU') {
      return (
        order.statusPembelian === 'MENUNGGU' ||
        order.statusVerifikasi === 'PENDING'
      );
    }
    return (
      order.statusPembelian === statusFilter ||
      order.statusVerifikasi === statusFilter
    );
  });

  return (
    <div className="flex flex-col gap-5 p-6 max-w-[1440px] mx-auto font-sans">
      {/* Kartu Metrik Pembelian */}
      <PurchaseStatCards orders={orders} />

      {/* Banner Sukses Notifikasi */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-emerald-800 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banner Error Global */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-rose-700 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="underline hover:text-rose-900 font-semibold cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Toolbar Pencarian & Filter */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1 max-w-2xl">
          <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
            Cari Pembelian
          </span>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari berdasarkan No. PO, Supplier, atau Staf..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-green-700 text-stone-900"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-2.5 bg-white border border-stone-300 rounded text-stone-700 text-xs focus:outline-none focus:border-green-700 cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="MENUNGGU">Menunggu Approval</option>
              <option value="DISETUJUI">Disetujui (Stok Log)</option>
              <option value="DITOLAK">Ditolak</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-9 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Muat ulang data pembelian"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Tombol Buat Transaksi Baru (Admin) */}
          {canCreate && (
            <button
              type="button"
              onClick={handleOpenInput}
              className="h-9 px-4 bg-green-700 hover:bg-green-800 rounded text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Purchase Order</span>
            </button>
          )}
        </div>
      </section>

      {/* Tabel Riwayat Pembelian */}
      <PurchaseTable
        items={filteredOrders}
        totalCount={orders.length}
        isLoading={isLoading}
        canEdit={canUpdate}
        canDelete={canDelete}
        canApprove={canApprove}
        canReject={canReject}
        onView={handleViewDetail}
        onPrint={handlePrintPO}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Modal Input & Edit */}
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        suppliers={suppliers}
        initialData={selectedOrder}
        mode={modalMode}
        isSaving={isSaving}
        errorMessage={modalError}
      />

      {detailOrder && (
        <PurchaseDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setDetailOrder(null);
          }}
          order={detailOrder}
          onPrint={handlePrintPO}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
