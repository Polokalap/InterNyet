import boards from "@/public/boards.json";
import { getDatabase } from "@/app/lib/database";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "path";
import sharp, { SharpInput } from "sharp";
import { fileTypeFromBlob } from "file-type";
import { rm } from "node:fs/promises";
import { User } from "@/app/lib/auth";
import {redirect} from "next/navigation";

const db = getDatabase();

export type PostRow = {
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

type CommentRow = {
    id: number;
    account: number;
    post: number;
    path: string;
    release: number
};

export class PostComment {

    constructor(
        public id: number,
        public account: number,
        public post: number,
        public path: string,
        public release: number,
    ) {}

    static fromRow(row: { id: number; account: number; post: number; path: string; release: number }): PostComment {

        return new PostComment(row.id, row.account, row.post, row.path, row.release);

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
        .jpeg({ quality: 80, mozjpeg: true })
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

    if (title.length > 100) {

        return { success: false, code: 32 };

    }

    if (content.length > 10000) {

        return { success: false, code: 31 };

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

export async function getBoardPosts(id: string, from: number, to: number): Promise<Post[]|BoardResponse> {

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

export async function organizedBoardPosts(id: string, from: number, to: number): Promise<Post[]|BoardResponse> {

    const limit = to - from;

    const rows = db
        .prepare(`
            SELECT posts.*,
                   (unixepoch() - posts.release) / 86400
                       - (SELECT COUNT(*) FROM likes WHERE likes.post = posts.id)
                       - (SELECT COUNT(*) FROM comments WHERE comments.post = posts.id AND posts.account != comments.account) AS score
            FROM posts
            WHERE posts.board = ?
            ORDER BY score ASC, posts.release DESC
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

export async function getAllUserPosts(id: string, from: number, to: number): Promise<Post[]|BoardResponse> {

    const limit = to - from;

    const rows = db
        .prepare(`
            SELECT * FROM posts
            WHERE account = ?
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
        .prepare(`SELECT COUNT(*) AS count
                  FROM posts
                  WHERE board = ?`)
        .get(id) as { count: number };

    return row.count;

}

export async function getUserPostCount(id: string): Promise<number> {

    const row = db
        .prepare(`SELECT COUNT(*) AS count
                  FROM posts
                  WHERE account = ?`)
        .get(id) as { count: number };

    return row.count;

}

export async function removePostMedia(id: number) {

    const row = db
        .prepare("SELECT * FROM posts WHERE id = ?")
        .get(id) as PostRow | undefined;

    if (!row) return;

    const imagePath = join(row?.path, "media.jpg");

    copyFileSync("public/media.png", imagePath);

}

export async function deletePost(id: number) {

    const row = db
        .prepare("SELECT * FROM posts WHERE id = ?")
        .get(id) as PostRow | undefined;

    if (!row) return;

    db
        .prepare("DELETE FROM posts WHERE id = ?")
        .run(id);

    await rm(row.path, { recursive: true, force: true });

}

export async function updateBoardPost(user: User, id: number, title: string, content: string, media: Blob | null): Promise<Post|BoardResponse> {

    const post = await getPostById(id);

    if (!(post instanceof Post)) {

        return { success: false, code: 26 };

    }

    if (post.account !== user.id && user.role <= 0) {

        return { success: false, code: 7 };

    }

    if (title.length < 3) {

        return { success: false, code: 27 };

    }

    if (content.length < 10) {

        return { success: false, code: 28 };

    }

    if (media && media.size > 0) {

        if (media.size > 10 * 1024 * 1024) {

            return { success: false, code: 12 };

        }

        const type = await fileTypeFromBlob(media);

        if (!type || !["image/png", "image/jpeg", "image/webp"].includes(type.mime)) {

            return { success: false, code: 29 };

        }

    }

    try {

        writeFileSync(join(post.path, "post.md"), content, "utf8");

        if (media && media.size > 0) {

            const image = await convertImage(await media.arrayBuffer());
            writeFileSync(join(post.path, "media.jpg"), image);

        }

    } catch {

        return { success: false, code: 26 };

    }

    const row = db
        .prepare("UPDATE posts SET title = ? WHERE id = ? RETURNING *")
        .get(title, id) as PostRow | undefined;

    return row ? Post.fromRow(row) : { success: false, code: 26 };

}

export async function getComments(id: number): Promise<PostComment[]> {

    const rows = db
        .prepare("SELECT * FROM comments WHERE post = ?")
        .all(id) as PostComment[];

    return rows;

}

export async function createBoardComment(user: User, postId: number, content: string, media: Blob | null): Promise<PostComment|BoardResponse> {

    const post = await getPostById(postId);

    if (!(post instanceof Post)) {

        return { success: false, code: 26 };

    }

    if (content.length < 3) {

        return { success: false, code: 28 };

    }

    if (media && media.size > 10 * 1024 * 1024) {

        return { success: false, code: 12 };

    }

    const hasMedia = !!media && media.size > 0;

    if (hasMedia && media) {

        const type = await fileTypeFromBlob(media);

        if (!type || !["image/png", "image/jpeg", "image/webp"].includes(type.mime)) {

            return { success: false, code: 29 };

        }

    }

    const insert = db.transaction((): CommentRow | undefined => {

        const { id } = db
            .prepare("INSERT INTO comments (account, post, path, release) VALUES (?, ?, ?, unixepoch()) RETURNING id")
            .get(user.id, postId, "") as { id: number };

        const path = `data/user/${user.id}/comments/${id}`;

        return db
            .prepare(`UPDATE comments SET path = ? WHERE id = ? RETURNING *`)
            .get(path, id) as CommentRow | undefined;

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

        if (hasMedia && media) {

            const image = await convertImage(await media.arrayBuffer());
            writeFileSync(join(row.path, "media.jpg"), image);

        }

    } catch {

        db.prepare("DELETE FROM comments WHERE id = ?").run(row.id);

        return {
            success: false,
            code: 26
        }

    }

    return PostComment.fromRow(row);

}

export async function deleteCommentMedia(id: number) {

    const row = db
        .prepare("SELECT * FROM comments WHERE id = ?")
        .get(id) as CommentRow | undefined;

    if (!row) return;

    const imagePath = join(row?.path, "media.jpg");

    copyFileSync("public/media.png", imagePath);

}

export async function deleteComment(id: number) {

    const row = db
        .prepare("SELECT * FROM comments WHERE id = ?")
        .get(id) as CommentRow | undefined;

    if (!row) return;

    db
        .prepare("DELETE FROM comments WHERE id = ?")
        .run(id);

    await rm(row.path, { recursive: true, force: true });

}

export async function getCommentById(id: number | string): Promise<PostComment|BoardResponse> {

    const row = db
        .prepare(`SELECT * FROM comments WHERE id = ?`)
        .get(id) as CommentRow | undefined;

    if (!row) {

        return {
            success: false,
            code: 26
        }

    }

    return PostComment.fromRow(row);

}

export async function likePost(user: User, id: number) {

    db
        .prepare(`INSERT OR IGNORE INTO likes (post, account) VALUES (?, ?)`)
        .run(id, user.id);

}

export async function removeLike(user: User, id: number) {

    db
        .prepare(`DELETE FROM likes WHERE post = ? AND account = ?`)
        .run(id, user.id);

}

export function getPostLikeCount(id: number): number {

    const row = db
        .prepare("SELECT COUNT(*) AS count FROM likes WHERE post = ?")
        .get(id) as { count: number };

    return row.count;

}

export function hasLikedPost(id: number, account: number): boolean {

    const row = db
        .prepare("SELECT 1 FROM likes WHERE post = ? AND account = ? LIMIT 1")
        .get(id, account);

    return !!row;

}
