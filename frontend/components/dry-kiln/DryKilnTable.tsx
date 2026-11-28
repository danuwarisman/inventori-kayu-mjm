'use client';

import React, { useMemo, useState } from 'react';
import { Pencil, Inbox, Eye, X } from 'lucide-react';
import { DryKilnItem } from '@/types/dry-kiln';
import { formatDateID } from '@/lib/dates';
import Pagination from '@/components/Pagination';

interface DryKilnTableProps {
  items: DryKilnItem[];
  totalCount: number;
  isManager?: boolean;
  canEdit?: boolean;
  onEdit: (item: DryKilnItem) => void;
}

export default function DryKilnTable({
  items,
  totalCount,
  isManager = false,
  canEdit = false,
  onEdit,
}: DryKilnTableProps) {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [detailItems, setDetailItems] = useState<DryKilnItem[] | null>(null);
  const pallets = useMemo(() => {
    const grouped = new Map<string, DryKilnItem[]>();
    items.forEach((item) => {
      const key = item.id_palet || item.id_log || item.id_plank;
      grouped.set(key, [...(grouped.get(key) ?? []), item]);
    });
    return Array.from(grouped.entries()).map(([key, palletItems]) => ({
      key,
      palletId: palletItems[0].id_palet || `PAL-L-${new Date().getFullYear()}-${String(palletItems[0].idOven || 0).padStart(3, '0')}`,
      items: palletItems,
      totalVolume: palletItems.reduce((sum, item) => sum + item.volume, 0),
      thickness: `${Math.min(...palletItems.map((item) => item.tinggi))}cm-${Math.max(...palletItems.map((item) => item.tinggi))}cm`,
      length: `${Math.min(...palletItems.map((item) => item.panjang))}cm-${Math.max(...palletItems.map((item) => item.panjang))}cm`,
      width: `${Math.min(...palletItems.map((item) => item.lebar))}cm-${Math.max(...palletItems.map((item) => item.lebar))}cm`,
      grade: palletItems.every((item) => item.grade === palletItems[0].grade) ? palletItems[0].grade : 'Campuran',
    }));
  }, [items]);
  const totalPages = Math.max(1, Math.ceil(pallets.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = pallets.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const detail = detailItems ?? [];

  return (
    <>
      <section className="p-4 bg-white rounded-[10px] border border-stone-200 shadow-2xs flex flex-col gap-3 font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-3 text-center">ID PALET</th>
                <th className="py-3 px-3 text-center">KETEBALAN</th>
                <th className="py-3 px-3 text-center">PANJANG</th>
                <th className="py-3 px-3 text-center">LEBAR</th>
                <th className="py-3 px-3 text-center">TOTAL VOLUME</th>
                <th className="py-3 px-3 text-center">GRADE</th>
                <th className="py-3 px-3 text-center">STAGE</th>
                <th className="py-3 px-3 text-center">DETAIL</th>
                {canEdit && <th className="py-3 px-3 text-center w-12">ACTION</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pallets.length === 0 ? (
                <tr>
                  <td colSpan={8 + (canEdit ? 1 : 0)} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                      <Inbox className="w-8 h-8 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-stone-600">Belum ada palet di tahap Dry-Kiln</p>
                      <p className="text-xs text-stone-400">{isManager ? 'Staf lapangan belum memasukkan palet ke proses oven.' : 'Klik tombol "+ New Batch" untuk memasukkan palet ke proses oven.'}</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedItems.map((pallet) => {
                const first = pallet.items[0];
                return (
                  <tr key={pallet.key} className="text-green-700 hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-3 text-center font-mono font-medium whitespace-nowrap">{pallet.palletId}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">{pallet.thickness}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">{pallet.length}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">{pallet.width}</td>
                    <td className="py-3 px-3 text-center font-medium whitespace-nowrap">{pallet.totalVolume.toFixed(3)} m³</td>
                    <td className="py-3 px-3 text-center"><span className="inline-block px-2 py-0.5 border border-green-700 rounded-xs text-[11px] font-semibold">{pallet.grade}</span></td>
                    <td className="py-3 px-3 text-center"><span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">{first.stage}</span></td>
                    <td className="py-3 px-3 text-center"><button type="button" onClick={() => setDetailItems(pallet.items)} className="p-1 text-green-700 hover:bg-green-100/70 rounded inline-flex cursor-pointer" title="Lihat detail palet"><Eye className="w-4 h-4" /></button></td>
                    {canEdit && <td className="py-3 px-3 text-center"><button type="button" onClick={() => onEdit(first)} className="p-1 text-green-700 hover:bg-green-100/70 rounded inline-flex cursor-pointer" title="Edit stage"><Pencil className="w-3.5 h-3.5" /></button></td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={currentPage} pageSize={pageSize} totalItems={pallets.length} totalCount={totalCount} onPageChange={setPage} />
      </section>

      {detailItems && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-[1000px] p-5 bg-orange-50 rounded-[10px] border border-stone-300 shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-stone-300/60"><h2 className="text-stone-800 text-xl font-bold">Detail Palet Dry-Kiln</h2><button type="button" onClick={() => setDetailItems(null)} className="p-1 text-stone-500 hover:text-stone-900"><X className="w-5 h-5" /></button></div>
            <div className="p-4 bg-white/80 rounded-[10px] border border-stone-800/80 text-xs overflow-x-auto">
              <div className="flex flex-col gap-1 mb-4"><label className="font-semibold text-green-700">ID PALET</label><div className="w-full h-10 px-4 flex items-center bg-white border border-stone-900 rounded font-mono font-medium text-green-700">{detail[0]?.id_palet || `PAL-L-${new Date().getFullYear()}-${String(detail[0]?.idOven || 0).padStart(3, '0')}`}</div></div>
              <table className="w-full text-xs text-left"><thead><tr className="border-b border-green-700 text-green-700 font-bold uppercase tracking-wider whitespace-nowrap"><th className="py-2.5 px-2 text-center">ID LOG</th><th className="py-2.5 px-2 text-center">ID PLANK</th><th className="py-2.5 px-2 text-center">DIMENSION</th><th className="py-2.5 px-2 text-center">TOTAL VOLUME</th><th className="py-2.5 px-2 text-center">GRADE</th><th className="py-2.5 px-2 text-center">STAGE</th><th className="py-2.5 px-2 text-center">TANGGAL</th></tr></thead><tbody className="divide-y divide-stone-100">{detail.map((item) => <tr key={item.id_plank} className="text-green-700"><td className="py-2 px-2 text-center font-mono">{item.id_log}</td><td className="py-2 px-2 text-center font-mono">{item.id_plank}</td><td className="py-2 px-2 text-center whitespace-nowrap">{item.tinggi}cm x {item.lebar}cm x {item.panjang}cm</td><td className="py-2 px-2 text-center font-medium">{item.volume.toFixed(3)} m³</td><td className="py-2 px-2 text-center">{item.grade}</td><td className="py-2 px-2 text-center">{item.stage}</td><td className="py-2 px-2 text-center text-stone-600">{formatDateID(item.date)}</td></tr>)}</tbody></table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
