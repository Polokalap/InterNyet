import sharp, {SharpInput} from "sharp";
import { getCurrentUser } from "@/app/lib/auth";
import { fileTypeFromBlob } from "file-type";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getDatabase } from "@/app/lib/database";

type SettingsResponse = {
    success: boolean;
    code?: number;
};

const db = getDatabase();
const displayCharacters = /^(?! )(?!.* {2})(?!.* $)[\p{L}\p{N}_ ]{1,32}$/u;
const allowedCharacters = /^[a-z0-9_]{1,16}$/;

async function convertImage(input: SharpInput): Promise<Buffer<ArrayBuffer>> {

    const image = await sharp(input)
        .rotate()
        .resize(256, 256, { fit: "cover" })
        .flatten({ background: "#fff1e1"})
        .jpeg({ quality: 20, mozjpeg: true })
        .toBuffer();

    return image;

}

export function getProfilePicture(id: number): string {

    return `/api/account/${id}/profile.jpeg/`;

}

export async function setProfilePicture(session: string, image: Blob): Promise<SettingsResponse> {

    const account = await getCurrentUser(session);

    if (!account) {

        return { success: false, code: 7 };

    }

    if (image.size > 10 * 1024 * 1024) {

        return { success: false, code: 12 };

    }

    if (image.size === 0) {

        return { success: false, code: 13 };

    }

    const type = await fileTypeFromBlob(image);

    if (!type || !["image/png", "image/jpeg", "image/webp"].includes(type.mime)) {

        return { success: false, code: 13 };

    }

    let jpeg: Buffer<ArrayBuffer>;

    try {

        jpeg = await convertImage(Buffer.from(await image.arrayBuffer()));

    } catch {

        return { success: false, code: 14 };

    }

    const dir = path.join(process.cwd(), "data", "user", `${account.id}`);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(process.cwd(), "data", "user", `${account.id}`, `profile.jpeg`), jpeg);

    return { success: true, code: 11 };

}

export async function setDisplayName(session: string, name: string): Promise<SettingsResponse> {

    const account = await getCurrentUser(session);

    if (!account) {

        return { success: false, code: 7 };

    }

    if (!displayCharacters.test(name)) {

        return { success: false, code: 1 };

    }

    db
        .prepare("UPDATE settings SET display = ? WHERE account = ?")
        .run(name, account.id);

    return { success: true, code: 15 };

}

export async function setUsername(session: string, name: string): Promise<SettingsResponse> {

    const account = await getCurrentUser(session);

    if (!account) {

        return { success: false, code: 7 };

    }

    if (!allowedCharacters.test(name)) {

        return { success: false, code: 1 };

    }

    const epoch = Math.floor(Date.now() / 1000);

    const cooldown = db
        .prepare("SELECT 1 FROM cooldowns WHERE account = ? AND key = ? AND expiration > ?")
        .get(account.id, "namechange", epoch);

    if (cooldown) {

        return { success: false, code: 20 };

    }

    const row = db
        .prepare("SELECT 1 FROM accounts WHERE user = ? AND id != ?")
        .get(name, account.id);

    if (row) {

        return { success: false, code: 18 };

    }

    const update = db.transaction(() => {

        db
            .prepare("UPDATE accounts SET user = ? WHERE id = ?")
            .run(name, account.id);

        db
            .prepare("INSERT INTO cooldowns (account, key, expiration) VALUES (?, ?, ?)")
            .run(account.id, "namechange", epoch + 7 * 86400);

    });

    update();

    return { success: true, code: 19 };

}

export async function getCooldown(id: number, key: string): Promise<unknown> {

    const epoch = Math.floor(Date.now() / 1000);

    const cooldown = db
        .prepare("SELECT 1 FROM cooldowns WHERE account = ? AND key = ? AND expiration > ?")
        .get(id, key, epoch);

    return cooldown;

}

export function setCooldown(account: number, key: string, seconds: number): SettingsResponse {

    const exists = db
        .prepare("SELECT 1 FROM accounts WHERE id = ?")
        .get(account);

    if (!exists) {

        return { success: false, code: 7 };

    }

    const expiration = Math.floor(Date.now() / 1000) + seconds;

    const update = db.transaction(() => {

        db
            .prepare("DELETE FROM cooldowns WHERE account = ? AND key = ?")
            .run(account, key);

        db
            .prepare("INSERT INTO cooldowns (account, key, expiration) VALUES (?, ?, ?)")
            .run(account, key, expiration);

    });

    update();

    return { success: true, code: 20 };

}