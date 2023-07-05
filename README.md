## About

Static Messenger is a simple TypeScript supported, Node utility which allows asynchronous server to server communication via JSON text files. When a message is sent to another server, it is simply written to a local file in a public web folder and added to a local JSON queue file. At some point later, the recipient server checks messages and updates a local file indicating that the message has been read. The first server is then able to check and see that the messages have been read and clean up its local queue.

All of that happens internally. The interface is simple and can best be show by example.

## Example

### Server A (https://foo.com)

```JavaScript
import { Messenger } from 'static-messsenger'

const selfUrl = 'https://foo.com'
const otherUrl = 'https://bar.com'

const messenger = new Messenger({
  selfUrl,
  publicDirRoot: `${__dirname}/public`, // public directory root for serving static assets
})

await messenger.sendMessage(otherUrl, 'hello!') // data argument can be anything that is JSON encondable
```

### Server B (https://bar.com), some time later

```JavaScript
import { Messenger } from 'static-messsenger'

const selfUrl = 'https://bar.com'
const otherUrl = 'https://foo.com'

const messenger = new Messenger({
  selfUrl,
  publicDirRoot: `${__dirname}/public`, // public directory root for serving static assets
})
let messages = await messenger.getMessages(otherUrl)
/**
 *  messages[0] output:
 *  {
 *    data: 'hello!',
 *    id: '60e989d7-cb2a-4ca7-9241-afaaed7fa440',
 *    created: '2023-03-25T19:09:33.743Z'
 *  }
 */
await messenger.markMessageAsRead(otherUrl, messages[0])

messages = await messenger.getMessages(otherUrl)
console.log(messages.length) // ~> 0

```

## TODO

- set non-root data directory path
- remove duplicate message ID for queue file
- use standard message objects in queue file
- move message queue cleanup utility to queue write
- publish to NPM
