import { getDatabase } from "@/app/lib/database";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "path";

export type Post = {
    id: number;
    account: number;
    path: string;
    release: number;
}

export type NewsResponse = {
    success: boolean;
    code?: number;
    key?: string;
};

const db = getDatabase();

export async function createPost(account: number, content: string): Promise<Post|NewsResponse> {

    const { count } = db.prepare<[], { count: number }>(`SELECT COUNT(*) AS count FROM news`).get()!;
    const path = `/data/user/${account}/news/`;

    const post = db
        .prepare(`INSERT INTO news (account, path, release) VALUES (?, ?, unixepoch()) RETURNING *`)
        .get(account, path) as Post | undefined;

    if (!post) {

        return {
            success: false,
            code: 26
        }

    }

    mkdirSync(path, { recursive: true });
    writeFileSync(join(path, `${count}.md`), content, "utf8");

    return post;

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