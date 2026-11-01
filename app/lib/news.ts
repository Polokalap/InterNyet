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

    const insert = db.transaction((): PostRow | undefined => {

        const { id } = db
            .prepare(`INSERT INTO news (account, title, path, release) VALUES (?, ?, '', unixepoch()) RETURNING id`)
            .get(account, title) as { id: number };

        const path = `data/user/${account}/news/${id}`;

        return db
            .prepare(`UPDATE news SET path = ? WHERE id = ? RETURNING *`)
            .get(path, id) as PostRow | undefined;

    });

    const row = insert();

    if (!row) {

        return {
            success: false,
            code: 26
        }

    }

    try {

        mkdirSync(row.path, {recursive: true});
        writeFileSync(join(row.path, `post.md`), content, "utf8");

    } catch {

        db.prepare("DELETE FROM news WHERE id = ?").run(row.id);
        return {
            success: false,
            code: 26
        }

    }

    return Post.fromRow(row);

}

export async function getPost(id: number | string): Promise<Post|NewsResponse> {

    const row = db
        .prepare(`SELECT * FROM news WHERE id = ?`)
        .get(id) as PostRow | undefined;

    if (!row) {

        return {
            success: false,
            code: 26
        }

    }

    return Post.fromRow(row);

}

export async function getPostsFromUser(from: number, to: number, account: number): Promise<Post[]|NewsResponse> {

    const limit = to - from;

    const rows = db
        .prepare(`
            SELECT * FROM news
            WHERE account = ?
            ORDER BY release DESC
            LIMIT ? OFFSET ?
        `)
        .all(account, limit, from) as PostRow[];

    if (rows.length === 0) {

        return {
            success: false,
            code: 26
        }

    }

    return rows.map((row) => Post.fromRow(row));

}

export async function getPosts(from: number, to: number): Promise<Post[]|NewsResponse> {

    const limit = to - from;

    const rows = db
        .prepare(`
            SELECT * FROM news
            ORDER BY release DESC
            LIMIT ? OFFSET ?
        `)
        .all(limit, from) as PostRow[];

    if (rows.length === 0) {

        return {
            success: false,
            code: 26
        }

    }

    return rows.map((row) => Post.fromRow(row));

}

export async function getPostCount(): Promise<number> {

    const row = db
        .prepare(`SELECT COUNT(*) AS total FROM news`)
        .get() as { total: number };

    return row.total;

}

export async function getPostCountFromUser(id: number): Promise<number> {

    const row = db
        .prepare(`SELECT COUNT(*) AS total FROM news WHERE account = ?`)
        .get(id) as { total: number };

    return row.total;

}