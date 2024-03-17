const newFollower = (messageData) => (messageData.tags['msg-id'] === 'channel.follow');

export default newFollower;
