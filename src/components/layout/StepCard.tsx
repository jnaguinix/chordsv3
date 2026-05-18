import React from 'react';
import { Progression } from '../../types';
import { cn } from '../../lib/utils';
import { identifyChord } from '../../lib/piano';

interface StepCardProps {
  slot: Progression['steps'][0];
  label: string;
  type: 'origin' | 'dest' | 'step';
  selected: boolean;
  playing: boolean;
  onClick: () => void;
}

export function StepCard({ slot, label, type, selected, playing, onClick }: StepCardProps) {

  const borderColor = {
    origin: 'border-[rgba(63,216,130,0.3)]',
    dest: 'border-[rgba(168,127,255,0.3)]',
    step: 'border-[var(--color-brd)]'
  }[type];

  const selectedBorder = {
    origin: 'border-[rgba(63,216,130,0.6)] shadow-[0_0_0_1px_rgba(63,216,130,0.12)]',
    dest: 'border-[rgba(168,127,255,0.6)] shadow-[0_0_0_1px_rgba(168,127,255,0.12)]',
    step: 'border-[rgba(255,140,87,0.5)] shadow-[0_0_0_1px_rgba(255,140,87,0.12),0_8px_28px_rgba(255,100,30,0.08)]'
  }[type];

  const dotColor = {
    origin: 'bg-[var(--color-grn)]',
    dest: 'bg-[var(--color-pur)]',
    step: 'bg-[var(--color-mut2)]'
  }[type];

  const playStyle = playing ? '!border-[var(--color-blu)] !shadow-[0_0_0_1px_rgba(91,157,255,0.18),0_8px_28px_rgba(91,157,255,0.1)]' : '';

  const rightChord = identifyChord(slot.notes);
  const leftChord = identifyChord(slot.bass);

  return (
    <div 
      className={cn(
        "w-[240px] flex flex-col bg-gradient-to-b from-[var(--color-panel2)] to-[var(--color-panel)] border rounded-2xl p-4 cursor-pointer transition-all shrink-0 min-h-[160px] hover:border-[var(--color-brd2)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]",
        borderColor,
        selected && selectedBorder,
        playStyle
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-mut)] font-bold">{label}</span>
        <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-mut2)] font-semibold">Mano derecha</span>
            <span className="text-[10px] font-bold text-[var(--color-blu)]">{rightChord}</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono bg-[rgba(91,157,255,0.12)] text-[var(--color-blu)] border border-[rgba(91,157,255,0.2)] text-center tracking-widest break-words min-h-[30px] flex items-center justify-center">
            {slot.notes.length > 0 ? slot.notes.map(n => n.replace(/\d+$/, '')).join('-') : '-'}
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-mut2)] font-semibold">Mano izquierda</span>
             <span className="text-[10px] font-bold text-[var(--color-org)]">{leftChord}</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono bg-[rgba(255,140,87,0.1)] text-[var(--color-org)] border border-[rgba(255,140,87,0.2)] text-center tracking-widest break-words min-h-[30px] flex items-center justify-center">
            {slot.bass.length > 0 ? slot.bass.map(n => n.replace(/\d+$/, '')).join('-') : '-'}
          </div>
        </div>
      </div>
    </div>
  );
}
