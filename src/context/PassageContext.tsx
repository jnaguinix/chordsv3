import { createContext, useContext, useReducer, ReactNode, useEffect, useRef, Dispatch } from 'react';
import { Progression, Slot, DurationType, WaveType } from '../types';
import { playSlot, getDurationSecs, transposeNote } from '../lib/audio';
import { exampleProgressions } from '../lib/data';

interface State {
  progressions: Progression[];
  currentProgIndex: number;
  currentStepIndex: number;
  editMode: 'notes' | 'bass';
  octave: number;
  transpose: number;
  playing: boolean;
  playStep: number;
}

type Action =
  | { type: 'ADD_PROGRESSION'; payload: Progression }
  | { type: 'DELETE_PROGRESSION'; payload: number }
  | { type: 'SELECT_PROGRESSION'; payload: number }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_ACTIVE_PROG'; payload: Partial<Progression> }
  | { type: 'UPDATE_ACTIVE_SLOT'; payload: Partial<Slot> }
  | { type: 'ADD_STEP' }
  | { type: 'DELETE_CURRENT_STEP' }
  | { type: 'CLEAR_CURRENT_STEP' }
  | { type: 'SET_EDIT_MODE'; payload: 'notes' | 'bass' }
  | { type: 'SET_OCTAVE'; payload: number }
  | { type: 'SET_TRANSPOSE'; payload: number }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'STOP_PLAY' }
  | { type: 'SET_PLAY_STEP'; payload: number };

const initialState: State = {
  progressions: exampleProgressions,
  currentProgIndex: 0,
  currentStepIndex: 0,
  editMode: 'notes',
  octave: 3,
  transpose: 0,
  playing: false,
  playStep: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_PROGRESSION':
      return {
        ...state,
        progressions: [...state.progressions, action.payload],
        currentProgIndex: state.progressions.length,
        currentStepIndex: 0,
      };
    case 'DELETE_PROGRESSION': {
      const idx = action.payload;
      const newProgs = state.progressions.filter((_, i) => i !== idx);
      let newIdx = state.currentProgIndex;
      if (idx === state.currentProgIndex) {
        newIdx = newProgs.length > 0 ? Math.min(newIdx, newProgs.length - 1) : -1;
      } else if (idx < state.currentProgIndex) {
        newIdx--;
      }
      return { ...state, progressions: newProgs, currentProgIndex: newIdx, currentStepIndex: 0 };
    }
    case 'SELECT_PROGRESSION':
      return { ...state, currentProgIndex: action.payload, currentStepIndex: 0, transpose: 0, playing: false };
    case 'SET_STEP':
      return { ...state, currentStepIndex: action.payload };
    case 'UPDATE_ACTIVE_PROG': {
      if (state.currentProgIndex === -1) return state;
      const newProgs = [...state.progressions];
      newProgs[state.currentProgIndex] = { ...newProgs[state.currentProgIndex], ...action.payload };
      return { ...state, progressions: newProgs };
    }
    case 'UPDATE_ACTIVE_SLOT': {
      if (state.currentProgIndex === -1) return state;
      const prog = state.progressions[state.currentProgIndex];
      const newProgs = [...state.progressions];
      const newProg = { ...prog, steps: [...prog.steps] };
      
      if (state.currentStepIndex === 0) {
        newProg.origin = { ...newProg.origin, ...action.payload };
      } else if (state.currentStepIndex === prog.steps.length + 1) {
        newProg.dest = { ...newProg.dest, ...action.payload };
      } else {
        newProg.steps[state.currentStepIndex - 1] = { ...newProg.steps[state.currentStepIndex - 1], ...action.payload };
      }
      newProgs[state.currentProgIndex] = newProg;
      return { ...state, progressions: newProgs };
    }
    case 'ADD_STEP': {
      if (state.currentProgIndex === -1) return state;
      const newProgs = [...state.progressions];
      const newProg = { ...newProgs[state.currentProgIndex] };
      newProg.steps = [...newProg.steps, { notes: [], bass: [] }];
      newProgs[state.currentProgIndex] = newProg;
      return { ...state, progressions: newProgs, currentStepIndex: newProg.steps.length };
    }
    case 'DELETE_CURRENT_STEP': {
      if (state.currentProgIndex === -1) return state;
      const prog = state.progressions[state.currentProgIndex];
      if (state.currentStepIndex === 0 || state.currentStepIndex === prog.steps.length + 1) return state;
      const newProgs = [...state.progressions];
      const newProg = { ...prog };
      newProg.steps = newProg.steps.filter((_, i) => i !== state.currentStepIndex - 1);
      newProgs[state.currentProgIndex] = newProg;
      return { 
        ...state, 
        progressions: newProgs, 
        currentStepIndex: Math.min(state.currentStepIndex, newProg.steps.length + 1)
      };
    }
    case 'CLEAR_CURRENT_STEP': {
      if (state.currentProgIndex === -1) return state;
      return reducer(state, { type: 'UPDATE_ACTIVE_SLOT', payload: { notes: [], bass: [] } });
    }
    case 'SET_EDIT_MODE':
      return { ...state, editMode: action.payload };
    case 'SET_OCTAVE':
      return { ...state, octave: Math.max(0, Math.min(6, action.payload)) };
    case 'SET_TRANSPOSE': {
      if (state.currentProgIndex === -1) return state;
      const amount = action.payload - state.transpose; // calculate the delta (+1 or -1)
      if (amount === 0) return state;

      const transposeSlot = (slot: Slot) => ({
        notes: slot.notes.map(n => transposeNote(n, amount)),
        bass: slot.bass.map(n => transposeNote(n, amount))
      });

      const newProgs = [...state.progressions];
      const newProg = { ...newProgs[state.currentProgIndex] };
      newProg.origin = transposeSlot(newProg.origin);
      newProg.dest = transposeSlot(newProg.dest);
      newProg.steps = newProg.steps.map(transposeSlot);
      newProgs[state.currentProgIndex] = newProg;

      return { 
        ...state, 
        progressions: newProgs,
        transpose: Math.max(-12, Math.min(12, action.payload)) 
      };
    }
    case 'TOGGLE_PLAY':
      return { ...state, playing: !state.playing };
    case 'STOP_PLAY':
      return { ...state, playing: false, playStep: 0 };
    case 'SET_PLAY_STEP':
      return { ...state, playStep: action.payload, currentStepIndex: action.payload };
    default:
      return state;
  }
}

