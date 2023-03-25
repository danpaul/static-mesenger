export type MessageDataType = number | string | object | Array<any>;
export interface MessageCreateInterface {
    data?: MessageDataType;
    id?: string;
    created?: number;
}
export default class Message {
    #private;
    constructor(options: MessageCreateInterface | string);
    get data(): MessageDataType;
    get id(): string;
    get created(): number;
    toObject(): {
        data: MessageDataType;
        id: string;
        created: number;
    };
    toJson(): string;
}
