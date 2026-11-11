'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { SalesItem } from '@/types/sales';
import SalesStatCards from '@/components/sales/SalesStatCards';
import SalesTable from '@/components/sales/SalesTable';
import SalesModal from '@/components/sales/SalesModal';
import useSessionUser from '@/lib/useSessionUser';
import { can } from '@/lib/permissions';
import { printOfficialDocument } from '@/lib/export';
import { formatDateID } from '@/lib/dates';

const SALES_STORAGE_KEY = 'mjm_sales_records_v1';

// Data transaksi penjualan aktif (Sample Data)
export const INITIAL_SALES: SalesItem[] = [
  {
    id_transaksi: 'TR-2026-001',
    tanggal: '2026-11-04',
    nama_customer: 'CV Mebel Sentosa',
    kuantitas: 80,
    harga_satuan: 450000,
    total_harga: 36000000,
    status: 'Approved',
    catatan_approval: 'Disetujui oleh Manager MJM',
  },
  {
    id_transaksi: 'TR-2026-002',
    tanggal: '2026-11-05',
    nama_customer: 'PT Furnitur Jati Indah Abadi',
    kuantitas: 150,
    harga_satuan: 520000,
    total_harga: 78000000,
    status: 'Approved',
    catatan_approval: 'PO sesuai spesifikasi ekspor Grade A',
  },
  {
    id_transaksi: 'TR-2026-003',
    tanggal: '2026-11-06',
    nama_customer: 'PT Kreasi Interior Nusantara',
    kuantitas: 60,
    harga_satuan: 380000,
    total_harga: 22800000,
    status: 'Pending',
  },
  {
    id_transaksi: 'TR-2026-004',
    tanggal: '2026-11-06',
    nama_customer: 'Toko Kayu Sumber Rejeki',
    kuantitas: 45,
    harga_satuan: 320000,
    total_harga: 14400000,
    status: 'Pending',
  },
  {
    id_transaksi: 'TR-2026-005',
    tanggal: '2026-11-07',
    nama_customer: 'CV Estetika Kayu Ekspor',
    kuantitas: 200,
    harga_satuan: 550000,
    total_harga: 110000000,
    status: 'Approved',
    catatan_approval: 'Pesanan partai besar batch oven November',
  },
  {
    id_transaksi: 'TR-2026-006',
    tanggal: '2026-11-07',
    nama_customer: 'UD Karya Mandiri Furniture',
    kuantitas: 70,
    harga_satuan: 290000,
    total_harga: 20300000,
    status: 'Pending',
  },
  {
    id_transaksi: 'TR-2026-007',
    tanggal: '2026-11-07',
    nama_customer: 'PT Griya Jati Perkasa',
    kuantitas: 110,
    harga_satuan: 480000,
    total_harga: 52800000,
    status: 'Approved',
    catatan_approval: 'Pengiriman dijadwalkan via kontainer Bali',
  },
];

