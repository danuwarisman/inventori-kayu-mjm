'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { PlankGrade, PraDryKilnBatchFormData, PraDryKilnStage } from '@/types/pra-dry-kiln';
import FormError from '@/components/FormError';
import { firstError, maxLength, positiveNumber, required } from '@/lib/validation';

interface NewBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PraDryKilnBatchFormData) => void;
}

const grades: PlankGrade[] = ['Grade A', 'Grade B', 'Grade C'];

export default function NewBatchModal({ isOpen, onClose, onSubmit }: NewBatchModalProps) {
  const [idPalet, setIdPalet] = useState('');
  const [grade, setGrade] = useState<PlankGrade>('Grade A');
  const [values, setValues] = useState({
    ketebalanMin: '', ketebalanMax: '', panjangMin: '', panjangMax: '', lebarMin: '', lebarMax: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const year = new Date().getFullYear();
    const generatedId = `PAL-L-${year}-${String(Date.now()).slice(-4)}`;
    setIdPalet(generatedId);
    setError(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const number = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = firstError(
      required(idPalet, 'ID Palet'), maxLength(idPalet, 'ID Palet', 50),
      positiveNumber(values.ketebalanMin, 'Ketebalan minimum'), positiveNumber(values.ketebalanMax, 'Ketebalan maksimum'),
      positiveNumber(values.panjangMin, 'Panjang minimum'), positiveNumber(values.panjangMax, 'Panjang maksimum'),
      positiveNumber(values.lebarMin, 'Lebar minimum'), positiveNumber(values.lebarMax, 'Lebar maksimum')
    );
    if (validationError) { setError(validationError); return; }
    onSubmit({
      id_palet: idPalet.trim(),
      ketebalan_min: Number(values.ketebalanMin), ketebalan_max: Number(values.ketebalanMax),
      panjang_min: Number(values.panjangMin), panjang_max: Number(values.panjangMax),
      lebar_min: Number(values.lebarMin), lebar_max: Number(values.lebarMax),
      grade, stage: 'pra-drykiln' as PraDryKilnStage,
    });
    onClose();
  };

  const field = (label: string, key: keyof typeof values, placeholder: string) => (
    <label className="flex flex-col gap-1 text-[11px] font-medium text-stone-600">
      {label}
      <input type="number" min={0.1} step="any" required value={values[key]} onChange={number(key)} placeholder={placeholder} className="h-10 px-3 bg-white border border-stone-300 rounded-md font-mono text-stone-800 focus:outline-none focus:border-green-700" />
    </label>
  );

  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/45 backdrop-blur-xs">
    <div className="w-full max-w-[560px] p-5 bg-orange-50 rounded-xl border border-stone-200 shadow-2xl">
      <div className="flex justify-between items-center pb-3 border-b border-stone-200"><h2 className="text-lg font-bold text-stone-800">New Batch Pra Dry-Kiln</h2><button type="button" onClick={onClose} className="p-1 text-stone-500"><X className="w-5 h-5" /></button></div>
      <form onSubmit={submit} className="mt-4 p-5 bg-white rounded-xl border border-stone-200 flex flex-col gap-4 text-xs">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-green-800">ID PALET<span className="text-[10px] font-normal text-stone-500">Saran otomatis, masih bisa diubah</span><input type="text" required maxLength={50} value={idPalet} onChange={(e) => setIdPalet(e.target.value)} className="h-10 px-3 bg-white border border-stone-300 rounded-md font-mono text-stone-800 focus:outline-none focus:border-green-700" /></label>
        <div><p className="mb-2 text-xs font-semibold text-green-800">Rentang Ukuran Papan</p><div className="grid grid-cols-2 gap-3">{field('Ketebalan minimum (cm)', 'ketebalanMin', '3')}{field('Ketebalan maksimum (cm)', 'ketebalanMax', '6')}{field('Panjang minimum (cm)', 'panjangMin', '200')}{field('Panjang maksimum (cm)', 'panjangMax', '300')}{field('Lebar minimum (cm)', 'lebarMin', '15')}{field('Lebar maksimum (cm)', 'lebarMax', '25')}</div></div>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-green-800">Grade<select value={grade} onChange={(e) => setGrade(e.target.value as PlankGrade)} className="h-10 px-3 bg-white border border-stone-300 rounded-md font-medium">{grades.map((item) => <option key={item}>{item}</option>)}</select></label>
        <FormError message={error} />
        <div className="flex justify-end gap-2 pt-3 border-t border-stone-200"><button type="button" onClick={onClose} className="h-10 px-4 border border-stone-300 rounded-md">Batal</button><button type="submit" className="h-10 px-5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-md flex items-center gap-2"><Check className="w-3.5 h-3.5" />Simpan Batch</button></div>
      </form>
    </div>
  </div>;
}
