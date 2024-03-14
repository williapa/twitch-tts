const newFollower = (messageData) => (messageData.tags['msg-id'] === 'channel.follow');

export default newFollower;

// or, "Thank you for following ${name} :)"