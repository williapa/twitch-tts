const newSubscriber = (messageData) => (messageData.tags['msg-id'] === 'sub');

export default newSubscriber;
