// @ts-ignore
import Soundfont from 'soundfont-player';
import { normalizeNote } from './piano';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function noteToFreq(n: string): number {
  const norm = normalizeNote(n);
  const m = norm.match(/^([A-G]#?)(\d+)$/);
  if (!m) return 440;
  return 440 * Math.pow(2, ((parseInt(m[2]) + 1) * 12 + NOTE_NAMES.indexOf(m[1]) - 69) / 12);
}

let audioCtx: AudioContext | null = null;
export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

let instruments: Record<string, any> = {};

export async function initAudio() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  
  if (!instruments['piano']) {
    instruments['piano'] = await Soundfont.instrument(ctx, 'acoustic_grand_piano', { gain: 1.5 });
  }
  if (!instruments['epiano']) {
    instruments['epiano'] = await Soundfont.instrument(ctx, 'electric_piano_1', { gain: 1.5 });
  }
}

export function playNote(freq: number, dur: number, type: string, vol: number) {
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  const g = ctx.createGain();
  g.connect(ctx.destination);

  const o = ctx.createOscillator();
  o.frequency.value = freq;
  o.type = type === 'epiano' ? 'sine' : 'triangle';

  o.connect(g);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol * 0.8, t + 0.01);
  g.gain.exponentialRampToValueAtTime(vol * 0.3, t + 0.1);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  
  o.start(t);
  o.stop(t + dur + 0.05);
}

export function getDurationSecs(duration: string, bpm: number): number {
  const b = 60 / bpm;
  return { whole: b * 4, half: b * 2, quarter: b, eighth: b / 2 }[duration] || b;
}

export function transposeNote(n: string, s: number): string {
  if (!s) return n;
  const norm = Math.abs(s) > 0 ? normalizeNote(n) : n;
  const m = norm.match(/^([A-G]#?)(\d+)$/);
  if (!m) return n;
  const midi = parseInt(m[2]) * 12 + NOTE_NAMES.indexOf(m[1]) + s;
  return NOTE_NAMES[((midi % 12) + 12) % 12] + Math.floor(midi / 12);
}

export function playSlot(slot: any, duration: string, bpm: number, wave: string, volume: number, transpose: number) {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  // Try to pre-initialize if not done
  if (!instruments[wave] && Object.keys(instruments).length === 0) {
    initAudio(); // Fire and forget
  }

  const d = getDurationSecs(duration, bpm);
  const instrument = instruments[wave];
  
  if (instrument) {
    const time = ctx.currentTime;
    (slot.notes || []).forEach((n: string) => {
      const original = transposeNote(n, transpose);
      const note = normalizeNote(original); // Ensure valid MIDI format for soundfont
      instrument.play(note, time, { duration: d, gain: volume });
    });
    if (slot.bass) {
      (slot.bass as string[]).forEach((n: string) => {
        const original = transposeNote(n, transpose);
        const note = normalizeNote(original);
        // Play bass 1 octave lower since the synth used freq * 0.5
        const match = note.match(/^([A-G][b#]?)(\d+)$/);
        let playingNote = note;
        if (match) {
            playingNote = match[1] + (Math.max(1, parseInt(match[2]) - 1));
        }
        instrument.play(playingNote, time, { duration: d, gain: volume * 0.85 });
      });
    }
  } else {
    // Fallback to basic synth if samples not loaded yet
    (slot.notes || []).forEach((n: string) => playNote(noteToFreq(transposeNote(n, transpose)), d, wave, volume));
    if (slot.bass) {
      (slot.bass as string[]).forEach((n: string) => {
        playNote(noteToFreq(transposeNote(n, transpose)) * 0.5, d, wave, volume * 0.85);
      });
    }
  }
}

