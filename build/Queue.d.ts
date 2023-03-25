import UserUrl from './UserUrl';
import Message from './Message';
export default class Queue {
    #private;
    constructor({ url, publicDirRoot, }: {
        url: UserUrl;
        publicDirRoot: string | undefined;
    });
    getOutboundMessageDir(): Promise<string>;
    getOutboundMessageFile(message: Message): Promise<string>;
    writeOutboundMessageToFile(message: Message): Promise<void>;
}
