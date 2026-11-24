'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { DryKilnItem, DryKilnStage } from '@/types/dry-kiln';

interface Props {
  item: DryKilnItem;
  onClose: () => void;
  onSave: (stage: DryKilnStage) => void;
}

const stages: { value: DryKilnStage; label: string }[] = [
  { value: 'in-drykiln', label: 'In-Drykiln' },
  { value: 'finish drykiln', label: 'Finish Drykiln' },
];

export default function StageEditModal({ item, onClose, onSave }: Props) {
  const [stage, setStage] = useState<DryKilnStage>(item.stage);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="w-full max-w-sm p-5 bg-orange-50 rounded-xl border border-stone-300 shadow-xl">
        <div className="flex justify-between items-center pb-3 border-b border-stone-300">
          <h2 className="text-lg font-bold text-stone-800">Edit Stage Dry-Kiln</h2>
          <button type="button" onClick={onClose} className="p-1 text-stone-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="mt-4 flex flex-col gap-1.5 text-xs">
          <span className="font-semibold text-green-800">ID Palet</span>
          <span className="h-10 px-3 flex items-center bg-stone-100 border border-stone-300 rounded-md font-mono text-stone-600">PAL-{item.id_log}</span>
          <label className="mt-3 flex flex-col gap-1.5 font-semibold text-green-800">Stage
            <select value={stage} onChange={(e) => setStage(e.target.value as DryKilnStage)} className="h-10 px-3 bg-white border border-stone-300 rounded-md font-normal text-stone-800">
              {stages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-stone-300">
          <button type="button" onClick={onClose} className="h-10 px-4 border border-stone-300 rounded-md">Batal</button>
          <button type="button" onClick={() => onSave(stage)} className="h-10 px-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-md flex items-center gap-2"><Check className="w-3.5 h-3.5" />Simpan</button>
        </div>
      </div>
    </div>
  );
}
