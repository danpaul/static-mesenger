import UserUrl from './UserUrl';
import Message, { MessageDataType } from './Message';
export interface MainInterface {
    selfUrl: UserUrl;
    publicDirRoot: string;
}
export default class Main {
    #private;
    constructor({ selfUrl, publicDirRoot }: MainInterface);
    getSelfUrl(): UserUrl;
    sendMessage(url: UserUrl, data: MessageDataType): Promise<void>;
    getMessages(url: UserUrl): Promise<null | Message[]>;
    markMessageAsRead(toUrl: UserUrl, message: Message): Promise<void>;
    updateMessageQueue(url: UserUrl): Promise<void>;
}
