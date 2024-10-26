export interface CreateThreadDto {
    content?: string;
    userId: number;
    mainThreadId?: number;
    media?: ThreadMedia[];
}

export interface ThreadMedia {
    url: string;
}