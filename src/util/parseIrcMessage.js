function parseIrcMessage(message, channel) {
  const parts = message.split(' ');
  // Extract tags, removing the '@' prefix and splitting by semicolon
  const tagsPart = parts[0].startsWith('@') ? parts.shift().substr(1) : '';
  let trailing = parts[parts.length - 1].substring(1);
  const channelDelimiter = `#${channel.toLowerCase()} :`;
  const isMessage = message.indexOf(channelDelimiter);
  if (isMessage > -1) {
    trailing = message.substring(isMessage + channelDelimiter.length);
  }

  const tags = tagsPart.split(';').reduce((acc, tag) => {
    const [key, value] = tag.split('=');
    acc[key] = value;
    return acc;
  }, {});

  return {
    tags,
    trailing,
    command: parts[1],
    params: parts.slice(2, parts.length - 1),
    prefix: parts[0].substring(1),
  };
}

export default parseIrcMessage;
