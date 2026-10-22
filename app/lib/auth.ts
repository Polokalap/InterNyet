import argon2, { HashOptions } from "argon2";
import { randomBytes, createHash } from "crypto";
import { getDatabase } from "@/app/lib/database";

const options: HashOptions = {
    type: argon2.argon2id,
    memoryCost: 64000,
    timeCost: 4,
    parallelism: 2,
};

type AuthResponse = {
    success: boolean;
    message?: string;
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

export const db = getDatabase();
const allowedCharacters = /^[a-z0-9]{1,16}$/;

async function hash(tohash: string) {

    return argon2.hash(tohash, options);

}

function hashSha(token: string) {

    return createHash("sha256").update(token).digest("hex");

}

export async function addUser(user: string, password: string): Promise<AuthResponse> {

    const username = user.toLowerCase();

    if (!allowedCharacters.test(username)) {

        return { success: false, message: "Your username can only have english letters, numbers and underscores, and must be between 2 and 16 characters" };

    }

    if (password.length < 6 || password.length > 128) {

        return { success: false, message: "Your password must be between 6 and 128 characters" };

    }

    const userCheck = db
        .prepare("SELECT 1 FROM accounts WHERE user = ?")
        .get(username);

    if (userCheck) {

        return { success: false, message: "Username already taken" };

    }

    const hashed = await hash(password);

    db
        .prepare(`INSERT INTO accounts (user, password) VALUES (?, ?)`)
        .run(username, hashed);

    const account = db
        .prepare("SELECT * FROM accounts WHERE user = ?")
        .get(username) as Account | undefined;

    if (!account) {

        return { success: false, message: "Internal error" };

    }

    const session = await createSession(account, 180);

    return { success: true, key: session };

}

export async function authenticate(user: string, password: string): Promise<AuthResponse> {

    const username = user.toLowerCase();

    const account = db
        .prepare("SELECT * FROM accounts WHERE user = ?")
        .get(username) as Account | undefined;

    if (!account) {

        return { success: false, message: "Username or password doesn't exist" };

    }

    const match = await argon2.verify(account.password, password);

    if (!match) {

        return { success: false, message: "Username or password doesn't exist" };

    }

    const session = await createSession(account, 180);

    return { success: true, message: "Authentication successful!", key: session };

}

async function createSession(account: Account, days: number) {

    const token = randomBytes(32).toString("base64url");
    const expiration = Math.floor(Date.now() / 1000) + days * 86400;

    db
        .prepare("INSERT INTO sessions (account, token, expiration) VALUES (?, ?, ?)")
        .run(account.id, hashSha(token), expiration);

    return token;

}

export async function validate(token: string): Promise<AuthResponse> {

    const session = db
        .prepare("SELECT * FROM sessions WHERE token = ?")
        .get(hashSha(token)) as SessionToken | undefined;

    if (!session) {

        return { success: false, message: "Invalid session" };

    }

    if (session.expiration < Math.floor(Date.now() / 1000)) {

        db
            .prepare("DELETE FROM sessions WHERE token = ?")
            .run(hashSha(token));

        return { success: false, message: "Session expired" };

    }

    return { success: true, message: "Valid session" };

}

export async function removeSession(token: string): Promise<AuthResponse> {

    const session = db
        .prepare("SELECT * FROM sessions WHERE token = ?")
        .get(hashSha(token)) as SessionToken | undefined;

    if (!session) {

        return { success: false, message: "Invalid session" };

    }

    db
        .prepare("DELETE FROM sessions WHERE token = ?")
        .run(hashSha(token));

    return { success: false, message: "Session removed" };

}