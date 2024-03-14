import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Typography, Paper } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBookSharp';

const ChatBox = ({ messages }) => {
  const messagesEndRef = React.useRef(null);
  // scroll to new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages]);
  // each message object in the 'messages' array has 'username', 'text', and 'readTTS' properties
  return (
    <Paper style={{ maxHeight: 360, overflow: 'auto', padding: '0px', marginTop: '20px', marginLeft: '30px', marginRight: '30px' }}>
      <Typography variant='h6' style={{ 
        position: 'sticky', 
        top: 0,
        backgroundColor: '#66bb6a',
        zIndex: 2,
        padding: '10px',
        border: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        Chat
      </Typography>

      <List style={{ padding: '0px 0px' }}>
        {messages.map((message, index) => (
          <ListItem key={index} style={{ backgroundColor: message.readTTS ? '#e8f5e9' : 'transparent' }}>
            {message.readTTS && (
              <ListItemIcon>
                <MenuBookIcon style={{ color: '#66bb6a' }} />
              </ListItemIcon>
            )}
            <ListItemText primary={`${message.username}: ${message.text}`} />
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
    </Paper>
  );
};

export default ChatBox;
