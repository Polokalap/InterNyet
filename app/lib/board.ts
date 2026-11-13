import boards from "@/public/boards.json";
import { getDatabase } from "@/app/lib/database";
import {copyFileSync, mkdirSync, rmSync, writeFileSync} from "node:fs";
import { join } from "path";
import sharp, { SharpInput } from "sharp";
import { fileTypeFromBlob } from "file-type";
import { rm } from "node:fs/promises";
import { User } from "@/app/lib/types";

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
    post: number | null;
    parent: number | null;
    spoiler: number;
    path: string;
    release: number;
    removed: number;
};

export class PostComment {

    constructor(
        public id: number,
        public account: number,
        public post: number | null,
        public parent: number | null,
        public spoiler: boolean,
        public path: string,
        public release: number,
        public removed: boolean,
    ) {}

    get isReply(): boolean {

        return this.parent !== null;

    }

    static fromRow(row: CommentRow): PostComment {

        return new PostComment(
            row.id,
            row.account,
            row.post,
            row.parent,
            Boolean(row.spoiler),
            row.path,
            row.release,
            Boolean(row.removed),
        );

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
        .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
        .avif({ quality: 50, effort: 2 })
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

export async function createBoardPost(user: User, board: string, title: string, content: string, media: Blob, spoiler: boolean, anon: boolean): Promise<Post|BoardResponse> {

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

        if (anon) {

            const { id } = db
                .prepare(`INSERT INTO posts (account, board, title, path, spoiler, release) VALUES (-1, ?, ?, '', ?, unixepoch()) RETURNING id`)
                .get(board, title, spoiler ? 1 : 0) as { id: number };

            const path = `data/user/-1/posts/${id}`;

            return db
                .prepare(`UPDATE posts SET path = ? WHERE id = ? RETURNING *`)
                .get(path, id) as PostRow | undefined;

        } else {

            const { id } = db
                .prepare(`INSERT INTO posts (account, board, title, path, spoiler, release) VALUES (?, ?, ?, '', ?, unixepoch()) RETURNING id`)
                .get(user.id, board, title, spoiler ? 1 : 0) as { id: number };

            const path = `data/user/${user.id}/posts/${id}`;

            return db
                .prepare(`UPDATE posts SET path = ? WHERE id = ? RETURNING *`)
                .get(path, id) as PostRow | undefined;

        }

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
        writeFileSync(join(row.path, "media"), image);

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

export async function getIfSpoiler(id: number | string): Promise<boolean> {

    const { spoiler } = db
        .prepare(`SELECT spoiler FROM posts WHERE id = ?`)
        .get(id) as { spoiler: boolean };

    return spoiler;

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
            WITH RECURSIVE thread(id, account, post, removed) AS (
                SELECT c.id, c.account, c.post, c.removed
                FROM comments c
                         JOIN posts p ON p.id = c.post
                WHERE p.board = ?
                UNION ALL
                SELECT c.id, c.account, t.post, c.removed
                FROM comments c
                         JOIN thread t ON c.parent = t.id
            )
            SELECT posts.*,
                   (unixepoch() - posts.release) / 86400
                       - (SELECT COUNT(*) FROM likes WHERE likes.post = posts.id)
                       - (SELECT COUNT(*) FROM thread
                          WHERE thread.post = posts.id
                            AND thread.account != posts.account
                AND thread.removed = 0) AS score
            FROM posts
            WHERE posts.board = ?
            ORDER BY score ASC, posts.release DESC
                LIMIT ? OFFSET ?
        `)
        .all(id, id, limit, from) as PostRow[];

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

export async function getAllUserInteractions(id: string, from: number, to: number): Promise<Post[]|BoardResponse> {

    const limit = to - from;

    const rows = db
        .prepare(`
            SELECT * FROM posts
            WHERE account = ?
               OR id IN (
                WITH RECURSIVE tree(id, root) AS (
                    SELECT id, post
                    FROM comments
                    WHERE post IS NOT NULL
                    UNION ALL
                    SELECT c.id, t.root
                    FROM comments c
                             JOIN tree t ON c.parent = t.id
                )
                SELECT tree.root
                FROM tree
                         JOIN comments c ON c.id = tree.id
                WHERE c.account = ?
                  AND c.removed = 0
            )
            ORDER BY release DESC
                LIMIT ? OFFSET ?
        `)
        .all(id, id, limit, from) as PostRow[];

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

export async function getUserInteractionCount(id: string): Promise<number> {

    const row = db
        .prepare(`
            SELECT COUNT(*) AS count
            FROM posts
            WHERE account = ?
               OR id IN (
                WITH RECURSIVE tree(id, root) AS (
                SELECT id, post
                FROM comments
                WHERE post IS NOT NULL
                UNION ALL
                SELECT c.id, t.root
                FROM comments c
                JOIN tree t ON c.parent = t.id
                )
                SELECT tree.root
                FROM tree
                JOIN comments c ON c.id = tree.id
                WHERE c.account = ?
              AND c.removed = 0
                )
        `)
        .get(id, id) as { count: number };

    return row.count;

}

export async function removePostMedia(id: number) {

    const row = db
        .prepare("SELECT * FROM posts WHERE id = ?")
        .get(id) as PostRow | undefined;

    if (!row) return;

    const imagePath = join(row?.path, "media");

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

export async function updateBoardPost(user: User, id: number, title: string, content: string, media: Blob | null, spoiler: boolean): Promise<Post|BoardResponse> {

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
            writeFileSync(join(post.path, "media"), image);

        }

    } catch {

        return { success: false, code: 26 };

    }

    const row = db
        .prepare("UPDATE posts SET title = ?, spoiler = ? WHERE id = ? RETURNING *")
        .get(title, spoiler ? 1 : 0, id) as PostRow | undefined;

    return row ? Post.fromRow(row) : { success: false, code: 26 };

}

export function getComments(id: number): PostComment[] {

    const rows = db
        .prepare(`
            SELECT * FROM comments
            WHERE post = ? AND parent IS NULL
            ORDER BY release ASC
        `)
        .all(id) as CommentRow[];

    return rows.map((row) => PostComment.fromRow(row));

}

export function getAllComments(id: number): PostComment[] {

    const rows = db
        .prepare(`
            WITH RECURSIVE thread AS (
                SELECT * FROM comments WHERE post = ?
                UNION ALL
                SELECT c.* FROM comments c
                                    JOIN thread t ON c.parent = t.id
            )
            SELECT * FROM thread ORDER BY release ASC
        `)
        .all(id) as CommentRow[];

    return rows.map((row) => PostComment.fromRow(row));

}

export function getAllCommentsOnComment(id: number): PostComment[] {

    const rows = db
        .prepare(`
            WITH RECURSIVE thread AS (
                SELECT * FROM comments WHERE parent = ?
                UNION ALL
                SELECT c.* FROM comments c
                                    JOIN thread t ON c.parent = t.id
            )
            SELECT * FROM thread ORDER BY release ASC
        `)
        .all(id) as CommentRow[];

    return rows.map((row) => PostComment.fromRow(row));

}

export function getTemplateComment(id: number, parent: number): PostComment {

    return new PostComment(
        id,
        -1,
        null,
        parent,
        false,
        "templates/-1/comments/-1",
        0,
        true,
    );

}

export function getIfCommentSpoiler(id: number): boolean {

    const row = db
        .prepare(`SELECT spoiler FROM comments WHERE id = ?`)
        .get(id) as { spoiler: number } | undefined;

    return row ? Boolean(row.spoiler) : false;

}

export async function createBoardComment(
    user: User,
    id: number,
    type: number,
    content: string,
    media: Blob | null,
    spoiler: boolean,
    anon: boolean,
): Promise<PostComment | BoardResponse> {

    if (type !== 0 && type !== 1) {

        return { success: false, code: 26 };

    }

    if (type === 0) {

        const post = await getPostById(id);

        if (!(post instanceof Post)) {

            return { success: false, code: 26 };

        }

    } else {

        const parent = await getCommentById(id);

        if (!(parent instanceof PostComment)) {

            return { success: false, code: 26 };

        }

    }

    if (content.length < 3) {

        return { success: false, code: 28 };

    }

    if (media && media.size > 10 * 1024 * 1024) {

        return { success: false, code: 12 };

    }

    const hasMedia = !!media && media.size > 0;

    if (hasMedia && media) {

        const fileType = await fileTypeFromBlob(media);

        if (!fileType || !["image/png", "image/jpeg", "image/webp"].includes(fileType.mime)) {

            return { success: false, code: 29 };

        }

    }

    const post = type === 0 ? id : null;
    const parent = type === 1 ? id : null;

    const insert = db.transaction((): CommentRow | undefined => {

        if (anon) {

            const {id: commentId} = db
                .prepare("INSERT INTO comments (account, post, parent, spoiler, path, release) VALUES (-1, ?, ?, ?, '', unixepoch()) RETURNING id")
                .get(post, parent, spoiler ? 1 : 0) as { id: number };

            const path = `data/user/-1/comments/${commentId}`;

            return db
                .prepare(`UPDATE comments
                          SET path = ?
                          WHERE id = ? RETURNING *`)
                .get(path, commentId) as CommentRow | undefined;

        } else {

            const {id: commentId} = db
                .prepare("INSERT INTO comments (account, post, parent, spoiler, path, release) VALUES (?, ?, ?, ?, '', unixepoch()) RETURNING id")
                .get(user.id, post, parent, spoiler ? 1 : 0) as { id: number };

            const path = `data/user/${user.id}/comments/${commentId}`;

            return db
                .prepare(`UPDATE comments
                          SET path = ?
                          WHERE id = ? RETURNING *`)
                .get(path, commentId) as CommentRow | undefined;

        }

    });

    const row = insert();

    if (!row) {

        return { success: false, code: 26 };

    }

    try {

        mkdirSync(row.path, { recursive: true });
        writeFileSync(join(row.path, "post.md"), content, "utf8");

        if (hasMedia && media) {

            const image = await convertImage(await media.arrayBuffer());
            writeFileSync(join(row.path, "media"), image);

        }

    } catch {

        db.prepare("DELETE FROM comments WHERE id = ?").run(row.id);
        rmSync(row.path, { recursive: true, force: true });

        return { success: false, code: 26 };

    }

    return PostComment.fromRow(row);

}

export async function deleteCommentMedia(id: number) {

    const row = db
        .prepare("SELECT * FROM comments WHERE id = ?")
        .get(id) as CommentRow | undefined;

    if (!row) return;

    const imagePath = join(row?.path, "media");

    copyFileSync("public/media.png", imagePath);

}

export async function deleteComment(id: number) {

    const row = db
        .prepare("SELECT path FROM comments WHERE id = ? AND removed = 0")
        .get(id) as { path: string } | undefined;

    if (!row) return;

    db
        .prepare(`UPDATE comments SET removed = 1, account = -1, path = 'templates/-1/comments/-1' WHERE id = ?`)
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

    if (row.removed == 1) {

        return PostComment.fromRow(
            {
                id: row.id,
                removed: 1,
                account: -1,
                parent: row.parent,
                path: "templates/-1/comments/-1",
                post: row.post,
                spoiler: 0,
                release: row.release,
            }
        );

    }

    return PostComment.fromRow(row);

}

export async function likePost(user: User, id: number, type: number) { // 0 = post, 1 = comment

    const col = type == 0 ? "post" : "comment";

    db
        .prepare(`INSERT OR IGNORE INTO likes (${col}, account) VALUES (?, ?)`)
        .run(id, user.id);

}

export async function removeLike(user: User, id: number, type: number) { // 0 = post, 1 = comment

    const col = type == 0 ? "post" : "comment";

    db
        .prepare(`DELETE FROM likes WHERE ${col} = ? AND account = ?`)
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

export async function getCommentsOnComment(id: number): Promise<PostComment[]> {

    const rows = db
        .prepare("SELECT * FROM comments WHERE parent = ? ORDER BY release ASC")
        .all(id) as CommentRow[];

    return rows.map((row) => PostComment.fromRow(row));

}

export function getLikesOnComment(id: number): number {

    const { count } = db
        .prepare("SELECT COUNT(*) as count FROM likes WHERE comment = ?")
        .get(id) as { count: number };

    return count;

}

export function hasLikedComment(id: number, account: number): boolean {

    const row = db
        .prepare("SELECT 1 FROM likes WHERE comment = ? AND account = ? LIMIT 1")
        .get(id, account);

    return !!row;

}

const interactions = `
    WITH RECURSIVE roots(id, root) AS (
        SELECT id, post FROM comments WHERE post IS NOT NULL
        UNION ALL
        SELECT c.id, r.root FROM comments c
            JOIN roots r ON c.parent = r.id
    ),
    interactions(post, release) AS (
        SELECT p.id, p.release
        FROM posts p
            JOIN follows f ON f.followed = p.account
        WHERE f.user = ?
        UNION ALL
        SELECT c.post, c.release
        FROM comments c
            JOIN follows f ON f.followed = c.account
        WHERE f.user = ? AND c.post IS NOT NULL AND c.removed = 0
        UNION ALL
        SELECT c.post, c.release
        FROM comments c
            JOIN posts p ON p.id = c.post
        WHERE p.account = ? AND c.account != ? AND c.removed = 0
        UNION ALL
        SELECT r.root, reply.release
        FROM comments reply
            JOIN comments parent ON parent.id = reply.parent
            JOIN roots r ON r.id = reply.id
        WHERE parent.account = ? AND reply.removed = 0 AND r.root IS NOT NULL
    )`;

export async function isNewInteraction(id: number): Promise<boolean> {

    const row = db
        .prepare(`
            ${interactions}
            SELECT 1
            FROM interactions
            WHERE release > COALESCE((SELECT viewed FROM inbox_views WHERE account = ?), 0)
            LIMIT 1
        `)
        .get(id, id, id, id, id, id);

    return row !== undefined;

}

export async function getInboxPosts(id: number, from: number, to: number): Promise<Post[]|BoardResponse> {

    const limit = to - from;

    const rows = db
        .prepare(`
            ${interactions}
            SELECT posts.*
            FROM posts
                JOIN (SELECT post AS id, MAX(release) AS activity FROM interactions GROUP BY post) a
                    ON a.id = posts.id
            ORDER BY a.activity DESC, posts.release DESC
            LIMIT ? OFFSET ?
        `)
        .all(id, id, id, id, id, limit, from) as PostRow[];

    if (rows.length === 0) {

        return {
            success: false,
            code: 26
        }

    }

    return rows.map((row) => Post.fromRow(row));

}

export async function markInboxViewed(id: number) {

    db
        .prepare(`
            INSERT INTO inbox_views (account, viewed) VALUES (?, unixepoch())
            ON CONFLICT(account) DO UPDATE SET viewed = unixepoch()
        `)
        .run(id);

}

export async function getTrending(from: number, to: number): Promise<Post[]|BoardResponse> {

    const limit = to - from;

    const rows = db
        .prepare(`
            WITH RECURSIVE thread(id, account, post, removed) AS (
                SELECT c.id, c.account, c.post, c.removed
                FROM comments c
                         JOIN posts p ON p.id = c.post
                UNION ALL
                SELECT c.id, c.account, t.post, c.removed
                FROM comments c
                         JOIN thread t ON c.parent = t.id
            )
            SELECT posts.*,
                   (unixepoch() - posts.release) / 86400
                       - (SELECT COUNT(*) FROM likes WHERE likes.post = posts.id)
                       - (SELECT COUNT(*) FROM thread
                          WHERE thread.post = posts.id
                            AND thread.account != posts.account
                AND thread.removed = 0) AS score
            FROM posts
            ORDER BY score ASC, posts.release DESC
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
