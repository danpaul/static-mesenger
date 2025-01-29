import UserUrl from './UserUrl';
import Message, { MessageDataType, MessageObjectInterface } from './Message';
type UrlInput = UserUrl | string;
/**
 * The `Messenger` class handles sending and receiving messages from and to
 *  remote urls
 */
export default class Messenger {
    #private;
    /**
     * @param { url } Url Url object for the local server
     * @param { publicDirRoot } string The base directory for sending messages
     */
    constructor({ selfUrl, publicDirRoot, }: {
        selfUrl: UrlInput;
        publicDirRoot: string;
    });
    getUrl(url: UrlInput): UserUrl;
    getSelfUrl(): UserUrl;
    /**
     * @param { toUrl } Url|string Url object or string for the remote url
     * @param { publicDirRoot } Message Message object to be sent to remote url
     * @about Send message to remote url
     */
    sendMessage(toUrl: UrlInput, messageInput: Message | MessageDataType): Promise<void>;
    /**
     * @param { toUrl } Url|string Url object or string for the remote url
     * @about Read messages from a remote url
     */
    getMessages(toUrl: UrlInput): Promise<MessageObjectInterface[]>;
    /**
     * @param { toUrl } Url|string Url object or string for the remote url
     * @about Mark message as read so remote server can remove message from
     *  their queue
     */
    markMessageAsRead(toUrl: UrlInput, message: Message | MessageObjectInterface): Promise<void>;
    /**
     * @param { toUrl } Url|string Url object or string for the remote url
     * @about Removes messages from local queue that the remote url has indicated
     *  have been read.
     */
    removeReadMessagesFromQueue(toUrl: UrlInput): Promise<void>;
}
export {};
