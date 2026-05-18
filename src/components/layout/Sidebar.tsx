import React, { useState } from 'react';
import { usePassage } from '../../context/PassageContext';
import { useUI } from '../../context/UIContext';
import { Play, Settings2, Trash2, Plus, ChevronRight, ChevronLeft, Folder } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const { state, dispatch } = usePassage();
  const { setWizardOpen, showConfirm } = useUI();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <aside className="w-[300px] h-full bg-[var(--color-panel)] border-r border-[var(--color-brd)] flex flex-col shrink-0 overflow-hidden">
      <div className="p-6 pb-4 border-b border-[var(--color-brd)] shrink-0">
        <h1 className="text-3xl font-extrabold tracking-widest text-[var(--color-txt)] mb-1">PASSAGE</h1>
        <p className="text-[10px] text-[var(--color-mut)] tracking-[0.22em] uppercase mb-4">Chord Path Builder · v3.0</p>
        <button 
          onClick={() => setWizardOpen(true)}
          className="w-full h-12 rounded-2xl bg-[var(--color-txt)] text-[var(--color-bg)] text-sm font-bold shadow-md hover:opacity-90 hover:-translate-y-[1px] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Nueva progresión
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {state.progressions.length === 0 ? (
          <div className="p-7 text-center text-[var(--color-mut)] text-[13px] leading-relaxed">
            No hay progresiones.<br/>Crea una con el botón de arriba.
          </div>
        ) : !activeCategory ? (
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-bold text-[var(--color-mut)] uppercase tracking-widest px-2 mb-2 pt-2">Categorías</div>
            {[...new Set(state.progressions.map(p => p.category || 'Otras'))].map(cat => {
              const count = state.progressions.filter(p => (p.category || 'Otras') === cat).length;
              return (
                <div 
                  key={cat} 
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--color-panel2)] border border-[var(--color-brd)] cursor-pointer hover:border-[var(--color-brd2)] hover:-translate-y-[1px] transition-all group"
                  onClick={() => setActiveCategory(cat)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(91,157,255,0.1)] text-[var(--color-blu)] flex items-center justify-center">
                      <Folder size={15} />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[var(--color-txt)]">{cat}</div>
                      <div className="text-[11px] text-[var(--color-mut)] mt-0.5">{count} {count === 1 ? 'progresión' : 'progresiones'}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[var(--color-mut)] group-hover:text-[var(--color-txt)] transition-colors" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2 px-1 pt-2 cursor-pointer group w-fit" onClick={() => setActiveCategory(null)}>
              <button 
                className="w-7 h-7 flex items-center justify-center rounded-lg group-hover:bg-[var(--color-panel2)] text-[var(--color-mut)] group-hover:text-[var(--color-txt)] transition-colors"
                title="Volver"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-[13px] font-bold text-[var(--color-mut)] group-hover:text-[var(--color-txt)] transition-colors">{activeCategory}</div>
            </div>
            
            {state.progressions.map((p, idx) => {
              if ((p.category || 'Otras') !== activeCategory) return null;
              const isActive = idx === state.currentProgIndex;
              const on = p.origin.notes.slice(0, 2).map(n => n.replace(/\d+$/, '')).join('') || '?';
              const dn = p.dest.notes.slice(0, 2).map(n => n.replace(/\d+$/, '')).join('') || '?';
              const routeName = p.name || `${on} → ${p.steps.length}st → ${dn}`;

              return (
                <div 
                  key={p.id}
                  onClick={() => dispatch({ type: 'SELECT_PROGRESSION', payload: idx })}
                  className={cn(
                    "bg-gradient-to-b from-[var(--color-panel2)] to-[var(--color-panel)] border border-[var(--color-brd)] rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-[1px] hover:border-[var(--color-brd2)]",
                    isActive && "border-opacity-40 border-[var(--color-mut)] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_6px_24px_rgba(0,0,0,0.2)] bg-[var(--color-panel)]"
                  )}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-base font-bold text-[var(--color-txt)] pr-2">{routeName}</h3>
                      <p className="text-[11px] text-[var(--color-mut)] mt-1">{p.steps.length + 2} slots · {p.bpm} BPM</p>
                    </div>
                    <span className={cn(
                      "bg-[var(--color-panel3)] border border-[var(--color-brd2)] rounded-lg px-2.5 py-1 text-[11px] font-semibold text-[var(--color-mut2)]",
                      isActive && "border-[rgba(240,240,248,0.2)] text-[var(--color-txt)] bg-[rgba(240,240,248,0.05)]"
                    )}>
                      {isActive ? 'Activa' : 'Draft'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'SELECT_PROGRESSION', payload: idx });
                        setTimeout(() => dispatch({ type: 'TOGGLE_PLAY' }), 50);
                      }}
                      className="flex-1 h-9 rounded-xl border border-[rgba(63,216,130,0.25)] bg-[rgba(63,216,130,0.1)] text-[var(--color-grn)] text-xs font-bold transition-all hover:bg-[rgba(63,216,130,0.18)] flex items-center justify-center gap-1.5"
                    >
                      <Play size={12} fill="currentColor" /> Play
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'SELECT_PROGRESSION', payload: idx });
                      }}
                      className="flex-1 h-9 rounded-xl border border-[var(--color-brd2)] bg-[var(--color-panel3)] text-[var(--color-mut2)] text-xs font-bold transition-all hover:bg-[#1f1f28] hover:text-[var(--color-txt)] flex items-center justify-center gap-1.5"
                    >
                      <Settings2 size={13} /> Editar
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        showConfirm(`¿Eliminar "${p.name || 'esta progresión'}"?`, () => {
                          const remainingInCategory = state.progressions.filter(other => (other.category || 'Otras') === activeCategory).length;
                          if (remainingInCategory <= 1) setActiveCategory(null);
                          dispatch({ type: 'DELETE_PROGRESSION', payload: idx });
                        }, "Eliminar progresión");
                      }}
                      className="w-9 h-9 rounded-xl border border-[var(--color-brd2)] bg-[var(--color-panel3)] text-[var(--color-mut2)] flex items-center justify-center transition-all hover:border-[rgba(255,80,80,0.4)] hover:text-[#ff7070] hover:bg-[rgba(255,60,60,0.07)] shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