type PassageContextType = {
  state: State;
  dispatch: Dispatch<Action>;
  activeProg: Progression | null;
  activeSlot: Slot | null;
};

const PassageContext = createContext<PassageContextType | undefined>(undefined);

export function PassageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const activeProg = state.currentProgIndex >= 0 ? state.progressions[state.currentProgIndex] : null;
  const activeSlot = activeProg 
    ? state.currentStepIndex === 0 
      ? activeProg.origin 
      : state.currentStepIndex === activeProg.steps.length + 1 
        ? activeProg.dest 
        : activeProg.steps[state.currentStepIndex - 1] 
    : null;

  // Playback effect
  const playTimeout = useRef<number | null>(null);
  
  useEffect(() => {
    if (state.playing && activeProg) {
      const slots = [activeProg.origin, ...activeProg.steps, activeProg.dest];
      
      const playNext = (stepIndex: number) => {
        if (!state.playing) return;
        if (stepIndex >= slots.length) {
          dispatch({ type: 'STOP_PLAY' });
          return;
        }
        
        playSlot(slots[stepIndex], activeProg.duration, activeProg.bpm, activeProg.wave, activeProg.volume, 0);
        dispatch({ type: 'SET_PLAY_STEP', payload: stepIndex });
        
        const durSecs = getDurationSecs(activeProg.duration, activeProg.bpm);
        playTimeout.current = window.setTimeout(() => {
          playNext(stepIndex + 1);
        }, durSecs * 1000);
      };
      
      playNext(0);
    } else {
      if (playTimeout.current) clearTimeout(playTimeout.current);
    }
    
    return () => {
      if (playTimeout.current) clearTimeout(playTimeout.current);
    }
  }, [state.playing, activeProg?.id]);

  return (
    <PassageContext.Provider value={{ state, dispatch, activeProg, activeSlot }}>
      {children}
    </PassageContext.Provider>
  );
}

export function usePassage() {
  const context = useContext(PassageContext);
  if (context === undefined) {
    throw new Error('usePassage must be used within a PassageProvider');
  }
  return context;
}
