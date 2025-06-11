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

document.addEventListener('keydown', e => {
  const key = e.key.toUpperCase();
  const note = window.keyToNote?.[key];
  if (note) {
    playNote(note.freq);

    const el = document.createElement('span');
    el.className = `note ${note.color}`;
    el.textContent = note.name;
    document.getElementById('piano-output').appendChild(el);
  }
});

window.switchStyle = function(styleName) {
  document.getElementById('style-link').href = `css/${styleName}.css`;
};

window.switchKeymap = function(keymapName) {
  const oldScript = document.getElementById('keymap-script');
  const newScript = document.createElement('script');
  newScript.id = 'keymap-script';
  newScript.src = `js/keymap_${keymapName}.js`;
  document.body.replaceChild(newScript, oldScript);
};
