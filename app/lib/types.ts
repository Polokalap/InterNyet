export type User = {
    id: number;
    name: string;
    display: string;
    color: string;
    created: number;
    role: number;
    cooldowns: Record<string, number>;
}

export type PlainComment = {
    id: number;
    account: number;
    post: number | null;
    parent: number | null;
    spoiler: boolean;
    path: string;
    release: number;
    removed: boolean;
};