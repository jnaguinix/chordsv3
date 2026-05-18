import React from 'react';
import { usePassage } from '../../context/PassageContext';
import { StepCard } from './StepCard';
import { Plus } from 'lucide-react';

export function StepsTimeline() {
  const { state, dispatch, activeProg } = usePassage();

  if (!activeProg) return null;

  const slots = [
    { slot: activeProg.origin, label: 'ORIGEN', type: 'origin' as const },
    ...activeProg.steps.map((s, i) => ({ slot: s, label: `STEP ${i + 1}`, type: 'step' as const })),
    { slot: activeProg.dest, label: 'DESTINO', type: 'dest' as const }
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-start p-6 pb-2">
        {slots.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="flex items-center justify-center text-[var(--color-brd2)] text-lg w-8 pt-[58px] shrink-0">→</div>}
            <div className="flex flex-col shrink-0">
              <StepCard
                slot={s.slot}
                label={s.label}
                type={s.type}
                selected={i === state.currentStepIndex}
                playing={state.playing && state.playStep === i}
                onClick={() => dispatch({ type: 'SET_STEP', payload: i })}
              />
            </div>
          </React.Fragment>
        ))}
        <button 
          onClick={() => dispatch({ type: 'ADD_STEP' })}
          className="w-14 h-14 rounded-full border-2 border-dashed border-[var(--color-brd2)] bg-transparent text-[var(--color-mut)] flex items-center justify-center transition-all shrink-0 mt-[53px] ml-4 hover:border-[var(--color-mut2)] hover:text-[var(--color-txt)] hover:bg-[var(--color-panel3)]"
          title="Agregar step"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
