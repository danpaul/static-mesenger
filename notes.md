## Messaging flow

- messaging service
  - send message(userId, message)
    - in send folder create user message directory if not exist: `/[remote user id]/messages`
    - create message file in user directory (utc timestamp.json): `/[remote user id]/messages/[UTC Timestamp].json`
    - create index.json file if not exists: `/[remote user id]/messages/index.json`
    - add message to message queue in index.json file
  - receive message
    - check remote json file for unread messages: `[remote user url]/[my user id]/messages/index.json`
    - get message referenced in index.json: `[remote user url]/[my user id]/messages/[UTC Timestamp].json`
    - handle message
    - add read message to `/[remote user id]/read/[message.id].json`
  - check for received message
    - check if message was read: `[remote user url]/[remote user id]/read/[message.id].json`
    - remove message from message queue: `/[remote user id]/messages/index.json`

## User ID generation

- lowercase url with trailing slash removed
- base64 encoded

## Architecture

- main
  - props
    - self url
    - public dir root
  - methods
    - send message
    - read messages
    - set message as read
