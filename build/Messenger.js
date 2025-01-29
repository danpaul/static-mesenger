"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const axios_1 = __importDefault(require("axios"));
const UserUrl_1 = __importDefault(require("./UserUrl"));
const Message_1 = __importDefault(require("./Message"));
const Path_1 = __importDefault(require("./Path"));
const DEBUG = false;
/**
 * The `Messenger` class handles sending and receiving messages from and to
 *  remote urls
 */
class Messenger {
    #selfUrl;
    #publicDirRoot;
    /**
     * @param { url } Url Url object for the local server
     * @param { publicDirRoot } string The base directory for sending messages
     */
    constructor({ selfUrl, publicDirRoot, }) {
        this.#selfUrl = this.getUrl(selfUrl);
        this.#publicDirRoot = publicDirRoot;
    }
    getUrl(url) {
        return typeof url === 'string' ? new UserUrl_1.default({ url }) : url;
    }
    getSelfUrl() {
        return this.#selfUrl;
    }
    /**
     * @param { toUrl } Url|string Url object or string for the remote url
     * @param { publicDirRoot } Message Message object to be sent to remote url
     * @about Send message to remote url
     */
    async sendMessage(toUrl, messageInput) {
        const message = messageInput instanceof Message_1.default
            ? messageInput
            : new Message_1.default({ data: messageInput });
        // create a file path for the local message
        const file = await Path_1.default.getOutboundMessageFile({
            toUrl: this.getUrl(toUrl),
            publicDirRoot: this.#publicDirRoot,
            message,
        });
        // write message to file
        await fs.writeFile(file, message.toJson());
        // add message to remote urls queue so they are aware of the message
        const queueFile = await Path_1.default.getOutboundQueueFile({
            toUrl: this.getUrl(toUrl),
            publicDirRoot: this.#publicDirRoot,
        });
        const queueFileExists = await fs.pathExists(queueFile);
        let messages = [];
        if (queueFileExists) {
            messages = await fs.readJson(queueFile);
        }
        messages = [message.id, ...messages];
        await fs.writeJson(queueFile, messages);
    }
    /**
     * @param { toUrl } Url|string Url object or string for the remote url
     * @about Read messages from a remote url
     */
    async getMessages(toUrl) {
        const remoteQueueUrl = Path_1.default.getRemoteQueueUrl({
            selfUrl: this.#selfUrl,
            toUrl: this.getUrl(toUrl),
        });
        if (DEBUG) {
            console.log(`getting messages for ${this.getUrl(toUrl).getUrl()}`);
        }
        try {
            const { data } = await axios_1.default.get(remoteQueueUrl);
            const messages = await Promise.all(data.map(async (messageId) => {
                const readFilePath = await Path_1.default.getMyReadFilePath({
                    publicDirRoot: this.#publicDirRoot,
                    toUrl: this.getUrl(toUrl),
                    messageId,
                });
                const wasRead = await fs.pathExists(readFilePath);
                if (wasRead) {
                    return null;
                }
                const { data } = await axios_1.default.get(Path_1.default.getRemoteMessageUrl({
                    toUrl: this.getUrl(toUrl),
                    selfUrl: this.#selfUrl,
                    messageId,
                }));
                return new Message_1.default(data);
            }));
            return messages.filter((m) => m).map((m) => m.toObject());
        }
        catch (error) {
            return [];
        }
    }
    /**
     * @param { toUrl } Url|string Url object or string for the remote url
     * @about Mark message as read so remote server can remove message from
     *  their queue
     */
    async markMessageAsRead(toUrl, message) {
        if (DEBUG) {
            console.log(`marking message ${message.id} as read`);
        }
        const messagePath = await Path_1.default.getMyReadFilePath({
            publicDirRoot: this.#publicDirRoot,
            toUrl: this.getUrl(toUrl),
            messageId: message.id,
        });
        if (DEBUG) {
            console.log(`message path: ${messagePath}`);
        }
        await fs.writeJson(messagePath, new Message_1.default({
            id: message.id,
            data: { wasRead: true, messageId: message.id },
        }).toObject());
    }
    /**
     * @param { toUrl } Url|string Url object or string for the remote url
     * @about Removes messages from local queue that the remote url has indicated
     *  have been read.
     */
    async removeReadMessagesFromQueue(toUrl) {
        const queueFile = await Path_1.default.getOutboundQueueFile({
            toUrl: this.getUrl(toUrl),
            publicDirRoot: this.#publicDirRoot,
        });
        const queueFileExists = await fs.pathExists(queueFile);
        if (!queueFileExists) {
            return;
        }
        const queue = await fs.readJson(queueFile);
        const urlDirectoryBase = Path_1.default.getUrlDirectoryBase({
            selfUrl: this.getUrl(toUrl),
            toUrl: this.#selfUrl,
        });
        const wasRead = await Promise.all(queue.map(async (messageId) => {
            try {
                const { data } = await axios_1.default.get(`${urlDirectoryBase}/read/${messageId}.json`);
                if (data?.data?.wasRead) {
                    return { messageId, wasRead: true };
                }
            }
            catch (error) {
                return { messageId, wasRead: false };
            }
        }));
        const updatedQueue = wasRead
            .filter(({ wasRead }) => !wasRead)
            .map(({ messageId }) => messageId);
        fs.writeJson(queueFile, updatedQueue);
    }
}
exports.default = Messenger;
