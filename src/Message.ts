import { URL } from 'node:url'
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'

export type MessageDataType = number | string | object | Array<any>

export interface MessageCreateInterface {
  data?: MessageDataType
  id?: string
  created?: string
}

export interface MessageObjectInterface {
  data: any
  id: string
  created: string
}

export default class Message {
  #data: MessageDataType
  #id: string
  #created: string

  constructor(options: MessageCreateInterface) {
    this.#data = options.data || ''
    this.#id = options.id || uuidv4()
    this.#created = options.created || new Date().toISOString()
  }

  get data() {
    return this.#data
  }
  get id() {
    return this.#id
  }
  get created() {
    return this.#created
  }

  toObject(): MessageObjectInterface {
    return {
      data: this.#data,
      id: this.#id,
      created: this.#created,
    }
  }

  toJson() {
    return JSON.stringify(this.toObject())
  }
}
