const express = require('express')
const app = express()
const fs = require('fs-extra')
const assert = require('assert')

import Main from './lib/Main'
// import Messenger from './lib/Messenger'
import UserUrl from './lib/UserUrl'

const PORT = 3000
const TEST_DIR = `${__dirname}/.test`
const URL_BASE = `http://localhost:${PORT}`

app.use(express.static(TEST_DIR))
app.listen(PORT)

const test = async () => {
  console.log('cleaning test dir')
  await fs.remove(TEST_DIR)
  const users: { [key: string]: Main } = {}

  for (const letter of ['a', 'b']) {
    console.log(`creating user: ${letter}`)
    await fs.ensureDir(`${TEST_DIR}/${letter}`)
    users[letter] = new Main({
      selfUrl: new UserUrl({ url: `${URL_BASE}/${letter}` }),
      publicDirRoot: `${TEST_DIR}/${letter}`,
    })
  }

  console.log('getting 0 messages')
  let messages = await users['a'].getMessages(users['b'].getSelfUrl())
  assert(messages?.length === 0, 'There should be no messages')

  console.log('adding messages')
  await users['a'].sendMessage(users['b'].getSelfUrl(), 'hello1')
  await users['a'].sendMessage(users['b'].getSelfUrl(), 'hello2')
  await users['a'].sendMessage(users['b'].getSelfUrl(), 'hello3')

  console.log('getting 3 messages')
  messages = await users['b'].getMessages(users['a'].getSelfUrl())
  assert(messages?.length === 3, 'There should be three messages')

  if (messages?.[0]) {
    console.log('marking message as read')
    await users['b'].markMessageAsRead(users['a'].getSelfUrl(), messages[0])
  }
  console.log('getting 2 messages')
  messages = await users['b'].getMessages(users['a'].getSelfUrl())
  assert(messages?.length === 2, 'There should be two messages')

  if (messages?.[0]) {
    console.log('marking message as read')
    await users['b'].markMessageAsRead(users['a'].getSelfUrl(), messages[0])
  }

  console.log('getting 1 message')
  messages = await users['b'].getMessages(users['a'].getSelfUrl())
  assert(messages?.length === 1, 'There should be one message')

  if (messages?.[0]) {
    console.log('marking message as read')
    await users['b'].markMessageAsRead(users['a'].getSelfUrl(), messages[0])
  }
  console.log('getting 0 messages')
  messages = await users['b'].getMessages(users['a'].getSelfUrl())
  assert(messages?.length === 0, 'There should be no messages')

  await users['a'].updateMessageQueue(users['b'].getSelfUrl())
  console.log('success!!!')
}

test()
