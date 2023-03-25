export type MessageDataType = number | string | object | Array<any>;
export interface MessageCreateInterface {
    data?: MessageDataType;
    id?: string;
    created?: string;
}
export interface MessageObjectInterface {
    data: any;
    id: string;
    created: string;
}
export default class Message {
    #private;
    constructor(options: MessageCreateInterface);
    get data(): MessageDataType;
    get id(): string;
    get created(): string;
    toObject(): MessageObjectInterface;
    toJson(): string;
}
