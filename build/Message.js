"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const uuid_1 = require("uuid");
class Message {
    #data;
    #id;
    #created;
    constructor(options) {
        const inputData = typeof options === 'string' ? JSON.parse(options) : options;
        this.#data = inputData.data || '';
        this.#id = inputData.id || (0, uuid_1.v4)();
        this.#created = inputData.created || Date.now();
    }
    get data() {
        return this.#data;
    }
    get id() {
        return this.#id;
    }
    get created() {
        return this.#created;
    }
    toObject() {
        return {
            data: this.#data,
            id: this.#id,
            created: this.#created,
        };
    }
    toJson() {
        return JSON.stringify(this.toObject());
    }
}
exports.default = Message;
