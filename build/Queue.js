"use strict";
// ASDF - TODO - REMOVE
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
class Queue {
    #url;
    #publicDirRoot;
    constructor({ url, publicDirRoot, }) {
        this.#url = url;
        this.#publicDirRoot = publicDirRoot;
    }
    async getOutboundMessageDir() {
        if (!this.#publicDirRoot) {
            throw new Error(`#publicDirRoot in not defined`);
        }
        const dir = `${this.#publicDirRoot}/${this.#url.getUserKey()}`;
        await fs.ensureDir(dir);
        return dir;
    }
    async getOutboundMessageFile(message) {
        const dir = await this.getOutboundMessageDir();
        return `${dir}/${message.id}.json`;
    }
    async writeOutboundMessageToFile(message) {
        const file = await this.getOutboundMessageFile(message);
        await fs.writeFile(message, message.toJson());
    }
}
exports.default = Queue;
