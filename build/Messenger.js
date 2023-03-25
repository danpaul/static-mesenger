"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const axios_1 = __importDefault(require("axios"));
const Message_1 = __importDefault(require("./Message"));
const Path_1 = __importDefault(require("./Path"));
class Messenger {
    #selfUrl;
    #publicDirRoot;
    constructor({ url, publicDirRoot }) {
        this.#selfUrl = url;
        this.#publicDirRoot = publicDirRoot;
    }
    async sendMessage(toUrl, message) {
        /**
         * Create message file
         */
        const file = await Path_1.default.getOutboundMessageFile({
            toUrl,
            publicDirRoot: this.#publicDirRoot,
            message,
        });
        await fs.writeFile(file, message.toJson());
        /**
         * Add message to user's queue
         */
        const queueFile = await Path_1.default.getOutboundQueueFile({
            toUrl,
            publicDirRoot: this.#publicDirRoot,
        });
        const queueFileExists = await fs.pathExists(queueFile);
        let messages = [];
        if (queueFileExists) {
            messages = await fs.readJson(queueFile);
        }
        // ASDF - TODO - update queue message
        messages = [message.id, ...messages];
        await fs.writeJson(queueFile, messages);
    }
    async getMessages(toUrl) {
        const remoteQueueUrl = Path_1.default.getRemoteQueueUrl({
            selfUrl: this.#selfUrl,
            toUrl,
        });
        try {
            const { data } = await axios_1.default.get(remoteQueueUrl);
            const messages = await Promise.all(data.map(async (messageId) => {
                const readFilePath = await Path_1.default.getMyReadFilePath({
                    publicDirRoot: this.#publicDirRoot,
                    toUrl,
                    messageId,
                });
                const wasRead = await fs.pathExists(readFilePath);
                if (wasRead) {
                    return null;
                }
                const { data } = await axios_1.default.get(Path_1.default.getRemoteMessageUrl({
                    toUrl,
                    selfUrl: this.#selfUrl,
                    messageId,
                }));
                return new Message_1.default(data);
            }));
            return messages.filter((m) => m);
        }
        catch (error) {
            return null;
        }
    }
    async markMessageAsRead(toUrl, message) {
        const messagePath = await Path_1.default.getMyReadFilePath({
            publicDirRoot: this.#publicDirRoot,
            toUrl,
            messageId: message.id,
        });
        await fs.writeJson(messagePath, new Message_1.default({
            id: message.id,
            data: { wasRead: true, messageId: message.id },
        }).toObject());
    }
    async removeReadMessagesFromQueue(toUrl) {
        const queueFile = await Path_1.default.getOutboundQueueFile({
            toUrl,
            publicDirRoot: this.#publicDirRoot,
        });
        const queueFileExists = await fs.pathExists(queueFile);
        if (!queueFileExists) {
            return;
        }
        const queue = await fs.readJson(queueFile);
        const urlDirectoryBase = Path_1.default.getUrlDirectoryBase({
            selfUrl: this.#selfUrl,
            toUrl,
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
