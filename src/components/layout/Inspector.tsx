import React from 'react';
import { usePassage } from '../../context/PassageContext';
import { useUI } from '../../context/UIContext';
import { cn } from '../../lib/utils';
import { Play } from 'lucide-react';
import { playSlot } from '../../lib/audio';

export function Inspector() {
  const { state, dispatch, activeProg, activeSlot } = usePassage();
  const { showConfirm } = useUI();

  if (!activeProg) return null;

  const total = activeProg.steps.length + 2;
  const slotName = state.currentStepIndex === 0 ? 'Origen' 
    : state.currentStepIndex === total - 1 ? 'Destino' 
    : `Step ${state.currentStepIndex}`;

  const handleDeleteStep = () => {
    if (state.currentStepIndex === 0 || state.currentStepIndex === total - 1) {
      alert("No puedes eliminar el origen ni el destino.");
      return;
    }
    showConfirm(`¿Eliminar el Step ${state.currentStepIndex}?`, () => {
      dispatch({ type: 'DELETE_CURRENT_STEP' });
    });
  };

  const handlePlayActiveSlot = () => {
    if(activeSlot) {
      playSlot(activeSlot, activeProg.duration, activeProg.bpm, activeProg.wave, activeProg.volume, 0);
    }
  }

  return (
    <aside className="w-[340px] bg-[var(--color-panel)] border-l border-[var(--color-brd)] flex flex-col shrink-0 overflow-y-auto">
      <div className="p-5 border-b border-[var(--color-brd)]">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mut)] mb-3">Nombre</div>
        <input 
          type="text" 
          value={activeProg.name}
          onChange={e => dispatch({ type: 'UPDATE_ACTIVE_PROG', payload: { name: e.target.value } })}
          placeholder="Nombre de la progresión..."
          className="w-full h-11 rounded-xl bg-[var(--color-panel2)] border border-[var(--color-brd2)] px-4 text-sm outline-none focus:border-[var(--color-mut)] transition-colors placeholder:text-[var(--color-mut)]"
        />
      </div>

      <div className="p-5 border-b border-[var(--color-brd)]">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mut)] mb-3">Sonido</div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(['piano', 'epiano'] as const).map(w => (
            <button 
              key={w}
              onClick={() => dispatch({ type: 'UPDATE_ACTIVE_PROG', payload: { wave: w } })}
              className={cn(
                "h-10 rounded-xl border border-[var(--color-brd2)] bg-[var(--color-panel2)] text-[13px] font-bold text-[var(--color-mut2)] transition-all hover:text-[var(--color-txt)] capitalize",
                activeProg.wave === w && "bg-[var(--color-txt)] text-[var(--color-bg)] border-transparent"
              )}
            >
              {w}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center text-[13px] mb-2">
          <span className="text-[var(--color-mut2)]">Volumen</span>
          <span className="font-bold">{Math.round(activeProg.volume * 100)}%</span>
        </div>
        <input 
          type="range" min="0" max="100" 
          value={Math.round(activeProg.volume * 100)}
          onChange={e => dispatch({ type: 'UPDATE_ACTIVE_PROG', payload: { volume: parseInt(e.target.value) / 100 } })}
          className="custom-slider"
        />
      </div>

      <div className="p-5 border-b border-[var(--color-brd)]">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mut)] mb-3">Tempo</div>
        <div className="text-[50px] font-extrabold text-[var(--color-txt)] leading-none mb-3">
          {activeProg.bpm} <span className="text-sm font-semibold text-[var(--color-mut)]">BPM</span>
        </div>
        <input 
          type="range" min="40" max="240" 
          value={activeProg.bpm}
          onChange={e => dispatch({ type: 'UPDATE_ACTIVE_PROG', payload: { bpm: parseInt(e.target.value) } })}
          className="custom-slider"
        />
      </div>

      <div className="p-5 border-b border-[var(--color-brd)]">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mut)] mb-3">Duración por step</div>
        <div className="grid grid-cols-2 gap-2">
          {(['whole', 'half', 'quarter', 'eighth'] as const).map(d => (
            <button 
              key={d}
              onClick={() => dispatch({ type: 'UPDATE_ACTIVE_PROG', payload: { duration: d } })}
              className={cn(
                "h-10 rounded-xl border border-[var(--color-brd2)] bg-[var(--color-panel2)] text-[13px] font-bold text-[var(--color-mut2)] transition-all hover:text-[var(--color-txt)] capitalize",
                activeProg.duration === d && "bg-[var(--color-txt)] text-[var(--color-bg)] border-transparent"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 border-b border-[var(--color-brd)]">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mut)] mb-3">Step seleccionado</div>
        {activeSlot ? (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[13px]"><span className="text-[var(--color-mut)]">Tipo</span><span className="font-bold">{slotName}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-[var(--color-mut)]">Mano derecha</span><span className="font-bold">{activeSlot.notes.length}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-[var(--color-mut)]">Mano izquierda</span><span className="font-bold">{activeSlot.bass.length}</span></div>
            <div className="flex flex-wrap gap-1 mt-1">
              {activeSlot.notes.map(n => <span key={n} className="px-2 py-1 rounded bg-[rgba(91,157,255,0.12)] text-[var(--color-blu)] text-[11px] font-bold font-mono">{n}</span>)}
              {activeSlot.bass.map(n => <span key={`bass-${n}`} className="px-2 py-1 rounded bg-[rgba(255,140,87,0.1)] text-[var(--color-org)] text-[11px] font-bold font-mono">mi: {n}</span>)}
              {!activeSlot.notes.length && !activeSlot.bass.length && <span className="text-[11px] text-[var(--color-mut)]">Sin notas</span>}
            </div>
          </div>
        ) : (
          <div className="text-xs text-[var(--color-mut)]">Selecciona un step en el timeline</div>
        )}
      </div>

      <div className="mt-auto p-5 flex flex-col gap-2">
        <button 
          onClick={handlePlayActiveSlot}
          className="w-full h-11 rounded-xl font-bold text-[13px] transition-all bg-[rgba(63,216,130,0.1)] text-[var(--color-grn)] border border-[rgba(63,216,130,0.3)] hover:bg-[rgba(63,216,130,0.18)]"
        >
          ▶ Escuchar este step
        </button>
        <button 
          onClick={() => dispatch({ type: 'CLEAR_CURRENT_STEP' })}
          className="w-full h-11 rounded-xl font-bold text-[13px] transition-all bg-[var(--color-panel2)] border border-[var(--color-brd2)] hover:bg-[var(--color-panel3)]"
        >
          Limpiar step actual
        </button>
        <button 
          onClick={handleDeleteStep}
          className="w-full h-11 rounded-xl font-bold text-[13px] transition-all bg-[var(--color-panel2)] border border-[var(--color-brd2)] hover:bg-[var(--color-panel3)]"
        >
          Eliminar step actual
        </button>
        <button 
          onClick={() => {
            showConfirm(`¿Eliminar progresión "${activeProg.name}"?`, () => {
              dispatch({ type: 'DELETE_PROGRESSION', payload: state.currentProgIndex });
            });
          }}
          className="w-full h-11 rounded-xl font-bold text-[13px] transition-all bg-[rgba(200,40,40,0.07)] border border-[rgba(200,40,40,0.25)] text-[#ff7070] hover:bg-[rgba(200,40,40,0.14)] mt-2"
        >
          Eliminar progresión
        </button>
      </div>
    </aside>
  );
}
