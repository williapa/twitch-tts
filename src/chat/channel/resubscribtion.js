const resubscription = (parsedMessage) => (parsedMessage.tags['msg-id'] === 'resub');

export default resubscription;
