export type NoteStr = string;

export interface Slot {
  notes: NoteStr[];
  bass: NoteStr[];
}

export type DurationType = 'whole' | 'half' | 'quarter' | 'eighth';
export type WaveType = 'piano' | 'epiano';

export interface Progression {
  id: number;
  name: string;
  category?: string;
  origin: Slot;
  dest: Slot;
  steps: Slot[];
  bpm: number;
  duration: DurationType;
  wave: WaveType;
  volume: number;
}
