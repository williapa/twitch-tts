
import './App.css';
import { useState } from "react";
import TTSConfigurator from './components/TTSConfigurator.jsx';
import ChatBox from './components/ChatBox.jsx';
import joinChatChannel from './chat/joinChatChannel.js'
import synthesizeSpeech from './util/synthesizeSpeech.js';

function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addMessage = (newMessage) => {
    if (newMessage.readTTS) {
      synthesizeSpeech(newMessage, setPlayingId);
    }

    setChatMessages((currentMessages) => {
      if (currentMessages.length > 2000) currentMessages.shift();
      return [...currentMessages, newMessage];
    });
  };

  const onSkipOne = () => {
    window.speechSynthesis.pause();
    window.speechSynthesis.cancel();

    const indexOf = chatMessages.findIndex((message) => (message.id === playingId));

    chatMessages.slice(indexOf + 1).forEach((message) => {
      // not using add message because we arent adding new messages to the chat, just re-enqueueing the utterance
      if (message.readTTS) {
        synthesizeSpeech(message, setPlayingId);
      }
    })
  };

  const onPause = () => {
    setPlaying(false);
    window.speechSynthesis.pause();
    addMessage({ text: 'TTS paused.', username: 'client', readTTS: false });
  }

  const onPlay = (formData) => {
    console.log(formData);
    window.speechSynthesis.cancel();
    const ws = joinChatChannel(formData, addMessage, setLoading, setError);
    setSocket(ws);
    return true;
  };

  const onReplay = (id) => {
    window.speechSynthesis.cancel();
    const indexOf = chatMessages.findIndex((message) => (message.id === id));
    setPlaying(true);
    chatMessages.slice(indexOf).forEach((message) => {
      if (message.readTTS) {
        synthesizeSpeech(message, setPlayingId);
      }
    });
    
    addMessage({ text: 'TTS replaying.', username: 'client', readTTS: false });
  };

  const onStop = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    setPlayingId(null);
    setPlaying(false);
    window.speechSynthesis.cancel();
  };

  const clear = (channelName) => {
    setChatMessages([{ username: 'client', text: `Joining new channel - ${channelName}`, readTTS: false }]);
  };

  return (
    <div className="App">
      <TTSConfigurator clear={clear}
        onPlay={onPlay}
        onSkipOne={onSkipOne}
        onStop={onStop}
        playing={playing}
        setPlaying={setPlaying}
        addMessage={addMessage}
        error={error}
      />
      <ChatBox loading={loading}
        messages={chatMessages}
        onPause={onPause}
        onReplay={onReplay}
        playingId={playingId}
        playing={playing}
        setPlaying={setPlaying}
      />
    </div>
  );
}

export default App;
