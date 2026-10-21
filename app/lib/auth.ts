import argon2, { HashOptions } from "argon2";
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
};

export const db = getDatabase();

async function hash(tohash: string) {

    return argon2.hash(tohash, options);

}

async function addUser(user: string, password: string): Promise<AuthResponse> {

    const username = user.toLowerCase();

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

    return { success: true };

}

addUser("Polokalap", "meow").then(r => console.log(r));