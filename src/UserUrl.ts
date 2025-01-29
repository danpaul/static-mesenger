import { URL } from 'node:url'

export interface UserUrlInterface {
  url: string
}

export default class UserUrl {
  #protocol: string
  #hostname: string
  #pathname: string
  #port: string

  constructor(options: UserUrlInterface) {
    const url = new URL(options.url.toLowerCase())
    this.#protocol = url.protocol
    this.#hostname = url.hostname
    this.#pathname = url.pathname
    this.#port = url.port
  }
  getPort() {
    return this.#port ? `:${this.#port}` : ''
  }
  getUrlWithoutProtocol() {
    return `${this.#hostname}${this.getPort()}${this.#pathname}`
  }
  getUrl() {
    return `${this.#protocol}//${this.getUrlWithoutProtocol()}`
  }
  getUserKey() {
    return Buffer.from(this.getUrlWithoutProtocol()).toString('base64')
  }
}
