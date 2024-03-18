import { useState, useRef, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Typography, Paper } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBookSharp';

const ChatBox = ({ messages }) => {
  const messagesEndRef = useRef(null);
  // scroll to new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const [height, setHeight] = useState(0);
  const elementRef = useRef(null);

  const updateHeight = () => {
    if (elementRef.current) {
      const topPosition = elementRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const availableHeight = windowHeight - topPosition;
      setHeight(availableHeight > 0 ? availableHeight : 0);
    }
  };

  useEffect(() => {
    updateHeight(); // Set initial height
    window.addEventListener('resize', updateHeight); // Update height on resize

    return () => {
      window.removeEventListener('resize', updateHeight); // Cleanup listener
    };
  }, []);

  // each message object in the 'messages' array has 'username', 'text', and 'readTTS' properties
  return (
    <Paper ref={elementRef} style={{ minHeight:`${Math.max(120, height - 30)}px`, maxHeight: `${height - 30}px`, overflow: 'auto', padding: '0px', marginTop: '20px', marginLeft: '30px', marginRight: '30px' }}>
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
            <ListItemText primary={`${message.username}${message.status? ` (${message.status})`: ''}: ${message.text}`} />
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
    </Paper>
  );
};

export default ChatBox;
