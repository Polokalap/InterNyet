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