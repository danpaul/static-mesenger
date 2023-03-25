const fs = require('fs-extra')

import UserUrl from './UserUrl'
import Message, { MessageDataType } from './Message'
import Messenger from './Messenger'

export interface MainInterface {
  selfUrl: UserUrl
  publicDirRoot: string
}

export default class Main {
  #selfUrl: UserUrl
  #messenger: Messenger
  constructor({ selfUrl, publicDirRoot }: MainInterface) {
    this.#selfUrl = selfUrl
    this.#messenger = new Messenger({ url: selfUrl, publicDirRoot })
  }
  getSelfUrl() {
    return this.#selfUrl
  }
  async sendMessage(url: UserUrl, data: MessageDataType) {
    await this.#messenger.sendMessage(url, new Message({ data }))
  }
  async getMessages(url: UserUrl): Promise<Message[]> {
    return this.#messenger.getMessages(url)
  }

  async markMessageAsRead(toUrl: UserUrl, message: Message) {
    await this.#messenger.markMessageAsRead(toUrl, message)
  }

  async updateMessageQueue(url: UserUrl) {
    await this.#messenger.removeReadMessagesFromQueue(url)
  }
}
