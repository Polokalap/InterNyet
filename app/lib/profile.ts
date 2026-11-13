import { getDatabase } from "@/app/lib/database";

const db = getDatabase();

export type ProfileResponse = {
    success: boolean;
    code?: number;
};

export async function getFollowers(id: number): Promise<number> {

    const { followers } = db
        .prepare("SELECT COUNT(*) as followers FROM follows WHERE followed = ?")
        .get(id) as { followers: number };

    return followers;

}

export async function isFollowing(id: number, followed: number): Promise<boolean> {

    const row = db
        .prepare("SELECT 1 FROM follows WHERE user = ? AND followed = ?")
        .get(id, followed);

    return row !== undefined;

}

export async function toggleFollowUser(id: number, followed: number): Promise<ProfileResponse> {

    try {

        const following = await isFollowing(id, followed);

        if (following) {

            db
                .prepare("DELETE FROM follows WHERE user = ? AND followed = ?")
                .run(id, followed);

        } else {

            db
                .prepare("INSERT INTO follows (user, followed) VALUES (?, ?)")
                .run(id, followed);

        }

    } catch {

        return { success: false, code: 26 };

    }

    return { success: true };

}

export async function getClout(id: number): Promise<number> {

    const { clout } = db
        .prepare(`
            WITH RECURSIVE
                tree(id, account, removed, root) AS (
                    SELECT c.id, c.account, c.removed, c.post
                    FROM comments c
                    WHERE c.post IS NOT NULL
                    UNION ALL
                    SELECT c.id, c.account, c.removed, t.root
                    FROM comments c
                             JOIN tree t ON c.parent = t.id
                ),
                replies(id, account, removed) AS (
                    SELECT c.id, c.account, c.removed
                    FROM comments c
                    WHERE c.account = ?
                    UNION ALL
                    SELECT c.id, c.account, c.removed
                    FROM comments c
                             JOIN replies r ON c.parent = r.id
                )
            SELECT
                (SELECT COUNT(*) FROM likes l JOIN posts p ON p.id = l.post WHERE p.account = ?)
                    + (SELECT COUNT(*) FROM likes l JOIN comments c ON c.id = l.comment WHERE c.account = ?)
                    + (SELECT COUNT(*) FROM tree t JOIN posts p ON p.id = t.root
                       WHERE p.account = ? AND t.removed = 0 AND t.account != ?)
                + (SELECT COUNT(*) FROM replies r
            WHERE r.removed = 0 AND r.account != ?)
                AS clout
        `)
        .get(id, id, id, id, id, id) as { clout: number };

    return clout;

}