export default function SalesPage() {
  // Admin Lapangan membuat pesanan; Manager menyetujui/menolak.
  const user = useSessionUser();
  const canCreate = can(user?.role, 'sales:create');
  const canApprove = can(user?.role, 'sales:approve');

  // State data transaksi
  const [sales, setSales] = useState<SalesItem[]>(INITIAL_SALES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SALES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SalesItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSales(parsed);
        }
      }
    } catch {
      // Abaikan bila localStorage tidak tersedia
    }
  }, []);

  const persistSales = (updater: (prev: SalesItem[]) => SalesItem[]) => {
    setSales((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Abaikan bila gagal menulis ke localStorage
      }
      return next;
    });
  };

  const handleOpenModal = () => {
    if (!canCreate) return;
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: Omit<SalesItem, 'total_harga'>) => {
    if (!canCreate) return;
    const total = data.kuantitas * data.harga_satuan;
    const newItem: SalesItem = {
      ...data,
      total_harga: total,
    };
    persistSales((prev) => [newItem, ...prev]);
  };

  // Handler Approval Manager (FR-013 & UC-08)
  const handleApprove = (id: string) => {
    if (!canApprove) return;
    persistSales((prev) =>
      prev.map((item) =>
        item.id_transaksi === id
          ? {
              ...item,
              status: 'Approved',
              catatan_approval:
                item.catatan_approval || 'Disetujui oleh Manager PT Margi Jati Makmur',
            }
          : item
      )
    );
  };

  const handleReject = (id: string) => {
    if (!canApprove) return;
    const reason = window.prompt('Masukkan alasan penolakan pesanan penjualan:');
    if (reason !== null) {
      persistSales((prev) =>
        prev.map((item) =>
          item.id_transaksi === id
            ? { ...item, status: 'Rejected', catatan_approval: reason }
            : item
        )
      );
    }
  };

  const handlePrintInvoice = (item: SalesItem) => {
    const statusLabel =
      item.status === 'Approved'
        ? 'DISETUJUI (LUNAS / TERVERIFIKASI)'
        : item.status === 'Rejected'
        ? 'DITOLAK'
        : 'MENUNGGU PERSETUJUAN MANAGER';

    printOfficialDocument({
      documentType: 'INVOICE PENJUALAN',
      documentNumber: `INV/${item.id_transaksi}`,
      documentDate: formatDateID(item.tanggal),
      statusLabel,
      recipientTitle: 'Kepada Yth. Pelanggan / Customer',
      recipientName: item.nama_customer,
      meta: [
        { label: 'No. Transaksi', value: item.id_transaksi },
        { label: 'Total Kuantitas', value: `${item.kuantitas.toLocaleString('id-ID')} pcs` },
      ],
      columns: [
        'No',
        'Deskripsi Produk Kayu Olahan',
        'Kuantitas',
        'Harga Satuan (Rp)',
        'Subtotal (Rp)',
      ],
      rows: [
        [
          '1',
          `Papan Kayu Jati Olahan (Finish Dry-Kiln) - Batch ${item.id_transaksi}`,
          `${item.kuantitas.toLocaleString('id-ID')} pcs`,
          `Rp ${item.harga_satuan.toLocaleString('id-ID')}`,
          `Rp ${item.total_harga.toLocaleString('id-ID')}`,
        ],
      ],
      summaryRows: [
        {
          label: 'TOTAL TAGIHAN INVOICE',
          value: `Rp ${item.total_harga.toLocaleString('id-ID')}`,
          bold: true,
        },
      ],
      notes:
        item.catatan_approval ||
        'Pembayaran dapat ditransfer melalui rekening resmi PT Margi Jati Makmur dengan mencantumkan nomor Invoice.',
      signatures: [
        {
          roleTitle: 'Dibuat Oleh (Admin Penjualan)',
          name: 'Admin PT Margi Jati Makmur',
        },
        {
          roleTitle: 'Disetujui Oleh (Manager)',
          name:
            item.status === 'Approved'
              ? 'Manager PT Margi Jati Makmur (ACC)'
              : '( ................................. )',
        },
        {
          roleTitle: 'Penerima / Customer',
          name: item.nama_customer,
        },
      ],
    });
  };

  const handlePrintSuratJalan = (item: SalesItem) => {
    const statusLabel =
      item.status === 'Approved'
        ? 'SIAP KIRIM (APPROVED MANAGER)'
        : item.status === 'Rejected'
        ? 'DIBATALKAN / DITOLAK'
        : 'DRAFT MENUNGGU APPROVAL';

    printOfficialDocument({
      documentType: 'SURAT JALAN',
      documentNumber: `SJ/${item.id_transaksi}`,
      documentDate: formatDateID(item.tanggal),
      statusLabel,
      recipientTitle: 'Tujuan Pengiriman (Customer)',
      recipientName: item.nama_customer,
      meta: [
        { label: 'Ref. Transaksi', value: item.id_transaksi },
        { label: 'Total Barang', value: `${item.kuantitas.toLocaleString('id-ID')} pcs` },
      ],
      columns: [
        'No',
        'Nama Barang / Spesifikasi Kayu',
        'Jumlah Dikirim',
        'Satuan',
        'Keterangan Pemeriksaan Gudang',
      ],
      rows: [
        [
          '1',
          `Kayu Papan Olahan KD (Ref: ${item.id_transaksi})`,
          item.kuantitas.toLocaleString('id-ID'),
          'Pcs / Lembar',
          item.catatan_approval || 'Kondisi baik, siap muat armada',
        ],
      ],
      summaryRows: [
        {
          label: 'TOTAL KUANTITAS PENGIRIMAN',
          value: `${item.kuantitas.toLocaleString('id-ID')} Pcs`,
          bold: true,
        },
      ],
      notes:
        'Barang telah diperiksa dalam kondisi baik dan cukup sebelum meninggalkan gudang PT Margi Jati Makmur.',
      signatures: [
        {
          roleTitle: 'Diserahkan Oleh (Bag. Gudang)',
          name: 'Admin Lapangan MJM',
        },
        {
          roleTitle: 'Mengetahui (Manager Operasional)',
          name:
            item.status === 'Approved'
              ? 'Manager PT Margi Jati Makmur'
              : '( ................................. )',
        },
        {
          roleTitle: 'Diterima Oleh (Customer / Ekspedisi)',
          name: item.nama_customer,
        },
      ],
    });
  };

  const filteredSales = sales.filter((item) => {
    const matchesQuery =
      item.id_transaksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Status' || item.status === statusFilter;
    const matchesDate = !dateFilter || item.tanggal === dateFilter;

    return matchesQuery && matchesStatus && matchesDate;
  });

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1440px] mx-auto font-sans">
      {/* 1. Stat Cards (Metrik Ringkasan Status) */}
      <SalesStatCards items={sales} />

      {/* 2. Filter & Action Toolbar */}
      <section className="p-4 bg-white rounded-lg border border-stone-300 flex flex-wrap justify-between items-center gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ID / Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-green-700 text-stone-900"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pr-8 pl-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 tracking-tight whitespace-nowrap">
              Date:
            </span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 text-xs text-green-700 font-medium bg-white rounded border border-stone-300 focus:outline-none focus:border-green-700"
            />
          </div>
        </div>

        {/* Action Button: Add Sales (Admin Lapangan) */}
        {canCreate && (
          <button
            type="button"
            onClick={handleOpenModal}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sales</span>
          </button>
        )}
      </section>

      {/* 3. Main Sales Table */}
      <SalesTable
        items={filteredSales}
        totalCount={sales.length}
        canCreate={canCreate}
        canApprove={canApprove}
        onApprove={handleApprove}
        onReject={handleReject}
        onPrintInvoice={handlePrintInvoice}
        onPrintSuratJalan={handlePrintSuratJalan}
      />

      {/* 4. Modal Add New Sale */}
      <SalesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        nextIndex={sales.length + 1}
      />
    </div>
  );
}
