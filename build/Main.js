"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const Message_1 = __importDefault(require("./Message"));
const Messenger_1 = __importDefault(require("./Messenger"));
class Main {
    #selfUrl;
    #messenger;
    constructor({ selfUrl, publicDirRoot }) {
        this.#selfUrl = selfUrl;
        this.#messenger = new Messenger_1.default({ url: selfUrl, publicDirRoot });
    }
    getSelfUrl() {
        return this.#selfUrl;
    }
    async sendMessage(url, data) {
        await this.#messenger.sendMessage(url, new Message_1.default({ data }));
    }
    async getMessages(url) {
        return this.#messenger.getMessages(url);
    }
    async markMessageAsRead(toUrl, message) {
        await this.#messenger.markMessageAsRead(toUrl, message);
    }
    async updateMessageQueue(url) {
        await this.#messenger.removeReadMessagesFromQueue(url);
    }
}
exports.default = Main;
