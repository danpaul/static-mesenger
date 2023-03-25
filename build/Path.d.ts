import UserUrl from './UserUrl';
import Message from './Message';
export default class Path {
    static getOutboundMessageDir({ publicDirRoot, toUrl, }: {
        publicDirRoot: string;
        toUrl: UserUrl;
    }): Promise<string>;
    static getOutboundMessageFile({ message, publicDirRoot, toUrl, }: {
        message: Message;
        publicDirRoot: string;
        toUrl: UserUrl;
    }): Promise<string>;
    static getOutboundQueueFile({ publicDirRoot, toUrl, }: {
        publicDirRoot: string;
        toUrl: UserUrl;
    }): Promise<string>;
    static getToUrlBase({ selfUrl, toUrl, }: {
        selfUrl: UserUrl;
        toUrl: UserUrl;
    }): string;
    static getRemoteQueueUrl({ selfUrl, toUrl, }: {
        selfUrl: UserUrl;
        toUrl: UserUrl;
    }): string;
    static getRemoteMessageUrl({ selfUrl, toUrl, messageId, }: {
        selfUrl: UserUrl;
        toUrl: UserUrl;
        messageId: string;
    }): string;
    static getMyReadDirBase({ publicDirRoot, toUrl, }: {
        publicDirRoot: string;
        toUrl: UserUrl;
    }): Promise<string>;
    static getMyReadFilePath({ publicDirRoot, toUrl, messageId, }: {
        publicDirRoot: string;
        toUrl: UserUrl;
        messageId: string;
    }): Promise<string>;
    static getUrlDirectoryBase({ toUrl, selfUrl, }: {
        toUrl: UserUrl;
        selfUrl: UserUrl;
    }): string;
}
