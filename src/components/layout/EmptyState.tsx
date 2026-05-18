import React from 'react';
import { useUI } from '../../context/UIContext';
import { PanelLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

export function EmptyState() {
  const { isSidebarOpen, setSidebarOpen } = useUI();

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-mut)] gap-3 p-10 text-center relative">
      {!isSidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-6 w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-[var(--color-panel2)] border border-[var(--color-brd2)] text-[var(--color-mut)] hover:text-[var(--color-txt)]"
          title="Open Sidebar"
        >
          <PanelLeft size={18} />
        </button>
      )}
      
      <div className="text-5xl opacity-40 select-none pb-2">𝄞</div>
      <h2 className="text-xl font-extrabold text-[var(--color-mut2)]">Sin selección</h2>
      <p className="text-[13px] leading-relaxed max-w-[260px]">
        Crea una progresión nueva o selecciona una de la lista.
      </p>
    </div>
  );
}
