export interface UserUrlInterface {
    url: string;
}
export default class UserUrl {
    #private;
    constructor(options: UserUrlInterface);
    getPort(): string;
    getUrlWithoutProtocol(): string;
    getUrl(): string;
    getUserKey(): string;
}
