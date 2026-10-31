import { getDatabase } from "@/app/lib/database";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "path";

type PostRow = {
    id: number;
    account: number;
    title: string;
    path: string;
    release: number
};

export class Post {

    constructor(
        public id: number,
        public account: number,
        public title: string,
        public path: string,
        public release: number,
    ) {}

    static fromRow(row: { id: number; account: number; title: string; path: string; release: number }): Post {

        return new Post(row.id, row.account, row.title, row.path, row.release);

    }

}

export type NewsResponse = {
    success: boolean;
    code?: number;
    key?: string;
};

const db = getDatabase();

export async function createNewsPost(account: number, title: string, content: string): Promise<Post|NewsResponse> {

    const { count } = db.prepare<[], { count: number }>(`SELECT COUNT(*) AS count FROM news`).get()!;
    const path = `data/user/${account}/news/${count}`;

    const row = db
        .prepare(`INSERT INTO news (account, title, path, release) VALUES (?, ?, ?, unixepoch()) RETURNING *`)
        .get(account, title, path) as PostRow | undefined;

    if (!row) {

        return {
            success: false,
            code: 26
        }

    }

    mkdirSync(path, { recursive: true });
    writeFileSync(join(path, `post.md`), content, "utf8");

    return Post.fromRow(row);

}

export async function getPost(id: number): Promise<Post|NewsResponse> {

    const post = db
        .prepare(`SELECT * FROM news WHERE id = ?`)
        .get(id) as Post | undefined;

    if (!post) {

        return {
            success: false,
            code: 26
        }

    }

    return post;

}