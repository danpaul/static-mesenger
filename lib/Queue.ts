// ASDF - TODO - REMOVE

const fs = require('fs-extra')

import UserUrl from './UserUrl'
import Message from './Message'

export default class Queue {
  #url: UserUrl
  #publicDirRoot?: string | undefined
  constructor({
    url,
    publicDirRoot,
  }: {
    url: UserUrl
    publicDirRoot: string | undefined
  }) {
    this.#url = url
    this.#publicDirRoot = publicDirRoot
  }
  async getOutboundMessageDir() {
    if (!this.#publicDirRoot) {
      throw new Error(`#publicDirRoot in not defined`)
    }
    const dir = `${this.#publicDirRoot}/${this.#url.getUserKey()}`
    await fs.ensureDir(dir)
    return dir
  }
  async getOutboundMessageFile(message: Message) {
    const dir = await this.getOutboundMessageDir()
    return `${dir}/${message.id}.json`
  }
  async writeOutboundMessageToFile(message: Message) {
    const file = await this.getOutboundMessageFile(message)
    await fs.writeFile(message, message.toJson())
  }
}
