const { Chord } = require('tonal');
console.log(Chord.detect(['C', 'E', 'G']));
console.log(Chord.detect(['C4', 'E4', 'G4']));
console.log(Chord.detect(['C', 'Eb', 'G']));
