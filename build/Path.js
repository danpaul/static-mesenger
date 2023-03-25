"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const READ_PATH = '/read';
class Path {
    static async getOutboundMessageDir({ publicDirRoot, toUrl, }) {
        const dir = `${publicDirRoot}/${toUrl.getUserKey()}`;
        await fs.ensureDir(dir);
        return dir;
    }
    static async getOutboundMessageFile({ message, publicDirRoot, toUrl, }) {
        const dir = await Path.getOutboundMessageDir({ publicDirRoot, toUrl });
        return `${dir}/${message.id}.json`;
    }
    static async getOutboundQueueFile({ publicDirRoot, toUrl, }) {
        const dir = await Path.getOutboundMessageDir({ publicDirRoot, toUrl });
        return `${dir}/index.json`;
    }
    static getToUrlBase({ selfUrl, toUrl, }) {
        return `${toUrl.getUrl()}/${encodeURIComponent(selfUrl.getUserKey())}`;
    }
    static getRemoteQueueUrl({ selfUrl, toUrl, }) {
        return `${Path.getToUrlBase({ selfUrl, toUrl })}/index.json`;
    }
    static getRemoteMessageUrl({ selfUrl, toUrl, messageId, }) {
        return `${Path.getToUrlBase({ selfUrl, toUrl })}/${messageId}.json`;
    }
    static async getMyReadDirBase({ publicDirRoot, toUrl, }) {
        const dir = `${publicDirRoot}/${toUrl.getUserKey()}/${READ_PATH}`;
        await fs.ensureDir(dir);
        return dir;
    }
    static async getMyReadFilePath({ publicDirRoot, toUrl, messageId, }) {
        const base = await Path.getMyReadDirBase({
            publicDirRoot,
            toUrl,
        });
        return `${base}/${messageId}.json`;
    }
    static getUrlDirectoryBase({ toUrl, selfUrl, }) {
        return `${selfUrl.getUrl()}/${encodeURIComponent(toUrl.getUserKey())}`;
    }
}
exports.default = Path;
