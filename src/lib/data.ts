import { Progression } from '../types';

export const exampleProgressions: Progression[] = [
  {
    id: 1,
    name: "Neo-Soul Groove (Cory Henry Style)",
    category: "Progresiones R&B / Neo-Soul",
    origin: { notes: ["G4", "A4", "C5", "E5"], bass: ["F3"] }, // Fmaj9
    dest: { notes: ["F4", "Bb4", "C5", "D5"], bass: ["G3"] }, // Gm11
    steps: [
      { notes: ["G#4", "D5", "G5"], bass: ["E3"] }, // E7#9
      { notes: ["G4", "C5", "D5", "E5"], bass: ["A3"] } // Am11
    ],
    bpm: 85,
    duration: 'quarter',
    wave: 'epiano',
    volume: 0.8
  },
  {
    id: 2,
    name: "Snarky Gospel Turnaround",
    category: "Progresiones R&B / Neo-Soul",
    origin: { notes: ["F4", "Ab4", "C5", "Eb5"], bass: ["Db3"] }, // Dbmaj7
    dest: { notes: ["F4", "Gb4", "Bb4", "Db5"], bass: ["Eb3"] }, // Ebm9
    steps: [
      { notes: ["E4", "Bb4", "Eb5", "Ab5"], bass: ["C3"] }, // C7alt
      { notes: ["Eb4", "Ab4", "Bb4", "C5"], bass: ["F3"] }  // Fm11
    ],
    bpm: 90,
    duration: 'half',
    wave: 'epiano',
    volume: 0.8
  },
  {
    id: 3,
    name: "Jacob's Lydian Descent",
    category: "Progresiones Jazz",
    origin: { notes: ["E4", "B4", "D5", "F#5"], bass: ["C3"] }, // Cmaj13#11
    dest: { notes: ["Bb4", "F5", "Ab5", "C6"], bass: ["Gb3"] }, // Gbmaj13#11
    steps: [
      { notes: ["D4", "A4", "C5", "E5"], bass: ["Bb3"] }, // Bbmaj13#11
      { notes: ["C4", "G4", "Bb4", "D5"], bass: ["Ab3"] } // Abmaj13#11
    ],
    bpm: 75,
    duration: 'half',
    wave: 'piano',
    volume: 0.8
  },
  {
    id: 4,
    name: "Tritone Sub Walkdown",
    category: "Progresiones Jazz",
    origin: { notes: ["F4", "A4", "C5", "E5"], bass: ["D3"] }, // Dm9
    dest: { notes: ["D#4", "A4", "D5", "G5"], bass: ["B3"] }, // B7#9
    steps: [
      { notes: ["F4", "B4", "Eb5", "Ab5"], bass: ["Db3"] }, // Db13
      { notes: ["E4", "G4", "B4", "D5"], bass: ["C3"] }  // Cmaj9
    ],
    bpm: 100,
    duration: 'half',
    wave: 'epiano',
    volume: 0.8
  },
  {
    id: 5,
    name: "Dilla Feel Downtempo",
    category: "Progresiones R&B / Neo-Soul",
    origin: { notes: ["G4", "Bb4", "D5", "F5"], bass: ["Eb3"] }, // Ebmaj9
    dest: { notes: ["Eb4", "A4", "D5", "G5"], bass: ["F3"] }, // F13
    steps: [
      { notes: ["F4", "A4", "C5", "E5"], bass: ["D3"] }, // Dm9
      { notes: ["Eb4", "G4", "Bb4", "D5"], bass: ["C3"] } // Cm9
    ],
    bpm: 80,
    duration: 'half',
    wave: 'epiano',
    volume: 0.8
  },
  {
    id: 6,
    name: "Minor to Dorian Shift",
    category: "Progresiones R&B / Neo-Soul",
    origin: { notes: ["G4", "C5", "D5", "E5"], bass: ["A3"] }, // Am11
    dest: { notes: ["G4", "B4", "D5", "F#5"], bass: ["A3"] }, // A13 (G/A)
    steps: [
      { notes: ["F#4", "C5", "E5", "B5"], bass: ["D3"] }, // D13
      { notes: ["F4", "A4", "C5", "E5"], bass: ["G3"] } // Fmaj7/G
    ],
    bpm: 110,
    duration: 'quarter',
    wave: 'epiano',
    volume: 0.8
  },
  {
    id: 7,
    name: "Gospel Alt Passing Chords",
    category: "Progresiones R&B / Neo-Soul",
    origin: { notes: ["E4", "B4", "D5", "G5"], bass: ["C3"] }, // Cmaj9
    dest: { notes: ["Gb4", "C5", "D5", "F5"], bass: ["Ab3"] }, // Ab13#11
    steps: [
      { notes: ["G#4", "D5", "G5", "C6"], bass: ["E3"] }, // E7#5#9
      { notes: ["G4", "C5", "D5", "E5"], bass: ["A3"] } // Am11
    ],
    bpm: 95,
    duration: 'half',
    wave: 'epiano',
    volume: 0.8
  },
  {
    id: 8,
    name: "Lingus Intro Vibe",
    category: "Progresiones Jazz",
    origin: { notes: ["G4", "A4", "D5", "F#5"], bass: ["E3"] }, // Em11
    dest: { notes: ["D#4", "A4", "C5", "G5"], bass: ["B3"] }, // B7alt
    steps: [
      { notes: ["E4", "B4", "D5", "F#5"], bass: ["C3"] }, // Cmaj7#11
      { notes: ["C4", "G4", "B4", "E5"], bass: ["A3"] } // Am9
    ],
    bpm: 120,
    duration: 'half',
    wave: 'epiano',
    volume: 0.8
  },
  {
    id: 9,
    name: "Diminished Gospel Walk",
    category: "Progresiones Jazz",
    origin: { notes: ["E4", "A4", "C5"], bass: ["F3"] }, // Fmaj7
    dest: { notes: ["D4", "G4", "Bb4", "D5"], bass: ["G3"] }, // Gm9
    steps: [
      { notes: ["E4", "G#4", "C5", "D#5"], bass: ["F#3"] }, // F#dim7
      { notes: ["E4", "G4", "C5", "D5"], bass: ["F3"] } // Fm9
    ],
    bpm: 88,
    duration: 'quarter',
    wave: 'piano',
    volume: 0.8
  },
  {
    id: 10,
    name: "Modern Quartal Voicings",
    category: "Progresiones Jazz",
    origin: { notes: ["F4", "Bb4", "Eb5", "Ab5"], bass: ["C3"] }, // C minor quartal
    dest: { notes: ["E4", "A4", "D5", "G5"], bass: ["B3"] }, // B minor quartal
    steps: [
      { notes: ["Eb4", "Ab4", "Db5", "Gb5"], bass: ["Bb3"] }, // Bb minor quartal
      { notes: ["F4", "Bb4", "Eb5", "Ab5"], bass: ["A3"] }  // A minor quartalish
    ],
    bpm: 105,
    duration: 'half',
    wave: 'epiano',
    volume: 0.8
  }
];
