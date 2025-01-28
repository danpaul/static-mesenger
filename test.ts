const express = require('express')
const app = express()
const fs = require('fs-extra')
const assert = require('assert')

import Messenger from './lib/Messenger'
import Message from './lib/Message'

const PORT = 3000
const TEST_DIR = `${__dirname}/.test`
const URL_BASE = `http://localhost:${PORT}`

app.use(express.static(TEST_DIR))
app.listen(PORT)

const test = async () => {
  // clear test directory
  console.log('cleaning test dir')
  await fs.remove(TEST_DIR)
  const users: { [key: string]: Messenger } = {}

  // create test users
  for (const letter of ['a', 'b']) {
    console.log(`creating user: ${letter}`)
    await fs.ensureDir(`${TEST_DIR}/${letter}`)
    users[letter] = new Messenger({
      selfUrl: `${URL_BASE}/${letter}`,
      publicDirRoot: `${TEST_DIR}/${letter}`,
    })
  }

  // get messages before sending
  let messages = await users['a'].getMessages(users['b'].getSelfUrl())
  assert(messages?.length === 0, 'There should be no messages')

  // send messages from at to b message
  await users['a'].sendMessage(
    users['b'].getSelfUrl(),
    new Message({ data: 'hello1' })
  )
  await users['a'].sendMessage(
    users['b'].getSelfUrl(),
    new Message({ data: 'hello2' })
  )
  await users['a'].sendMessage(
    users['b'].getSelfUrl(),
    new Message({ data: 'hello3' })
  )

  // confirm messages received
  console.log('getting 3 messages')
  messages = await users['b'].getMessages(users['a'].getSelfUrl())
  assert(messages?.length === 3, 'There should be three messages')
  console.log(messages)

  // confirm newest message is first
  assert(messages[0].data == 'hello3', 'The newest message should be first')

  // mrak messages as read
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

  await users['a'].removeReadMessagesFromQueue(users['b'].getSelfUrl())

  // const USER_X_URL = `${URL_BASE}/x`
  // const USER_Y_URL = `${URL_BASE}/y`

  // console.log('creating basic string based messengers')
  // const messengerX = new Messenger({
  //   selfUrl: USER_X_URL,
  //   publicDirRoot: `${TEST_DIR}/x`,
  // })
  // const messengerY = new Messenger({
  //   selfUrl: USER_Y_URL,
  //   publicDirRoot: `${TEST_DIR}/x`,
  // })

  // console.log('sending message')
  // await messengerX.sendMessage(USER_Y_URL, 'hello!')
  // console.log('getting message')
  // messages = await messengerY.getMessages(USER_X_URL)
  // assert(messages.length === 1, 'there should be one message')
  // assert(messages[0].data === 'hello!', 'message should be hello')

  // console.log(messages[0])

  console.log('success!!!')
}

test()
