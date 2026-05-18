import React from 'react';
import { usePassage } from '../../context/PassageContext';
import { useUI } from '../../context/UIContext';
import { Play, Square, Save, Plus, PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { playSlot } from '../../lib/audio';

export function Topbar() {
  const { state, dispatch, activeProg, activeSlot } = usePassage();
  const { showToast, isSidebarOpen, setSidebarOpen, isInspectorOpen, setInspectorOpen } = useUI();

  if (!activeProg) return null;

  const onHandlePlay = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const onSave = () => {
    showToast('Guardado');
  };

  const onAppletPlay = () => {
    if(activeSlot) {
      playSlot(activeSlot, activeProg.duration, activeProg.bpm, activeProg.wave, activeProg.volume, 0);
    }
  }

  const onString = activeProg.origin.notes.slice(0,3).map(n => n.replace(/\d+$/, '')).join('-') || '?';
  const dnString = activeProg.dest.notes.slice(0,3).map(n => n.replace(/\d+$/, '')).join('-') || '?';

  return (
    <div className="bg-[var(--color-panel)] border-b border-[var(--color-brd)] px-6 py-4 flex items-center gap-4 shrink-0 shadow-sm relative z-20">
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
          isSidebarOpen ? "bg-[var(--color-panel3)] text-[var(--color-txt)]" : "bg-[var(--color-panel2)] border border-[var(--color-brd2)] text-[var(--color-mut)] hover:text-[var(--color-txt)]"
        )}
        title="Toggle Sidebar"
      >
        <PanelLeft size={18} />
      </button>

      <div>
        <div className="text-[10px] text-[var(--color-mut)] uppercase tracking-[0.18em] mb-0.5">Progresión</div>
        <div className="text-[19px] font-extrabold flex items-center gap-2">
          <span className="text-[var(--color-grn)]">{onString}</span>
          <span className="text-[var(--color-mut)] text-sm font-normal">→</span>
          <span>{activeProg.steps.length} steps</span>
          <span className="text-[var(--color-mut)] text-sm font-normal">→</span>
          <span className="text-[var(--color-pur)]">{dnString}</span>
        </div>
      </div>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-2 bg-[var(--color-panel2)] border border-[var(--color-brd2)] rounded-xl px-4 h-11">
        <span className="text-[10px] text-[var(--color-mut)] uppercase tracking-wider">Transp.</span>
        <button className="text-[var(--color-mut2)] text-lg px-1 hover:text-[var(--color-blu)]" onClick={() => dispatch({ type: 'SET_TRANSPOSE', payload: state.transpose - 1 })}>−</button>
        <div className="text-[15px] font-bold text-[var(--color-blu)] min-w-[30px] text-center">{state.transpose >= 0 ? `+${state.transpose}` : state.transpose}</div>
        <button className="text-[var(--color-mut2)] text-lg px-1 hover:text-[var(--color-blu)]" onClick={() => dispatch({ type: 'SET_TRANSPOSE', payload: state.transpose + 1 })}>+</button>
      </div>

      <button 
        onClick={onHandlePlay}
        className={cn(
          "h-11 rounded-xl px-5 text-[13px] font-bold transition-all flex items-center gap-2 border bg-[rgba(63,216,130,0.1)] border-[rgba(63,216,130,0.3)] text-[var(--color-grn)] hover:bg-[rgba(63,216,130,0.2)]",
          state.playing && "bg-[rgba(63,216,130,0.18)]"
        )}
      >
        {state.playing ? <><Square fill="currentColor" size={14}/> STOP</> : <><Play fill="currentColor" size={14}/> PLAY</>}
      </button>
      
      <button 
        onClick={() => dispatch({ type: 'ADD_STEP' })}
        className="h-11 rounded-xl px-5 text-[13px] font-bold transition-all flex items-center gap-2 border border-[var(--color-brd2)] text-[var(--color-txt)] bg-[var(--color-panel2)] hover:bg-[var(--color-panel3)]"
      >
        <Plus size={16}/> STEP
      </button>
      
      <button 
        onClick={onSave}
        className="h-11 rounded-xl px-5 text-[13px] font-bold transition-all flex items-center gap-2 border border-[rgba(91,157,255,0.3)] text-[var(--color-blu)] bg-[rgba(91,157,255,0.12)] hover:bg-[var(--color-panel3)] hover:text-white"
      >
        <Save size={16}/> GUARDAR
      </button>

      <button 
        onClick={() => setInspectorOpen(!isInspectorOpen)}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
          isInspectorOpen ? "bg-[var(--color-panel3)] text-[var(--color-txt)]" : "bg-[var(--color-panel2)] border border-[var(--color-brd2)] text-[var(--color-mut)] hover:text-[var(--color-txt)]"
        )}
        title="Toggle Inspector"
      >
        <PanelRight size={18} />
      </button>
      
      {state.playing && (
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-brd)]">
          <div 
            className="h-full bg-[var(--color-grn)] transition-all ease-linear" 
            style={{ 
              width: `${(state.playStep / (activeProg.steps.length + 2)) * 100}%`,
              transitionDuration: state.playing ? '0.12s' : '0s'
            }} 
          />
        </div>
      )}
    </div>
  );
}
