# TWITCH TTS

Free twitch tts with configurable options for bit donations, subscribers, followers, and explicit users. 

## Todos
3-18 
1 [X] - hilight playing message
2 [X] - Loading indicator
3 [X] - error for invalid channel
4 [X] - fix form sizing on mobile
5 [X] - keep save, remove load and auto-load settings
6 [X] - limit chat container history
7 [X] - color client messages
8 [X] - new skip control (skip single message)
9 [X] - replay button on any green message
10 [X] - icons for vip/mod
11 [X] - play bug when stream was paused before (and same channel) (??? maybe worse?)

## Backlog todos
- channel point redeems (separate socket, connection, rules, error state)
- play/pause icon on chat message (hilighting seems less cluttered, maybe it could be animated)
- regex validation on channel name - they've changed the rules on channel names, some are actually only 1 letter - stick with the explicit socket error, let everything else fly even though you could try to prevent submit when there are spaces or other invalid characters.
- focusing playing message - worried about too much scrolling around, might make sense to revisit this - optionally stick ref on playing message instead of last message.
- custom alert messages (like for subscriptions, follows, raids.)
- custom voice per user (too niche)
- display emotes / skip emotes (i like when it reads the emotes)
- raid alert / message
- indicate when form values have changed but are not playing 
- rethink play / form connection. should the form auto save? should unpause refresh config?
- instead of save working as an auto-load for preferences, make saved profiles (modal form) and load by name (query param or form)
- help text / description / about / form sections / ??? 
- skip links option
- button to focus playing message 
