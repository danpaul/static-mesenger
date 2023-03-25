import { URL } from 'node:url'
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'

export type MessageDataType = number | string | object | Array<any>

export interface MessageCreateInterface {
  data?: MessageDataType
  id?: string
  created?: number
}

export default class Message {
  #data: MessageDataType
  #id: string
  #created: number

  constructor(options: MessageCreateInterface | string) {
    const inputData =
      typeof options === 'string' ? JSON.parse(options) : options
    this.#data = inputData.data || ''
    this.#id = inputData.id || uuidv4()
    this.#created = inputData.created || Date.now()
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

  toObject() {
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
