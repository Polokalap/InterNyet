import boards from "@/public/boards.json";
import { getDatabase } from "@/app/lib/database";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "path";
import sharp, { SharpInput } from "sharp";
import { fileTypeFromBlob } from "file-type";
import {News, NewsResponse} from "@/app/lib/news";

const db = getDatabase();

type PostRow = {
    id: number;
    account: number;
    board: string;
    title: string;
    path: string;
    release: number
};

export class Post {

    constructor(
        public id: number,
        public account: number,
        public board: string,
        public title: string,
        public path: string,
        public release: number,
    ) {}

    static fromRow(row: { id: number; account: number; board: string; title: string; path: string; release: number }): Post {

        return new Post(row.id, row.account, row.board,  row.title, row.path, row.release);

    }

}

export type BoardResponse = {
    success: boolean;
    code?: number;
    key?: string;
};

async function convertImage(input: SharpInput): Promise<Buffer<ArrayBuffer>> {

    const image = await sharp(input)
        .rotate()
        .flatten({ background: "#fff1e1"})
        .jpeg({ quality: 20, mozjpeg: true })
        .toBuffer();

    return image;

}

export function getAllBoardIds() {

    const allBoards = [];

    for (const category of boards) {

        for (const board of category.boards) {

            allBoards.push(board.id);

        }

    }

    return allBoards;

}

export function getAllBoards() {

    const allBoards = [];

    for (const category of boards) {

        for (const board of category.boards) {

            allBoards.push(board);

        }

    }

    return allBoards;

}

export function getBoardById(boardId: string) {

    return getAllBoards().find((board) => board.id === boardId);

}

export async function createBoardPost(user: { id: number; name: string; display: string; color: string; created: number; cooldowns: Record<string, number> }, board: string, title: string, content: string, media: Blob): Promise<Post|BoardResponse> {

    if (media.size > 10 * 1024 * 1024) {

        return { success: false, code: 12 };

    }

    if (media.size === 0) {

        return { success: false, code: 29 };

    }

    const type = await fileTypeFromBlob(media);

    if (!type || !["image/png", "image/jpeg", "image/webp"].includes(type.mime)) {

        return { success: false, code: 29 };

    }

    if (title.length < 3) {

        return { success: false, code: 27 };

    }

    if (content.length < 10) {

        return { success: false, code: 28 };

    }

    const insert = db.transaction((): PostRow | undefined => {

        const { id } = db
            .prepare(`INSERT INTO posts (account, board, title, path, release) VALUES (?, ?, ?, '', unixepoch()) RETURNING id`)
            .get(user.id, board, title) as { id: number };

        const path = `data/user/${user.id}/posts/${id}`;

        return db
            .prepare(`UPDATE posts SET path = ? WHERE id = ? RETURNING *`)
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

        mkdirSync(row.path, { recursive: true });
        writeFileSync(join(row.path, "post.md"), content, "utf8");

        const image = await convertImage(await media.arrayBuffer());
        writeFileSync(join(row.path, "media.jpg"), image);

    } catch {

        db.prepare("DELETE FROM posts WHERE id = ?").run(row.id);
        return {
            success: false,
            code: 26
        }

    }

    return Post.fromRow(row);

}

export async function getPostById(id: number | string): Promise<Post|BoardResponse> {

    const row = db
        .prepare(`SELECT * FROM posts WHERE id = ?`)
        .get(id) as PostRow | undefined;

    if (!row) {

        return {
            success: false,
            code: 26
        }

    }

    return Post.fromRow(row);

}

export async function getBoardPosts(id: string, from: number, to: number): Promise<Post[]|NewsResponse> {

    const limit = to - from;

    const rows = db
        .prepare(`
            SELECT * FROM posts
            WHERE board = ?
            ORDER BY release DESC
            LIMIT ? OFFSET ?
        `)
        .all(id, limit, from) as PostRow[];

    if (rows.length === 0) {

        return {
            success: false,
            code: 26
        }

    }

    return rows.map((row) => Post.fromRow(row));

}

export async function getBoardPostCount(id: string): Promise<number> {

    const row = db
        .prepare(`SELECT COUNT(*) AS count FROM posts WHERE board = ?`)
        .get(id) as { count: number };

    return row.count;

}