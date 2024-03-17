const giftSubscriber = (parsedMessage) => (parsedMessage.tags['msg-id'] === 'subgift');

export default giftSubscriber;
