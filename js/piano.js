const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playNote(freq) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);

  osc.start();
  osc.stop(audioCtx.currentTime + 1);
}

function showNote(note) {
  const el = document.createElement('span');
  el.className = `note ${note.color}`;
  el.textContent = note.name;
  document.getElementById('piano-output').appendChild(el);
}

// === Note Generator ===
const NOTE_DATA = [];
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function generateNotes(startOctave = 3, count = 12) {
  NOTE_DATA.length = 0;
  let noteIndex = 0;
  for (let i = 0; i < count; i++) {
    const name = noteNames[noteIndex % 12] + Math.floor(startOctave + noteIndex / 12);
    const color = name.includes('#') ? 'black' : 'white';
    const freq = 440 * Math.pow(2, (i - 9) / 12); // A4 = 440Hz at index 9
    NOTE_DATA.push({ name, freq, color });
    noteIndex++;
  }
}

let keyCount = 12;

function renderVisualKeys() {
  const container = document.getElementById("piano-container");
  container.innerHTML = "";

  generateNotes(3, keyCount);

  let whiteOffset = 0;

  NOTE_DATA.forEach((note, i) => {
    const div = document.createElement("div");
    div.className = `note ${note.color}`;
    div.dataset.note = note.name;
    div.textContent = note.name;

    if (note.color === 'white') {
      div.style.left = `${whiteOffset * 42}px`;
      div.style.position = 'relative';
      whiteOffset++;
    } else {
      div.style.position = 'absolute';
      div.style.left = `${(whiteOffset - 0.5) * 42}px`;
      div.style.zIndex = 2;
    }

    div.onclick = () => {
      playNote(note.freq);
      showNote(note);
    };

    container.appendChild(div);
  });
}

// === Keyboard input: A-Z = 0–25 ===
document.addEventListener('keydown', e => {
  const index = e.keyCode - 65;
  if (index >= 0 && index < NOTE_DATA.length) {
    const note = NOTE_DATA[index];
    playNote(note.freq);
    showNote(note);
  }
});

// === Controls ===
window.setKeyCount = function(n) {
  keyCount = parseInt(n);
  renderVisualKeys();
};

window.switchStyle = function(styleName) {
  document.getElementById('style-link').href = `css/${styleName}.css`;
};

// Start
renderVisualKeys();
