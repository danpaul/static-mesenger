const fs = require('fs-extra')

import axios from 'axios'
import UserUrl from './UserUrl'
import Message from './Message'
import Path from './Path'

/**
 * The `Messenger` class handles sending and receiving messages from and to
 *  remote urls
 */
export default class Messenger {
  #selfUrl: UserUrl
  #publicDirRoot: string

  /**
   * @param { url } Url Url object for the local server
   * @param { publicDirRoo } string The base directory for sending messages
   */
  constructor({ url, publicDirRoot }: { url: UserUrl; publicDirRoot: string }) {
    this.#selfUrl = url
    this.#publicDirRoot = publicDirRoot
  }

  /**
   * @param { toUrl } Url Url object for the remote url
   * @param { publicDirRoo } Message Message object to be sent to remote url
   * @about Send message to remote url
   */
  async sendMessage(toUrl: UserUrl, message: Message): Promise<void> {
    // create a file path for the local message
    const file = await Path.getOutboundMessageFile({
      toUrl,
      publicDirRoot: this.#publicDirRoot,
      message,
    })
    // write message to file
    await fs.writeFile(file, message.toJson())

    // add message to remote urls queue so they are aware of the message
    const queueFile = await Path.getOutboundQueueFile({
      toUrl,
      publicDirRoot: this.#publicDirRoot,
    })
    const queueFileExists = await fs.pathExists(queueFile)
    let messages: string[] = []
    if (queueFileExists) {
      messages = await fs.readJson(queueFile)
    }
    messages = [message.id, ...messages]
    await fs.writeJson(queueFile, messages)
  }

  /**
   * @param { toUrl } Url Url object for the remote url
   * @about Read messages from a remote url
   */
  async getMessages(toUrl: UserUrl): Promise<Message[]> {
    const remoteQueueUrl = Path.getRemoteQueueUrl({
      selfUrl: this.#selfUrl,
      toUrl,
    })
    try {
      const { data } = await axios.get(remoteQueueUrl)
      const messages = await Promise.all(
        data.map(async (messageId: string) => {
          const readFilePath = await Path.getMyReadFilePath({
            publicDirRoot: this.#publicDirRoot,
            toUrl,
            messageId,
          })
          const wasRead = await fs.pathExists(readFilePath)
          if (wasRead) {
            return null
          }
          const { data } = await axios.get(
            Path.getRemoteMessageUrl({
              toUrl,
              selfUrl: this.#selfUrl,
              messageId,
            })
          )
          return new Message(data)
        })
      )
      return messages.filter((m) => m)
    } catch (error) {
      return []
    }
  }
  /**
   * @param { toUrl } Url Url object for the remote url
   * @about Mark message as read so remote server can remove message from
   *  their queue
   */
  async markMessageAsRead(toUrl: UserUrl, message: Message): Promise<void> {
    const messagePath = await Path.getMyReadFilePath({
      publicDirRoot: this.#publicDirRoot,
      toUrl,
      messageId: message.id,
    })
    await fs.writeJson(
      messagePath,
      new Message({
        id: message.id,
        data: { wasRead: true, messageId: message.id },
      }).toObject()
    )
  }
  /**
   * @param { toUrl } Url Url object for the remote url
   * @about Removes messages from local queue that the remote url has indicated
   *  have been read.
   */
  async removeReadMessagesFromQueue(toUrl: UserUrl): Promise<void> {
    const queueFile = await Path.getOutboundQueueFile({
      toUrl,
      publicDirRoot: this.#publicDirRoot,
    })
    const queueFileExists = await fs.pathExists(queueFile)
    if (!queueFileExists) {
      return
    }
    const queue = await fs.readJson(queueFile)
    const urlDirectoryBase = Path.getUrlDirectoryBase({
      selfUrl: this.#selfUrl,
      toUrl,
    })
    const wasRead = await Promise.all(
      queue.map(async (messageId: string) => {
        try {
          const { data } = await axios.get(
            `${urlDirectoryBase}/read/${messageId}.json`
          )
          if (data?.data?.wasRead) {
            return { messageId, wasRead: true }
          }
        } catch (error) {
          return { messageId, wasRead: false }
        }
      })
    )
    const updatedQueue = wasRead
      .filter(({ wasRead }) => !wasRead)
      .map(({ messageId }) => messageId)
    fs.writeJson(queueFile, updatedQueue)
  }
}
