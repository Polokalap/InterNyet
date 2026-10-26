import argon2, { HashOptions } from "argon2";
import { randomBytes, createHash } from "crypto";
import { getDatabase } from "@/app/lib/database";
import "server-only";
import {cache} from "react";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import { cpSync, mkdirSync } from "node:fs";

const options: HashOptions = {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 4,
    parallelism: 2,
};

type AuthResponse = {
    success: boolean;
    code?: number;
    key?: string;
};

type Account = {
    id: number;
    name: string;
    password: string;
};

type SessionToken = {
    id: number;
    account: number;
    token: string;
    expiration: number;
};

const db = getDatabase();
const allowedCharacters = /^[a-z0-9_]{1,16}$/;

mkdirSync("data/user", { recursive: true });

async function hash(tohash: string) {

    return argon2.hash(tohash, options);

}

function hashSha(token: string) {

    return createHash("sha256").update(token).digest("hex");

}

export async function addUser(user: string, password: string): Promise<AuthResponse> {

    const username = user.toLowerCase();

    if (!allowedCharacters.test(username)) {

        return { success: false, code: 1 };

    }

    if (password.length < 8 || password.length > 128) {

        return { success: false, code: 2 };

    }

    const userCheck = db
        .prepare("SELECT 1 FROM accounts WHERE user = ?")
        .get(username);

    if (userCheck) {

        return { success: false, code: 3 };

    }

    const hashed = await hash(password);

    try {

        db
            .prepare(`INSERT INTO accounts (user, password) VALUES (?, ?)`)
            .run(username, hashed);

    } catch (err) {

        return { success: false, code: 4 };

    }

    const account = db
        .prepare("SELECT * FROM accounts WHERE user = ?")
        .get(username) as Account | undefined;

    if (!account) {

        return { success: false, code: 4 };

    }

    db
        .prepare(`INSERT INTO settings (account, display) VALUES (?, ?)`)
        .run(account.id, user);

    const session = await createSession(account, 180);

    cpSync(`templates/user`, `data/user/${account.id}`, { recursive: true });

    return { success: true, key: session };

}

export async function authenticate(user: string, password: string): Promise<AuthResponse> {

    const username = user.toLowerCase();

    const account = db
        .prepare("SELECT * FROM accounts WHERE user = ?")
        .get(username) as Account | undefined;

    if (password.length < 8 || password.length > 128) {

        return { success: false, code: 5 };

    }

    if (!account) {

        await argon2.verify("$argon2id$v=19$m=65536,t=4,p=2$I2L57wqPXiYQgGJV6sPgRQ$DofqLXFb8A60KJsfC4z/fuv2Cq7vQnlsOy0uF90t1Nk", password);
        return { success: false, code: 5 };

    }

    const match = await argon2.verify(account.password, password);

    if (!match) {

        return { success: false, code: 5 };

    }

    const session = await createSession(account, 180);

    return { success: true, code: 6, key: session };

}

async function createSession(account: Account, days: number) {

    const token = randomBytes(256).toString("base64url");
    const expiration = Math.floor(Date.now() / 1000) + days * 86400;

    db
        .prepare("INSERT INTO sessions (account, token, expiration) VALUES (?, ?, ?)")
        .run(account.id, hashSha(token), expiration);

    return token;

}

export async function validate(token: string): Promise<AuthResponse> {

    const session = db
        .prepare("SELECT expiration FROM sessions WHERE token = ?")
        .get(hashSha(token)) as Pick<SessionToken, "expiration"> | undefined;

    if (!session) {

        return { success: false, code: 7 };

    }

    if (session.expiration < Math.floor(Date.now() / 1000)) {

        db
            .prepare("DELETE FROM sessions WHERE token = ?")
            .run(hashSha(token));

        return { success: false, code: 8 };

    }

    return { success: true, code: 9 };

}

export async function removeSession(token: string): Promise<AuthResponse> {

    const hashed = hashSha(token);

    const session = db
        .prepare("SELECT 1 FROM sessions WHERE token = ?")
        .get(hashed);

    if (!session) {

        return { success: false, code: 7 };

    }

    db
        .prepare("DELETE FROM sessions WHERE token = ?")
        .run(hashSha(token));

    return { success: true, code: 10 };

}

export async function getCurrentUser(token: string): Promise<{ id: number; name: string; display: string; created: number; } | null> {

    const row = db
        .prepare(`
            SELECT a.id, a.user AS name, st.display, a.created
            FROM sessions s
                     JOIN accounts a ON a.id = s.account
                     LEFT JOIN settings st ON st.account = a.id
            WHERE s.token = ? AND s.expiration > unixepoch()
        `)
        .get(hashSha(token)) as { id: number; name: string; display: string; created: number } | undefined;

    return row ?? null;

}

export async function getIfUser(): Promise<{ id: number; name: string; display: string; created: number; } | null> {

    const token = (await cookies()).get("session")?.value;
    const user = token ? await getCurrentUser(token) : null;

    return user ?? null;

}

export const requireUser = cache(async () => {

    const token = (await cookies()).get("session")?.value;
    const user = token ? await getCurrentUser(token) : null;

    if (!user) redirect("/account/login");

    return user;

});

export const requireNoUser = cache(async () => {

    const token = (await cookies()).get("session")?.value;
    const user = token ? await getCurrentUser(token) : null;

    if (user) redirect("/account");

});