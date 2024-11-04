export interface CreateThreadDto {
    content?: string;
    userId: number;
    mainThreadId?: number;
    media?: ThreadMedia[];
}

export interface ThreadMedia {
    url: string;
}

export interface CreateReplyDto {
    content: string;
    userId: number;
    threadId: number;
    media?: ThreadMedia[];
}
