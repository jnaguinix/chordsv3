import { Chord } from 'tonal';

export const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

export const ENHARMONICS: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  'E#': 'F',
  'B#': 'C',
  'Cb': 'B',
  'Fb': 'E'
};

export function normalizeNote(note: string): string {
  const match = note.match(/^([A-G][b#]?)(.*)$/);
  if (!match) return note;
  const name = match[1];
  let octave = parseInt(match[2]);
  
  if (name === 'Cb') { octave -= 1; return `B${octave}`; }
  if (name === 'B#') { octave += 1; return `C${octave}`; }
  
  return (ENHARMONICS[name] || name) + match[2];
}

export function generateKeys(startOctave: number = 1, numOctaves: number = 7, includeLastC: boolean = true) {
  let allN = [] as {ni: number, oct: number, ns: string, isB: boolean}[];
  
  for(let o = startOctave; o < startOctave + numOctaves; o++) {
    for(let ni = 0; ni < 12; ni++) {
      allN.push({
        ni,
        oct: o,
        ns: NOTE_NAMES[ni] + o,
        isB: [1, 3, 6, 8, 10].includes(ni)
      });
    }
  }
  
  if (includeLastC) {
    allN.push({
      ni: 0,
      oct: startOctave + numOctaves,
      ns: 'C' + (startOctave + numOctaves),
      isB: false
    });
  }
  
  return allN;
}

export function identifyChord(notes: string[]): string {
  if (!notes || notes.length === 0) return 'n/a';
  // Strip octave digits (e.g. "C4" -> "C")
  const stripped = notes.map(n => n.replace(/\d+$/, ''));
  // Unique notes only to avoid duplications throwing off the detection
  const uniqueKeys = Array.from(new Set(stripped));
  if (uniqueKeys.length < 2) return 'n/a'; // Not much of a chord if 1 note
  const detected = Chord.detect(uniqueKeys);
  if (detected.length === 0) return 'n/a';
  
  let name = detected[0];
  
  // Prefer standard flat names over awkward sharp ones
  name = name.replace(/^A#/, 'Bb');
  name = name.replace(/^D#/, 'Eb');
  name = name.replace(/^G#/, 'Ab');
  name = name.replace(/M$/, ''); // C M -> C
  
  if (name.includes('M/')) name = name.replace('M/', '/'); 

  return name;
}
