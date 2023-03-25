import UserUrl from './UserUrl';
import Message from './Message';
export default class Messenger {
    #private;
    constructor({ url, publicDirRoot }: {
        url: UserUrl;
        publicDirRoot: string;
    });
    sendMessage(toUrl: UserUrl, message: Message): Promise<void>;
    getMessages(toUrl: UserUrl): Promise<any[] | null>;
    markMessageAsRead(toUrl: UserUrl, message: Message): Promise<void>;
    removeReadMessagesFromQueue(toUrl: UserUrl): Promise<void>;
}
