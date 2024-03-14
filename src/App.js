
import './App.css';
import { useState } from "react";
import TTSConfigurator from './components/TTSConfigurator.jsx';
import ChatBox from './components/ChatBox.jsx';
import joinChatChannel from './chat/joinChatChannel.js'
import synthesizeSpeech from './util/synthesizeSpeech.js';

function App() {

  const [chatMessages, setChatMessages] = useState([]);

  const addMessage = (newMessage) => {
    if (newMessage.readTTS) {
      synthesizeSpeech(newMessage.ttsVoice, newMessage.text, newMessage.volume);
    }
    setChatMessages((currentMessages) => [...currentMessages, newMessage]);
  }

  const onSave = (formData) => {
    console.log(formData);
    joinChatChannel(formData, addMessage);
  };

  return (
    <div className="App">
      <TTSConfigurator onSave={onSave}></TTSConfigurator>
      <ChatBox messages={chatMessages}></ChatBox>
    </div>
  );
}

export default App;
