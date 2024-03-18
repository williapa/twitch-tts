
import './App.css';
import { useState } from "react";
import TTSConfigurator from './components/TTSConfigurator.jsx';
import ChatBox from './components/ChatBox.jsx';
import joinChatChannel from './chat/joinChatChannel.js'
import synthesizeSpeech from './util/synthesizeSpeech.js';

function App() {

  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const addMessage = (newMessage) => {
    if (newMessage.readTTS) {
      synthesizeSpeech(newMessage.ttsVoice, newMessage.text, newMessage.volume);
    }
    setChatMessages((currentMessages) => [...currentMessages, newMessage]);
  }

  const onPlay = (formData) => {
    console.log(formData);
    const ws = joinChatChannel(formData, addMessage);
    setSocket(ws);
    return true;
  };

  const onStop = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  const clear = (channelName) => {
    setChatMessages([{ username: 'client', text: `Joining new channel - ${channelName}`, readTTS: false }]);
  };

  return (
    <div className="App">
      <TTSConfigurator clear={clear}
        onPlay={onPlay}
        onStop={onStop}
        addMessage={addMessage}
      />
      <ChatBox messages={chatMessages}></ChatBox>
    </div>
  );
}

export default App;
