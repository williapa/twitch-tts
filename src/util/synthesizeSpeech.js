function synthesizeSpeech(voice, message, volume) {
  let utterance = new SpeechSynthesisUtterance(message);
  utterance.voice = window.speechSynthesis.getVoices().find(v => v.name === voice);
  utterance.volume = volume / 100;
  window.speechSynthesis.speak(utterance);
}

export default synthesizeSpeech;
