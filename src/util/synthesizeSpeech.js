function synthesizeSpeech({ ttsVoice, text, volume, id }, setPlayingId) {
  let utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = window.speechSynthesis.getVoices().find(v => v.name === ttsVoice);
  utterance.volume = volume / 100;
  utterance.onstart = () => {
    setPlayingId(id);
  };
  utterance.onend = () => {
    setPlayingId(null);
  }
  window.speechSynthesis.speak(utterance);
}

export default synthesizeSpeech;
