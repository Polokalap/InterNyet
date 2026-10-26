import {headers} from "next/headers";

export async function verifyTurnstile(formData: FormData, expectedAction: string) {

    const isProd = process.env.NODE_ENV === "production";

    if (!isProd) {

        return true;

    }

    const token = String(formData.get("cf-turnstile-response") ?? "");
    if (!token) return false;

    const h = await headers();
    const ip =
        h.get("CF-Connecting-IP") ??
        h.get("x-forwarded-for")?.split(",")[0].trim() ??
        null;

    const body = new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
    });

    if (ip) body.set("remoteip", ip);

    try {

        const res = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            { method: "POST", body }
        );

        const data = await res.json();

        return (
            data.success === true &&
            data.action === expectedAction &&
            data.hostname === process.env.TURNSTILE_HOSTNAME
        );

    } catch {

        return false;

    }

}