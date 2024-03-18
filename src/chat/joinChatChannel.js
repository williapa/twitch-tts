import { giftSubscriber, newFollower, newSubscriber, resubscription } from "./channel";
import parseIrcMessage from "../util/parseIrcMessage";

let ws = null;

const joinChatChannel = ({ 
  channel,
  newSubs,
  resubs,
  followers,
  bitMin,
  ttsVoice,
  volume,
  overrideList,
  vips,
  mods,
  giftSubs,
}, addMessage) => {

  if (!channel) return;
  
  if (ws) ws.close();

  const allowList = overrideList.filter((item) => (item.allow)).map(({ chatName }) => chatName);

  const denyList = overrideList.filter((item) => (!item.allow)).map(({ chatName }) => chatName);

  ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

  ws.onopen = () => {
    console.log('Connected to Twitch IRC');

    // Anonymous login
    ws.send('PASS none');
    ws.send('NICK justinfan12345');
    ws.send('CAP REQ :twitch.tv/commands');
    ws.send('CAP REQ :twitch.tv/tags');
    ws.send(`JOIN #${channel}`);
  };

  ws.onmessage = (event) => {
    const message = event.data;
    // todo: confirm connect to channel chat or display error
    console.log(message);

    if(message === "PING :tmi.twitch.tv") {
      console.log('Received PING, sending PONG...');
      ws.send('PONG :tmi.twitch.tv'); // Responding with PONG to maintain the connection
      return;
    }

    // Basic parsing of IRC message
    const parsedMessage = parseIrcMessage(message, channel);

    const newMessage = {
      ttsVoice,
      volume,
      text: '',
      username: 'twitch',
      readTTS: false,
      status: false
    };

    // Filter for PRIVMSG which indicates a chat message
    if (parsedMessage.command === 'PRIVMSG') {
      newMessage.text = parsedMessage.trailing;
      newMessage.username = parsedMessage.prefix.split('!')[0];

      const allowed = allowList.includes(newMessage.username.toLowerCase());
      const denied = denyList.includes(newMessage.username.toLowerCase());

      if (allowed) {
        console.log('allow-listed chatter!');
        newMessage.readTTS = true;
      }

      // vip 
      if (parsedMessage.tags['vip'] === '1') {
        console.log('VIP message!');
        newMessage.status = 'vip';
        if (vips) {
          newMessage.readTTS = true;
        }
      }

      // mod 
      if (parsedMessage.tags['user-type'] === 'mod') { 
        console.log('Mod message!');
        newMessage.status = 'mod';
        if (mods) {
          newMessage.readTTS = true;
        }
      }

      // Check for bits cheered
      if ((parsedMessage.tags['bits'] && parseInt(parsedMessage.tags['bits']) >= bitMin) || bitMin < 1) {
        console.log('min cheer req met:', parsedMessage.tags['bits']);
        newMessage.readTTS = true;
      }

      if (denied) {
        console.log("deny-listed chatter!");
        newMessage.readTTS = false;
      }
    } else if (newFollower(parsedMessage)) {
      console.log("new follower!");
      newMessage.text = `Thanks for following, ${parsedMessage.tags['display-name']}!`;

      if (followers) {
        newMessage.readTTS = true;
      }
    } else if (resubscription(parsedMessage)) {
      console.log("resub!");
      
      newMessage.text =`${parsedMessage.tags['display-name']} just resubscribed! They've subscribed for ${parsedMessage.tags['msg-param-cumulative-months']} months! ${parsedMessage.trailing}`;

      if (resubs) {
        newMessage.readTTS = true;
      }
    } else if (newSubscriber(parsedMessage)) {
      console.log('new subscriber!');

      newMessage.text = `Thanks for subscribing ${parsedMessage.tags['display-name']}!`;

      if (newSubs) {
        newMessage.readTTS = true;
      }
    } else if (giftSubscriber(parsedMessage)) {
      console.log('gifted subs!');

      newMessage.text = parsedMessage.tags['system-msg'].replace('\s', ' ');

      if (giftSubs) {
        newMessage.readTTS = true;
      }
    } else {
      return;
    }
    // for any case other than else add Message
    addMessage(newMessage);
  };

  return ws;

};

export default joinChatChannel;
