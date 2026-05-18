import React, { useState, useRef, useEffect } from 'react';
import { usePassage } from '../../context/PassageContext';
import { useUI } from '../../context/UIContext';
import { generateKeys, identifyChord, normalizeNote } from '../../lib/piano';
import { Slot } from '../../types';
import { cn } from '../../lib/utils';
import { Play } from 'lucide-react';

export function WizardModal() {
  const { isWizardOpen, setWizardOpen, showToast } = useUI();
  const { dispatch } = usePassage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [origin, setOrigin] = useState<Slot>({ notes: [], bass: [] });
  const [dest, setDest] = useState<Slot>({ notes: [], bass: [] });
  const [numMiddle, setNumMiddle] = useState(1);
  const [currentMiddle, setCurrentMiddle] = useState(0);
  const [middles, setMiddles] = useState<Slot[]>([]);
  const [editMode, setEditMode] = useState<'notes'|'bass'>('notes');
  const [curSlot, setCurSlot] = useState<Slot>({ notes: [], bass: [] }); // Temp slot for intermediate steps

  // Generate octaves from 3 to 7
  const keys = React.useMemo(() => generateKeys(3, 4, true), []);

  // Pick what slot we are editing based on step
  const getActiveSlot = () => {
    if (step === 1) return origin;
    if (step === 2) return dest;
    return curSlot;
  };

  const activeSlot = getActiveSlot();

  // Scroll to center active notes
  useEffect(() => {
    if (scrollContainerRef.current && (step === 1 || step === 2 || step === 4)) {
      if (activeSlot && (activeSlot.notes.length > 0 || activeSlot.bass.length > 0)) {
        const allActive = [...activeSlot.notes, ...activeSlot.bass];
        const activeIndices = allActive.map(n => keys.findIndex(k => k.ns === n)).filter(i => i !== -1);
        
        if (activeIndices.length > 0) {
          const minIdx = Math.min(...activeIndices);
          const maxIdx = Math.max(...activeIndices);
          const centerIdx = (minIdx + maxIdx) / 2;
          
          const whiteKeysBeforeTarget = keys.slice(0, Math.floor(centerIdx)).filter(k => !k.isB).length;
          // In wizard, white key width is 30
          const targetPixel = whiteKeysBeforeTarget * 30;
          
          const containerWidth = scrollContainerRef.current.clientWidth;
          scrollContainerRef.current.scrollTo({
            left: Math.max(0, targetPixel - containerWidth / 2),
            behavior: 'smooth'
          });
        }
      }
    }
  }, [step, curSlot, origin, dest, currentMiddle, keys, activeSlot]);

  if (!isWizardOpen) return null;

  const close = () => {
    setWizardOpen(false);
    setTimeout(() => {
      setStep(1); setOrigin({ notes: [], bass: [] }); setDest({ notes: [], bass: [] });
      setNumMiddle(1); setCurrentMiddle(0); setMiddles([]); setCurSlot({ notes: [], bass: [] });
    }, 200);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!origin.notes.length) return alert('Selecciona al menos una nota para el origen.');
      setStep(2);
    } else if (step === 2) {
      if (!dest.notes.length) return alert('Selecciona al menos una nota para el destino.');
      setStep(3);
    } else if (step === 3) {
      if (numMiddle === 0) return finalize();
      setMiddles(Array.from({ length: numMiddle }, () => ({ notes: [], bass: [] })));
      setCurrentMiddle(0);
      setCurSlot({ notes: [], bass: [] });
      setStep(4);
    } else if (step === 4) {
      const newMiddles = [...middles];
      newMiddles[currentMiddle] = { ...curSlot };
      setMiddles(newMiddles);
      if (currentMiddle + 1 >= numMiddle) {
        finalize();
      } else {
        setCurrentMiddle(c => c + 1);
        setCurSlot({ notes: [], bass: [] });
      }
    }
  };

  const handleBack = () => {
    if (step === 4 && currentMiddle > 0) {
      setCurrentMiddle(currentMiddle - 1);
      setCurSlot(middles[currentMiddle - 1]);
    } else if (step === 4) {
      setStep(3);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const finalize = () => {
    dispatch({
      type: 'ADD_PROGRESSION',
      payload: {
        id: Date.now(),
        name: '',
        origin,
        dest,
        steps: step === 3 && numMiddle === 0 ? [] : [...middles.slice(0, currentMiddle), curSlot, ...middles.slice(currentMiddle+1)], // use current intermediate slot
        bpm: 80,
        duration: 'half',
        wave: 'piano',
        volume: 0.8
      }
    });
    showToast('Progresión creada');
    close();
  };

  const updateSlot = (s: Partial<Slot>) => {
    if (step === 1) setOrigin(prev => ({ ...prev, ...s }));
    else if (step === 2) setDest(prev => ({ ...prev, ...s }));
    else setCurSlot(prev => ({ ...prev, ...s }));
  };

  const handleNoteClick = (n: string) => {
    if (editMode === 'bass') {
      const isInc = activeSlot.bass.some(x => normalizeNote(x) === n);
      updateSlot({ bass: isInc ? activeSlot.bass.filter(x => normalizeNote(x) !== n) : [...activeSlot.bass, n] });
    } else {
      const isInc = activeSlot.notes.some(x => normalizeNote(x) === n);
      updateSlot({ notes: isInc ? activeSlot.notes.filter(x => normalizeNote(x) !== n) : [...activeSlot.notes, n] });
    }
  };

  const totalDots = numMiddle > 0 ? 4 : 3;
  const titles = {
    1: 'Paso 1 · Acorde Origen',
    2: 'Paso 2 · Acorde Destino',
    3: 'Paso 3 · Pasos Intermedios',
    4: `Paso 4 · Step ${currentMiddle + 1} de ${numMiddle}`
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--color-panel2)] border border-[var(--color-brd2)] rounded-[26px] w-[590px] max-h-[90vh] overflow-y-auto flex flex-col shadow-[0_32px_100px_rgba(0,0,0,0.6)]">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[var(--color-brd)] flex items-center gap-4">
          <div className="flex gap-1.5">
            {Array.from({ length: totalDots }).map((_, i) => (
              <div key={i} className={cn(
                "w-2 h-2 rounded-full transition-all bg-[var(--color-brd2)]",
                i + 1 < step && "bg-[var(--color-txt)]",
                i + 1 === step && "bg-[var(--color-txt)] shadow-[0_0_0_3px_rgba(240,240,248,0.2)]"
              )} />
            ))}
          </div>
          <h2 className="text-lg font-extrabold">{titles[step as keyof typeof titles]}</h2>
          <button onClick={close} className="ml-auto text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--color-brd)] text-[var(--color-mut)] hover:text-[var(--color-txt)] transition-colors">✕ Cancelar</button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1">
          {step === 1 || step === 2 || step === 4 ? (
            <>
              <p className="text-sm text-[var(--color-mut2)] leading-relaxed mb-4">
                {step === 1 && <>Selecciona las notas del acorde de <strong className="text-[var(--color-txt)]">origen</strong>.</>}
                {step === 2 && <>Selecciona las notas del acorde de <strong className="text-[var(--color-txt)]">destino</strong>.</>}
                {step === 4 && <>Define las notas del <strong className="text-[var(--color-txt)]">step {currentMiddle + 1}</strong>. Pueden ser notas de transición.</>}
              </p>
              
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => setEditMode('notes')}
                  className={cn("px-4 py-2 text-sm font-bold rounded-xl border transition-all", editMode === 'notes' ? "bg-[var(--color-blu)] border-[var(--color-blu)] text-white shadow-sm" : "bg-[var(--color-panel3)] border-[var(--color-brd2)] text-[var(--color-mut2)]")}
                >Mano derecha</button>
                <button 
                  onClick={() => setEditMode('bass')}
                  className={cn("px-4 py-2 text-sm font-bold rounded-xl border transition-all", editMode === 'bass' ? "bg-[var(--color-org)] border-[var(--color-org)] text-white shadow-sm" : "bg-[var(--color-panel3)] border-[var(--color-brd2)] text-[var(--color-mut2)]")}
                >Mano izquierda</button>
              </div>

              {/* Wizard Mini Piano */}
              <div className="overflow-x-auto mb-2 relative h-[86px] select-none" ref={scrollContainerRef}>
                <div className="whitespace-nowrap flex">
                   {keys.map(n => {
                     if (n.isB) return null;
                     const isNote = activeSlot.notes.some(x => normalizeNote(x) === n.ns);
                     const isBass = activeSlot.bass.some(x => normalizeNote(x) === n.ns);
                     const bgClass = (isNote && isBass) ? '!bg-[var(--color-pur)] !border-[#7952c4]' : isNote ? '!bg-[var(--color-blu)] !border-[#3a7de0]' : isBass ? '!bg-[var(--color-org)] !border-[#c05820]' : '';
                     return <div 
                        key={n.ns} 
                        onMouseDown={(e)=>{
                          if (e.button !== 0) return;
                          handleNoteClick(n.ns);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          const isInc = activeSlot.bass.some(x => normalizeNote(x) === n.ns);
                          updateSlot({ bass: isInc ? activeSlot.bass.filter(x => normalizeNote(x) !== n.ns) : [...activeSlot.bass, n.ns] });
                        }}
                        className={cn("inline-block w-[30px] h-[86px] bg-[#ddd8cc] border border-[#aaa] rounded-b-[4px] cursor-pointer hover:bg-[#c8c4b8] shrink-0", bgClass)}
                      />
                   })}
                </div>
                <div className="absolute top-0 left-0 pointer-events-none">
                   {(() => {
                     let pos = 0;
                     return keys.map(n => {
                       if (!n.isB) { pos++; return null; }
                       const isNote = activeSlot.notes.some(x => normalizeNote(x) === n.ns);
                       const isBass = activeSlot.bass.some(x => normalizeNote(x) === n.ns);
                       const bgClass = (isNote && isBass) ? '!bg-[var(--color-pur)] !border-[var(--color-pur)]' : isNote ? '!bg-[var(--color-blu)] !border-black' : isBass ? '!bg-[var(--color-org)] !border-black' : '';
                       const left = (pos - 1) * 30 + 30 - 19 / 2;
                       return <div 
                         key={n.ns}
                         onMouseDown={(e)=>{
                           if (e.button !== 0) return;
                           e.preventDefault(); 
                           handleNoteClick(n.ns);
                         }}
                         onContextMenu={(e) => {
                           e.preventDefault();
                           const isInc = activeSlot.bass.some(x => normalizeNote(x) === n.ns);
                           updateSlot({ bass: isInc ? activeSlot.bass.filter(x => normalizeNote(x) !== n.ns) : [...activeSlot.bass, n.ns] });
                         }}
                         className={cn("absolute top-0 w-[19px] h-[53px] bg-[#1a1820] border border-black rounded-b-[3px] cursor-pointer pointer-events-auto hover:bg-[#2d2b3a]", bgClass)}
                         style={{ left }}
                       />
                     });
                   })()}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap min-h-[38px] p-2 bg-[var(--color-panel)] border border-[var(--color-brd2)] rounded-xl mt-3 items-center">
                {activeSlot.notes.length === 0 && activeSlot.bass.length === 0 && <span className="text-xs text-[var(--color-mut)]">Vacio</span>}
                
                {activeSlot.notes.length > 0 && (
                  <div className="flex items-center gap-2 mr-4 border-r border-[var(--color-brd)] pr-4">
                    <span className="text-[10px] uppercase font-bold text-[var(--color-blu)] tracking-widest">{identifyChord(activeSlot.notes)}</span>
                    {activeSlot.notes.map(n => (
                      <span key={n} className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-[rgba(91,157,255,0.12)] text-[var(--color-blu)]">{n}</span>
                    ))}
                  </div>
                )}
                
                {activeSlot.bass.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[var(--color-org)] tracking-widest">{identifyChord(activeSlot.bass)}</span>
                    {activeSlot.bass.map(n => (
                      <span key={`bass-${n}`} className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-[rgba(255,140,87,0.1)] text-[var(--color-org)]">mi: {n}</span>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-[var(--color-mut2)] leading-relaxed mb-5">
                ¿Cuántos acordes intermedios quieres entre origen y destino?
              </p>
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setNumMiddle(Math.max(0, numMiddle - 1))} className="w-11 h-11 rounded-[11px] border border-[var(--color-brd2)] bg-[var(--color-panel3)] text-xl flex items-center justify-center hover:text-[var(--color-txt)] hover:border-[var(--color-mut)] transition-colors">−</button>
                <input 
                  type="number" 
                  value={numMiddle} 
                  onChange={(e) => setNumMiddle(Math.max(0, Math.min(12, parseInt(e.target.value) || 0)))}
                  className="bg-[var(--color-panel)] border border-[var(--color-brd2)] text-2xl font-extrabold w-[86px] text-center rounded-xl p-2 outline-none focus:border-[var(--color-mut)]"
                />
                <button onClick={() => setNumMiddle(Math.min(12, numMiddle + 1))} className="w-11 h-11 rounded-[11px] border border-[var(--color-brd2)] bg-[var(--color-panel3)] text-xl flex items-center justify-center hover:text-[var(--color-txt)] hover:border-[var(--color-mut)] transition-colors">+</button>
              </div>
              <p className="text-xs text-[var(--color-mut)]">0 = sin pasos intermedios · Puedes agregar más después.</p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--color-brd)] flex items-center gap-3">
          {step > 1 && (
            <button onClick={handleBack} className="px-5 py-2.5 rounded-xl border border-[var(--color-brd2)] bg-[var(--color-panel3)] text-[var(--color-mut2)] text-[13px] font-bold hover:text-[var(--color-txt)] transition-colors">
              ← Atrás
            </button>
          )}
          <div className="flex-1" />
          <button 
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[var(--color-txt)] text-[var(--color-bg)] text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
          >
            {(step === 4 && currentMiddle === numMiddle - 1) || (step === 3 && numMiddle === 0) ? '✓ Finalizar' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}
