'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { DryKilnItem } from '@/types/dry-kiln';
import FormError from '@/components/FormError';
import { required } from '@/lib/validation';

interface NewBatchModalProps {
  isOpen: boolean;
  items: DryKilnItem[];
  onClose: () => void;
  onSubmit: (items: DryKilnItem[]) => void;
}

export default function NewBatchModal({ isOpen, items, onClose, onSubmit }: NewBatchModalProps) {
  const pallets = useMemo(() => {
    const groups = new Map<string, DryKilnItem[]>();
    items.forEach((item) => {
      const key = item.idOven ? String(item.idOven) : item.id_log;
      groups.set(key, [...(groups.get(key) ?? []), item]);
    });
    return Array.from(groups.entries()).map(([key, palletItems]) => ({
      key,
      label: `PAL-${key}`,
      items: palletItems,
      thickness: range(palletItems.map((item) => item.tinggi)),
      length: range(palletItems.map((item) => item.panjang)),
      width: range(palletItems.map((item) => item.lebar)),
      grade: palletItems.every((item) => item.grade === palletItems[0].grade)
        ? palletItems[0].grade
        : 'Campuran',
    }));
  }, [items]);
  const [selectedKey, setSelectedKey] = useState('');
  const selected = pallets.find((pallet) => pallet.key === selectedKey);
  const error = required(selectedKey, 'ID Palet');

  if (!isOpen) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    onSubmit(selected.items);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/45 backdrop-blur-xs">
      <div className="w-full max-w-[560px] p-5 bg-orange-50 rounded-xl border border-stone-200 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-stone-200">
          <div><h2 className="text-lg font-bold text-stone-800">New Batch Dry-Kiln</h2><p className="text-[11px] text-stone-500">Pilih palet dari Pra Dry-Kiln.</p></div>
          <button type="button" onClick={onClose} className="p-1 text-stone-500"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="mt-4 p-5 bg-white rounded-xl border border-stone-200 flex flex-col gap-4 text-xs">
          <label className="flex flex-col gap-1.5 font-semibold text-green-800">
            ID PALET
            <div className="relative">
              <select required value={selectedKey} onChange={(event) => setSelectedKey(event.target.value)} className="w-full h-10 px-3 pr-9 bg-white border border-stone-300 rounded-md font-mono text-stone-800 appearance-none focus:outline-none focus:border-green-700">
                <option value="">Pilih palet Pra Dry-Kiln</option>
                {pallets.map((pallet) => <option key={pallet.key} value={pallet.key}>{pallet.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-stone-500 pointer-events-none" />
            </div>
          </label>
          {selected ? <>
            <div><p className="mb-2 text-xs font-semibold text-green-800">Rentang Ukuran Papan</p><div className="grid grid-cols-3 gap-3"><ReadOnly label="Ketebalan" value={selected.thickness} /><ReadOnly label="Panjang" value={selected.length} /><ReadOnly label="Lebar" value={selected.width} /></div></div>
            <ReadOnly label="Grade" value={selected.grade} />
          </> : <p className="text-stone-500">Pilih palet untuk melihat ukuran dan grade otomatis.</p>}
          {error && !selected && <FormError message={error} />}
          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200"><button type="button" onClick={onClose} className="h-10 px-4 border border-stone-300 rounded-md">Batal</button><button type="submit" disabled={!selected} className="h-10 px-5 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold rounded-md flex items-center gap-2"><Check className="w-3.5 h-3.5" />Simpan ke Dry-Kiln</button></div>
        </form>
      </div>
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return <label className="flex flex-col gap-1 text-[11px] font-medium text-stone-600">{label}<span className="h-10 px-3 flex items-center bg-stone-100 border border-stone-300 rounded-md font-mono text-stone-600">{value} cm</span></label>;
}

function range(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `${min} cm` : `${min}–${max} cm`;
}
