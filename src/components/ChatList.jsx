import React from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBookSharp';
import { List, ListItem, ListItemText, ListItemIcon, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, Diamond, Shield } from '@mui/icons-material';

const ChatList = ({ loading, messages, messagesEndRef, onPause, onReplay, playingId, playing, setPlaying }) => {
  if (loading) return (<CircularProgress />);

  return (
    <List style={{ padding: '0px 0px' }}>
      {messages.map((message, index) => (
        <ListItem key={index} 
          style={{ 
            backgroundColor: message.readTTS ? (message.id === playingId ? '#6cf567': '#e8f5e9') : message.username === 'client' ? '#c0c7dc': 'transparent' 
          }}
        >
          {message.readTTS && (
            <ListItemIcon>
              <MenuBookIcon style={{ color: '#66bb6a' }} />
            </ListItemIcon>
          )}
          {((playingId !== message.id || !playing) && message.readTTS) && (
            <ListItemIcon onClick={() => { 
              if (!playing) {
                setPlaying(true);
                window.speechSynthesis.resume();
              } else {
                onReplay(message.id)
              }
            }}>
              <PlayArrow color="primary" />
            </ListItemIcon>
          )}
          {(playingId === message.id && message.readTTS && playing && (
            <ListItemIcon onClick={onPause}>
              <Pause color="primary" />
            </ListItemIcon>
          ))}
          {(message.status && message.status === 'vip' && (
            <ListItemIcon>
              <Diamond />
            </ListItemIcon>
          ))}
          {(message.status && message.status === 'mod' && (
            <ListItemIcon>
              <Shield />
            </ListItemIcon>
          ))}
          <ListItemText primary={`${message.username}: ${message.text}`} />
        </ListItem>
      ))}
      <div ref={messagesEndRef} />
    </List>
  );
};

export default ChatList;
