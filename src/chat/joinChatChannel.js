import { newFollower, newSubscriber, resubscription } from "./channel";
import parseIrcMessage from "../util/parseIrcMessage";

let ws = null;

const joinChatChannel = ({ channel, newSubs, resubs, followers, bitMin, ttsVoice, volume, overrideList }, addMessage) => {

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

    console.log("received message: ");

    console.log(message);

    // Basic parsing of IRC message
    const parsedMessage = parseIrcMessage(message, channel);

    const newMessage = {
      ttsVoice,
      volume,
      text: '',
      username: 'twitch',
      readTTS: false
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

      // Check for bits cheered
      if ((parsedMessage.tags['bits'] && parseInt(parsedMessage.tags['bits']) >= bitMin) || bitMin < 1) {
        console.log('min cheer req met:', parsedMessage.tags['bits']);
        newMessage.readTTS = true;
      }

      if (denied) {
        console.log("deny-listed chatter!");
        newMessage.readTTS = false;
      }

      addMessage(newMessage);

    } else if (newFollower(parsedMessage)) {
      console.log("new follower!");
      newMessage.text = `Thanks for following, ${parsedMessage.tags['display-name']}!`;

      if (followers) {
        newMessage.readTTS = true;
      }

      addMessage(newMessage);

    } else if (resubscription(parsedMessage)) {
      console.log("resub!");
      
      newMessage.text =`${parsedMessage.tags['display-name']} just resubbed! They've subbed for ${parsedMessage.tags['msg-param-cumulative-months']} months!`;

      if (resubs) {
        newMessage.readTTS = true;
      }

      addMessage(newMessage);

    } else if (newSubscriber(parsedMessage)) {
      console.log("new subscriber!");

      newMessage.text = `Thanks for subscribing ${parsedMessage.tags['display-name']}!`;

      if (newSubs) {
        newMessage.readTTS = true;
      }

      addMessage(newMessage);

    }

  };
};

export default joinChatChannel;
