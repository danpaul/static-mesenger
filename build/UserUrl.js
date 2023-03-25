"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_url_1 = require("node:url");
class UserUrl {
    #protocol;
    #hostname;
    #pathname;
    #port;
    constructor(options) {
        const url = new node_url_1.URL(options.url.toLowerCase());
        this.#protocol = url.protocol;
        this.#hostname = url.hostname;
        this.#pathname = url.pathname;
        this.#port = url.port;
    }
    getPort() {
        return this.#port ? `:${this.#port}` : '';
    }
    getUrlWithoutProtocol() {
        return `${this.#hostname}${this.getPort()}${this.#pathname}`;
    }
    getUrl() {
        return `${this.#protocol}//${this.getUrlWithoutProtocol()}`;
    }
    getUserKey() {
        return Buffer.from(this.getUrlWithoutProtocol()).toString('base64');
    }
}
exports.default = UserUrl;
