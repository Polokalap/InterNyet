import { headers } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { createHash } from "crypto";
import {clients, fingerprints, getClientByIp, getFingerprintByIp} from "@/app/lib/store";
import { getDatabase } from "@/app/lib/database";
import rules from "@/public/rules.json";

export class Fingerprint {

    private salt: Buffer;
    private digest: Buffer;
    private trust = 2; // 0 min, 4 max

    constructor(
        protected fingerprint: string,
    ) {

        this.salt = randomBytes(32);
        this.digest = this.hash(fingerprint);

    }

    private hash(value: string): Buffer {

        return createHmac("sha256", this.salt).update(value).digest();

    }

    public verify(fgp: string): boolean {

        return timingSafeEqual(this.hash(fgp), this.digest);

    }

    public getDigest(): string {

        return this.digest.toString("hex");

    }

    public getTrust(): number {

        return this.trust;

    }

    public setTrust(trust: number): void {

        this.trust = Math.max(Math.min(trust, 4), 0);

    }

}

export type SecResponse = {
    success: boolean;
    code?: number;
}

export type RateLimit = {
    allowed: boolean;
}

const db = await getDatabase();
const hit = db.prepare(`
    INSERT INTO ratelimit (fingerprint, action, count, window_start)
    VALUES (@fp, @action, 1, @now)
        ON CONFLICT (fingerprint, action) DO UPDATE SET
            count = CASE
            WHEN window_start + @windowMs <= @now THEN 1
            ELSE count + 1
    END,
    window_start = CASE
      WHEN window_start + @windowMs <= @now THEN @now
      ELSE window_start
    END
  RETURNING count, window_start
`);

export async function verifyTurnstile(formData: FormData, expectedAction: string) {

    const isProd = process.env.PUBLIC_NEXT_PUBLIC_PRODUCTION;

    if (!isProd) {

        return true;

    }

    const token = String(formData.get("cf-turnstile-response") ?? "");
    if (!token) return false;

    const secret = process.env.TURNSTILE_SECRET_KEY;
    const expectedHostname = process.env.TURNSTILE_HOSTNAME;
    if (!secret || !expectedHostname) return false;

    const h = await headers();
    const ip =
        h.get("CF-Connecting-IP") ??
        h.get("x-forwarded-for")?.split(",")[0].trim() ??
        null;

    const body = new URLSearchParams({
        secret,
        response: token,
    });

    if (ip) body.set("remoteip", ip);

    try {

        const res = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {method: "POST", body}
        );

        const data = await res.json();

        return (
            data.success === true &&
            data.action === expectedAction &&
            data.hostname === expectedHostname
        );

    } catch {

        return false;

    }

}

function hashSha(value: string) {

    return createHash("sha256").update(value).digest("hex");

}

export async function getFingerprint(ip: string): Promise<Fingerprint> {

    const existing = getFingerprintByIp(ip);
    if (existing) return existing;

    const fingerprint = new Fingerprint(hashSha(JSON.stringify(getClientByIp(ip))));
    fingerprints.set(ip, fingerprint);

    return fingerprint;

}

export async function runAction(action: string): Promise<RateLimit> {

    const rule = rules.find((r) => r.action === action);

    if (!rule) {

        return { allowed: true };

    }

    const header = await headers();
    const ip =
        header.get("cf-connecting-ip") ??
        header.get("x-forwarded-for")?.split(",")[0].trim() ??
        "127.0.0.1";

    try {

        const fingerprint = await getFingerprint(ip);
        const { count } = hit.get({
            fp: fingerprint.getDigest(),
            action,
            now: Date.now(),
            windowMs: rule.timeout * 1000,
        }) as { count: number; window_start: number };

        return { allowed: count <= rule.allow };

    } catch (e) {

        return { allowed: true };

    }

}