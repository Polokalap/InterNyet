import {headers} from "next/headers";

type SiteverifyResponse = {
    success: boolean;
    "error-codes"?: string[];
    challenge_ts?: string;
    hostname?: string;
    action?: string;
    cdata?: string;
};

export async function verifyTurnstile(formData: FormData, expectedAction: string) {

    const token = String(formData.get("cf-turnstile-response") ?? "");
    if (!token) {
        console.warn("[turnstile] missing token in form data (widget didn't finish, or field name differs)");
        return false;
    }

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
            { method: "POST", body, signal: AbortSignal.timeout(5000) }
        );

        if (!res.ok) {
            console.error(`[turnstile] siteverify HTTP ${res.status}`);
            return false;
        }

        const data = (await res.json()) as SiteverifyResponse;

        if (data.success !== true) {
            console.warn("[turnstile] verification failed", {
                errorCodes: data["error-codes"],
                hostname: data.hostname,
                action: data.action,
            });
            return false;
        }

        if (data.action !== expectedAction) {
            console.warn("[turnstile] action mismatch", {
                expected: expectedAction,
                got: data.action,
            });
            return false;
        }

        if (data.hostname !== process.env.TURNSTILE_EXPECTED_HOSTNAME) {
            console.warn("[turnstile] hostname mismatch", {
                expected: process.env.TURNSTILE_EXPECTED_HOSTNAME,
                got: data.hostname,
            });
            return false;
        }

        return true;

    } catch (err) {

        console.error("[turnstile] siteverify request threw", err);
        return false;

    }

}