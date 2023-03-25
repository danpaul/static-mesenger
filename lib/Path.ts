const fs = require('fs-extra')

import UserUrl from './UserUrl'
import Message from './Message'

const READ_PATH = '/read'

export default class Path {
  static async getOutboundMessageDir({
    publicDirRoot,
    toUrl,
  }: {
    publicDirRoot: string
    toUrl: UserUrl
  }) {
    const dir = `${publicDirRoot}/${toUrl.getUserKey()}`
    await fs.ensureDir(dir)
    return dir
  }
  static async getOutboundMessageFile({
    message,
    publicDirRoot,
    toUrl,
  }: {
    message: Message
    publicDirRoot: string
    toUrl: UserUrl
  }) {
    const dir = await Path.getOutboundMessageDir({ publicDirRoot, toUrl })
    return `${dir}/${message.id}.json`
  }
  static async getOutboundQueueFile({
    publicDirRoot,
    toUrl,
  }: {
    publicDirRoot: string
    toUrl: UserUrl
  }) {
    const dir = await Path.getOutboundMessageDir({ publicDirRoot, toUrl })
    return `${dir}/index.json`
  }
  static getToUrlBase({
    selfUrl,
    toUrl,
  }: {
    selfUrl: UserUrl
    toUrl: UserUrl
  }) {
    return `${toUrl.getUrl()}/${encodeURIComponent(selfUrl.getUserKey())}`
  }
  static getRemoteQueueUrl({
    selfUrl,
    toUrl,
  }: {
    selfUrl: UserUrl
    toUrl: UserUrl
  }) {
    return `${Path.getToUrlBase({ selfUrl, toUrl })}/index.json`
  }
  static getRemoteMessageUrl({
    selfUrl,
    toUrl,
    messageId,
  }: {
    selfUrl: UserUrl
    toUrl: UserUrl
    messageId: string
  }) {
    return `${Path.getToUrlBase({ selfUrl, toUrl })}/${messageId}.json`
  }
  static async getMyReadDirBase({
    publicDirRoot,
    toUrl,
  }: {
    publicDirRoot: string
    toUrl: UserUrl
  }) {
    const dir = `${publicDirRoot}/${toUrl.getUserKey()}/${READ_PATH}`
    await fs.ensureDir(dir)
    return dir
  }
  static async getMyReadFilePath({
    publicDirRoot,
    toUrl,
    messageId,
  }: {
    publicDirRoot: string
    toUrl: UserUrl
    messageId: string
  }) {
    const base = await Path.getMyReadDirBase({
      publicDirRoot,
      toUrl,
    })
    return `${base}/${messageId}.json`
  }
  static getUrlDirectoryBase({
    toUrl,
    selfUrl,
  }: {
    toUrl: UserUrl
    selfUrl: UserUrl
  }) {
    return `${selfUrl.getUrl()}/${encodeURIComponent(toUrl.getUserKey())}`
  }
}
