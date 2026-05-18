import React, { useRef, useEffect } from 'react';
import { usePassage } from '../../context/PassageContext';
import { cn } from '../../lib/utils';
import { generateKeys, identifyChord, normalizeNote } from '../../lib/piano';

export function PianoEditor() {
  const { state, dispatch, activeProg, activeSlot } = usePassage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate octaves from 3 to 7
  const keys = React.useMemo(() => generateKeys(3, 4, true), []);

  // Dimensions
  const wW = 34; 
  const bW = 21; 
  const kH = 96;

  useEffect(() => {
    if (scrollContainerRef.current && activeSlot && (activeSlot.notes.length > 0 || activeSlot.bass.length > 0)) {
      const allActive = [...activeSlot.notes, ...activeSlot.bass];
      const activeIndices = allActive.map(n => keys.findIndex(k => k.ns === n)).filter(i => i !== -1);
      
      if (activeIndices.length > 0) {
        const minIdx = Math.min(...activeIndices);
        const maxIdx = Math.max(...activeIndices);
        const centerIdx = (minIdx + maxIdx) / 2;
        
        const whiteKeysBeforeTarget = keys.slice(0, Math.floor(centerIdx)).filter(k => !k.isB).length;
        const targetPixel = whiteKeysBeforeTarget * wW;
        
        const containerWidth = scrollContainerRef.current.clientWidth;
        scrollContainerRef.current.scrollTo({
          left: targetPixel - containerWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [activeSlot, keys, wW]);

  if (!activeProg || !activeSlot) return null;

  const total = activeProg.steps.length + 2;
  const slotName = state.currentStepIndex === 0 ? 'Origen' 
    : state.currentStepIndex === total - 1 ? 'Destino' 
    : `Step ${state.currentStepIndex}`;
    
  const onNoteClick = (n: string) => {
    if (state.editMode === 'bass') {
      const isIncluded = activeSlot.bass.some(x => normalizeNote(x) === n);
      const newBass = isIncluded ? activeSlot.bass.filter(x => normalizeNote(x) !== n) : [...activeSlot.bass, n];
      dispatch({ type: 'UPDATE_ACTIVE_SLOT', payload: { bass: newBass } });
    } else {
      const isIncluded = activeSlot.notes.some(x => normalizeNote(x) === n);
      const newNotes = isIncluded ? activeSlot.notes.filter(x => normalizeNote(x) !== n) : [...activeSlot.notes, n];
      dispatch({ type: 'UPDATE_ACTIVE_SLOT', payload: { notes: newNotes } });
    }
  };

  const onBassRightClick = (e: React.MouseEvent, n: string) => {
    e.preventDefault();
    const isIncluded = activeSlot.bass.some(x => normalizeNote(x) === n);
    const newBass = isIncluded ? activeSlot.bass.filter(x => normalizeNote(x) !== n) : [...activeSlot.bass, n];
    dispatch({ type: 'UPDATE_ACTIVE_SLOT', payload: { bass: newBass } });
  };

  let wPos = 0;
  
  const normalizedNotes = activeSlot.notes.map(normalizeNote);
  const normalizedBass = activeSlot.bass.map(normalizeNote);

  return (
    <div className="border-t border-[var(--color-brd)] bg-[var(--color-panel)] p-4 px-6 shrink-0 z-10 w-full overflow-hidden">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-[11px] text-[var(--color-mut)] uppercase tracking-[0.14em]">Editando:</span>
        <span className="text-[15px] font-bold text-[var(--color-txt)] mr-auto">{slotName}</span>
        
        <div className="flex gap-2">
          <button 
            onClick={() => dispatch({ type: 'SET_EDIT_MODE', payload: 'notes' })}
            className={cn(
              "h-9 px-4 rounded-xl text-xs font-bold transition-all border",
              state.editMode === 'notes' ? "bg-[var(--color-blu)] border-[var(--color-blu)] text-white shadow-sm" : "bg-[var(--color-panel2)] border-[var(--color-brd2)] text-[var(--color-mut2)] hover:text-[var(--color-txt)]"
            )}>Mano derecha</button>
          <button 
            onClick={() => dispatch({ type: 'SET_EDIT_MODE', payload: 'bass' })}
            className={cn(
               "h-9 px-4 rounded-xl text-xs font-bold transition-all border",
               state.editMode === 'bass' ? "bg-[var(--color-org)] border-[var(--color-org)] text-white shadow-sm" : "bg-[var(--color-panel2)] border-[var(--color-brd2)] text-[var(--color-mut2)] hover:text-[var(--color-txt)]"
            )}>Mano izquierda</button>
        </div>
      </div>

      <div className="flex gap-4 mb-3 items-center">
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-mut)]"><div className="w-2 h-2 rounded-[2px] bg-[var(--color-blu)]" />Mano derecha</div>
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-mut)]"><div className="w-2 h-2 rounded-[2px] bg-[var(--color-org)]" />Mano izquierda</div>
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-mut)]"><div className="w-2 h-2 rounded-[2px] bg-[var(--color-pur)]" />Ambas</div>
        <span className="ml-auto text-[10px] text-[var(--color-mut)]">Click = modo activo · Clic derecho = mano izquierda</span>
      </div>

      <div className="overflow-x-auto mb-4 pb-1" ref={scrollContainerRef}>
        <div className="relative inline-block" style={{ height: kH }}>
          <div className="whitespace-nowrap flex">
            {keys.map((n, i) => {
              if (n.isB) return null;
              const isNote = normalizedNotes.includes(n.ns);
              const isBass = normalizedBass.includes(n.ns);
              const bgClass = (isNote && isBass) ? '!bg-[var(--color-pur)] !border-[#7952c4]' : isNote ? '!bg-[var(--color-blu)] !border-[#3a7de0]' : isBass ? '!bg-[var(--color-org)] !border-[#c05820]' : '';
              
              const key = (
                <div 
                  key={n.ns}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return;
                    onNoteClick(n.ns);
                  }}
                  onContextMenu={(e) => onBassRightClick(e, n.ns)}
                  className={cn("inline-block bg-[#ddd8cc] border border-[#aaa] rounded-b-md relative cursor-pointer shrink-0 transition-colors hover:bg-[#c8c4b8]", bgClass)}
                  style={{ width: wW, height: kH }}
                >
                  {n.ni === 0 && <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] text-[#888] font-semibold">{n.ns}</span>}
                </div>
              );
              wPos++;
              return key;
            })}
          </div>
          <div className="absolute top-0 left-0 pointer-events-none">
            {(() => {
              let pos = 0;
              return keys.map((n) => {
                if (!n.isB) { pos++; return null; }
                const isNote = normalizedNotes.includes(n.ns);
                const isBass = normalizedBass.includes(n.ns);
                const bgClass = (isNote && isBass) ? '!bg-[var(--color-pur)] !border-[var(--color-pur)]' : isNote ? '!bg-[var(--color-blu)] !border-black' : isBass ? '!bg-[var(--color-org)] !border-black' : '';
                const left = (pos - 1) * wW + wW - bW / 2;
                
                return (
                  <div
                    key={n.ns}
                    onMouseDown={(e) => { 
                      if (e.button !== 0) return;
                      e.preventDefault(); 
                      onNoteClick(n.ns); 
                    }}
                    onContextMenu={(e) => { e.preventDefault(); onBassRightClick(e, n.ns); }}
                    className={cn("absolute top-0 bg-[#1a1820] border border-black rounded-b-[4px] cursor-pointer z-10 transition-colors hover:bg-[#2d2b3a] pointer-events-auto", bgClass)}
                    style={{ left, width: bW, height: kH * 0.625 }}
                  />
                );
              });
            })()}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center min-h-[36px] px-4 py-2 bg-[var(--color-panel2)] border border-[var(--color-brd)] rounded-xl mt-4">
        {activeSlot.notes.length === 0 && activeSlot.bass.length === 0 && (
           <span className="text-xs text-[var(--color-mut)]">Ninguna nota seleccionada</span>
        )}
        
        {activeSlot.notes.length > 0 && (
          <div className="flex items-center gap-2 mr-4 border-r border-[var(--color-brd)] pr-4">
            <span className="text-[10px] uppercase font-bold text-[var(--color-blu)] tracking-widest">{identifyChord(activeSlot.notes)}</span>
            {activeSlot.notes.map(n => (
              <span 
                key={n}
                onClick={() => dispatch({ type: 'UPDATE_ACTIVE_SLOT', payload: { notes: activeSlot.notes.filter(x => x !== n) } })}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono cursor-pointer transition-all bg-[rgba(91,157,255,0.12)] text-[var(--color-blu)] border border-[rgba(91,157,255,0.2)] group"
              >
                {n} <span className="opacity-40 text-[10px] group-hover:opacity-100">✕</span>
              </span>
            ))}
          </div>
        )}

        {activeSlot.bass.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[var(--color-org)] tracking-widest">{identifyChord(activeSlot.bass)}</span>
            {activeSlot.bass.map(n => (
              <span 
                key={`bass-${n}`}
                onClick={() => dispatch({ type: 'UPDATE_ACTIVE_SLOT', payload: { bass: activeSlot.bass.filter(x => x !== n) } })}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono cursor-pointer transition-all bg-[rgba(255,140,87,0.1)] text-[var(--color-org)] border border-[rgba(255,140,87,0.2)] group"
              >
                mi: {n} <span className="opacity-40 text-[10px] group-hover:opacity-100">✕</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
